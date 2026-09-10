import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle2, CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Availability in UK time (Europe/London), by weekday (0 = Sunday)
const UK_AVAILABILITY: Record<number, { start: number; end: number } | null> = {
  0: { start: 10, end: 22 }, // Sunday
  1: { start: 15, end: 23 }, // Monday
  2: { start: 15, end: 23 }, // Tuesday
  3: { start: 17, end: 24 }, // Wednesday
  4: { start: 17, end: 24 }, // Thursday
  5: { start: 17, end: 24 }, // Friday
  6: { start: 10, end: 22 }, // Saturday
};

const londonOffsetMinutes = (utcMs: number) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(new Date(utcMs))
      .map((p) => [p.type, p.value])
  ) as Record<string, string>;
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute)
  );
  return (asUTC - utcMs) / 60000;
};

// Build a real Date for a given UK wall-clock time on a given calendar day
const ukWallClockToDate = (day: Date, hour: number, minute: number) => {
  const guess = Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
  let ts = guess - londonOffsetMinutes(guess) * 60000;
  ts = guess - londonOffsetMinutes(ts) * 60000;
  return new Date(ts);
};

const fmtTime = (d: Date, timeZone?: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...(timeZone ? { timeZone } : {}),
  }).format(d);

const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const isDayAvailable = (date: Date) => !!UK_AVAILABILITY[date.getDay()];

interface Slot {
  value: string; // UK time label, stored in DB
  ukLabel: string;
  localLabel: string;
  localDayNote: string;
}

const buildSlots = (date: Date): Slot[] => {
  const window = UK_AVAILABILITY[date.getDay()];
  if (!window) return [];
  const slots: Slot[] = [];
  for (let m = window.start * 60; m < window.end * 60; m += 30) {
    const d = ukWallClockToDate(date, Math.floor(m / 60), m % 60);
    if (d.getTime() < Date.now()) continue;
    const ukLabel = fmtTime(d, "Europe/London");
    const localLabel = fmtTime(d);
    const ukDay = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", day: "2-digit" }).format(d);
    const localDay = new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(d);
    slots.push({
      value: ukLabel,
      ukLabel,
      localLabel,
      localDayNote: ukDay === localDay ? "" : " (next day)",
    });
  }
  return slots;
};

// Schema validation for booking form
const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(254, "Email must be less than 254 characters"),
  socialHandle: z.string().trim().min(1, "Social handle is required").max(50, "Social handle must be less than 50 characters"),
  niche: z.string().max(100, "Niche must be less than 100 characters").optional().or(z.literal("")),
  audienceSize: z.string().optional(),
  productType: z.string().optional(),
  holdback: z.string().max(2000, "Message must be less than 2000 characters").optional().or(z.literal("")),
});

const Booking = () => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    socialHandle: "",
    niche: "",
    audienceSize: "",
    productType: "",
    holdback: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSlots = useMemo(() => (selectedDate ? buildSlots(selectedDate) : []), [selectedDate]);
  const selectedSlot = availableSlots.find((s) => s.value === selectedTime);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data with Zod
    const validationResult = bookingSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select a preferred date and time for your call.");
      return;
    }
    
    const validatedData = validationResult.data;
    
    // Get bonus tier from cookie
    const getBonusTier = () => {
      const cookies = document.cookie.split(';');
      const bonusCookie = cookies.find(c => c.trim().startsWith('esther_bonus_tier='));
      return bonusCookie ? bonusCookie.split('=')[1] : 'none';
    };
    
    const bonusTier = getBonusTier();
    
    // Parse audience size to number
    const parseFollowers = (audienceSize: string) => {
      if (!audienceSize) return null;
      if (audienceSize === "0-1k") return 500;
      if (audienceSize === "1k-10k") return 5000;
      if (audienceSize === "10k-50k") return 30000;
      if (audienceSize === "50k-100k") return 75000;
      if (audienceSize === "100k+") return 100000;
      return null;
    };
    
    // Save to database with requested date/time
    const { data: insertedBooking, error } = await supabase.from('bookings').insert({
      name: validatedData.name,
      email: validatedData.email,
      instagram_handle: validatedData.socialHandle,
      followers: parseFollowers(validatedData.audienceSize || ''),
      niche: validatedData.niche || null,
      message: validatedData.holdback || null,
      bonus_tier: bonusTier,
      source_page: window.location.pathname,
      requested_date: format(selectedDate, 'yyyy-MM-dd'),
      requested_time: selectedTime,
      status: 'pending'
    }).select('booking_token').single();
    
    if (error || !insertedBooking) {
      console.error('Error saving booking:', error);
      toast.error("There was an error submitting your booking. Please try again.");
      return;
    }

    // Send booking notification to admin
    try {
      await supabase.functions.invoke('send-booking-email', {
        body: {
          type: 'booking_received',
          to: validatedData.email,
          name: validatedData.name,
          bookingToken: insertedBooking.booking_token,
          requestedDate: format(selectedDate, 'EEEE, MMMM d, yyyy'),
          requestedTime: selectedTime,
        }
      });
      console.log('Booking notification sent successfully');
    } catch (emailError) {
      console.error('Failed to send booking notification:', emailError);
      // Don't block the booking - email is non-critical
    }
    
    setSubmitted(true);
    toast.success("Your booking request has been submitted!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center space-y-6 animate-fade-up">
          <div className="w-20 h-20 rounded-full gradient-red-orange flex items-center justify-center mx-auto glow-orange">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Thank You!
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Your booking request has been submitted. Check your email for a confirmation with all the details.
          </p>
          <p className="text-muted-foreground">
            We'll review your request and confirm your call time within 24 hours.
          </p>
          <Button 
            variant="elite-outline" 
            size="lg"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 relative">
      <div className="absolute inset-0 gradient-radial-red opacity-20" />
      <div className="absolute inset-0 gradient-radial-blue opacity-20" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-4 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold">
            Let's Build Your <span className="text-gradient-red-orange">Digital Product.</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Tell us a little about your content so we can prepare for the call.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="elite-card rounded-2xl p-8 space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          {/* Social Handle */}
          <div className="space-y-2">
            <Label htmlFor="social">Social Handle *</Label>
            <Input
              id="social"
              placeholder="@yourhandle"
              value={formData.socialHandle}
              onChange={(e) => handleChange("socialHandle", e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          {/* Niche */}
          <div className="space-y-2">
            <Label htmlFor="niche">Niche</Label>
            <Input
              id="niche"
              placeholder="e.g., Fitness, Business, Productivity"
              value={formData.niche}
              onChange={(e) => handleChange("niche", e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* Audience Size */}
          <div className="space-y-2">
            <Label htmlFor="audience">Audience Size</Label>
            <Select onValueChange={(value) => handleChange("audienceSize", value)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select audience size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1k">0 - 1,000</SelectItem>
                <SelectItem value="1k-10k">1,000 - 10,000</SelectItem>
                <SelectItem value="10k-50k">10,000 - 50,000</SelectItem>
                <SelectItem value="50k-100k">50,000 - 100,000</SelectItem>
                <SelectItem value="100k+">100,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Type */}
          <div className="space-y-2">
            <Label htmlFor="product">What type of product are you interested in?</Label>
            <Select onValueChange={(value) => handleChange("productType", value)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course">Online Course</SelectItem>
                <SelectItem value="guide">Digital Guide / E-book</SelectItem>
                <SelectItem value="template">Templates / Tools</SelectItem>
                <SelectItem value="membership">Membership / Community</SelectItem>
                <SelectItem value="other">Other / Not Sure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Date */}
          <div className="space-y-2">
            <Label>Preferred Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background/50",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select your preferred date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => {
                    setSelectedDate(d);
                    setSelectedTime("");
                  }}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                    date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ||
                    !isDayAvailable(date)
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <Label>Preferred Time *</Label>
            <Select onValueChange={setSelectedTime} value={selectedTime} disabled={!selectedDate}>
              <SelectTrigger className="bg-background/50">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder={selectedDate ? "Select your preferred time" : "Pick a date first"} />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.localLabel} your time{slot.localDayNote} · {slot.ukLabel} UK
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Times shown in your timezone ({localTimeZone}) alongside UK time. Available Mon–Tue 3pm–11pm, Wed–Fri
              5pm–12am, Sat–Sun 10am–10pm UK time.
            </p>
          </div>

          {/* Holdback */}
          <div className="space-y-2">
            <Label htmlFor="holdback">What's the main thing holding you back from launching?</Label>
            <Textarea
              id="holdback"
              placeholder="Tell us about your challenges..."
              value={formData.holdback}
              onChange={(e) => handleChange("holdback", e.target.value)}
              rows={4}
              className="bg-background/50 resize-none"
            />
          </div>

          <Button 
            type="submit" 
            variant="gradient" 
            size="lg" 
            className="w-full"
          >
            Submit Booking Request
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            By submitting this form, you agree to be contacted about your booking.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Booking;

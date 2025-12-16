import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, CheckCircle2, AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";

interface TimeSlot {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
}

const generateTimeRange = (start: string, end: string): string[] => {
  const times: string[] = [];
  const parseTime = (t: string) => {
    const [time, period] = t.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };
  
  const formatTime = (mins: number): string => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const startMins = parseTime(start);
  const endMins = parseTime(end);
  
  for (let m = startMins; m <= endMins; m += 30) {
    times.push(formatTime(m));
  }
  
  return times;
};

const Reschedule = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setError("Invalid booking link. Please check your email for the correct link.");
      setLoading(false);
      return;
    }

    const fetchBookingAndSlots = async () => {
      // Fetch booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_token", token)
        .maybeSingle();

      if (bookingError || !bookingData) {
        setError("Booking not found. This link may have expired.");
        setLoading(false);
        return;
      }

      if (bookingData.status === "confirmed") {
        setError("This booking has already been confirmed.");
        setLoading(false);
        return;
      }

      if (bookingData.status !== "change_requested") {
        setError("No reschedule request found for this booking.");
        setLoading(false);
        return;
      }

      setBooking(bookingData);

      // Fetch available time slots
      const { data: slotsData, error: slotsError } = await supabase
        .from("admin_time_slots")
        .select("*")
        .eq("booking_id", bookingData.id)
        .gte("slot_date", format(new Date(), "yyyy-MM-dd"))
        .order("slot_date", { ascending: true });

      if (slotsError) {
        console.error("Error fetching time slots:", slotsError);
        setError("Failed to load available time slots.");
        setLoading(false);
        return;
      }

      if (!slotsData || slotsData.length === 0) {
        setError("No available time slots. Please contact support.");
        setLoading(false);
        return;
      }

      setTimeSlots(slotsData);
      setLoading(false);
    };

    fetchBookingAndSlots();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot || !selectedTime) {
      toast.error("Please select both a date and time.");
      return;
    }

    const slot = timeSlots.find(s => s.id === selectedSlot);
    if (!slot) {
      toast.error("Invalid slot selected.");
      return;
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        requested_date: slot.slot_date,
        requested_time: selectedTime,
        status: "pending"
      })
      .eq("booking_token", token);

    if (updateError) {
      console.error("Error updating booking:", updateError);
      toast.error("Failed to submit your new time. Please try again.");
      return;
    }

    setSubmitted(true);
    toast.success("Your new time preference has been submitted!");
  };

  const selectedSlotData = timeSlots.find(s => s.id === selectedSlot);
  const availableTimes = selectedSlotData 
    ? generateTimeRange(selectedSlotData.start_time, selectedSlotData.end_time)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">{error}</h1>
          <Button variant="elite-outline" onClick={() => navigate("/")}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center space-y-6 animate-fade-up">
          <div className="w-20 h-20 rounded-full gradient-red-orange flex items-center justify-center mx-auto glow-orange">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">New Time Submitted!</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Your new time preference has been sent and is pending confirmation. You'll be notified once it's approved.
          </p>
          <Button variant="elite-outline" size="lg" onClick={() => navigate("/")}>
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

      <div className="max-w-xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-4 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold">
            Select a <span className="text-gradient-red-orange">New Time</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Hi {booking?.name}, your originally requested time wasn't available. Please choose from the available slots below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="elite-card rounded-2xl p-8 space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {/* Available Date Slots */}
          <div className="space-y-2">
            <Label>Available Dates *</Label>
            <Select onValueChange={(val) => { setSelectedSlot(val); setSelectedTime(""); }} value={selectedSlot}>
              <SelectTrigger className="bg-background/50">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select an available date" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.id} value={slot.id}>
                    {format(parseISO(slot.slot_date), "EEEE, MMMM d")} ({slot.start_time} - {slot.end_time})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          {selectedSlot && (
            <div className="space-y-2">
              <Label>Select Time *</Label>
              <Select onValueChange={setSelectedTime} value={selectedTime}>
                <SelectTrigger className="bg-background/50">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={!selectedSlot || !selectedTime}>
            Submit New Time
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            You'll receive a confirmation email once your new time is approved.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Reschedule;

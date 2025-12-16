import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM", "10:00 PM"
];

const ChooseTime = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setError("Invalid booking link. Please check your email for the correct link.");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_token", token)
        .maybeSingle();

      if (fetchError || !data) {
        setError("Booking not found. This link may have expired or been used already.");
        setLoading(false);
        return;
      }

      if (data.status === "confirmed") {
        setError("This booking has already been confirmed.");
        setLoading(false);
        return;
      }

      if (data.requested_date && data.requested_time) {
        setError("You have already submitted a time preference. Please wait for confirmation.");
        setLoading(false);
        return;
      }

      setBooking(data);
      setLoading(false);
    };

    fetchBooking();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast.error("Please select both a date and time.");
      return;
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        requested_date: format(selectedDate, "yyyy-MM-dd"),
        requested_time: selectedTime,
        status: "pending"
      })
      .eq("booking_token", token);

    if (updateError) {
      console.error("Error updating booking:", updateError);
      toast.error("Failed to submit your time preference. Please try again.");
      return;
    }

    setSubmitted(true);
    toast.success("Your time preference has been submitted!");
  };

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
          <h1 className="text-3xl md:text-4xl font-bold">Time Preference Submitted!</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Your requested time has been sent and is pending confirmation. You'll be notified once it's approved.
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
            Choose Your <span className="text-gradient-red-orange">Preferred Time</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Hi {booking?.name}, please select a date and time that works best for your call.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="elite-card rounded-2xl p-8 space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {/* Date Selection */}
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
                  {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Preferred Time *</Label>
            <Select onValueChange={setSelectedTime} value={selectedTime}>
              <SelectTrigger className="bg-background/50">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" variant="gradient" size="lg" className="w-full">
            Submit Time Preference
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            You'll receive a confirmation email once your time is approved.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChooseTime;

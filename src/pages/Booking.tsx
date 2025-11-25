import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Booking = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    socialHandle: "",
    niche: "",
    audienceSize: "",
    productType: "",
    holdback: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.socialHandle) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Simulate form submission
    console.log("Form submitted:", formData);
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
            We've received your booking request. We'll review your information and reach out within 24 hours to schedule your call.
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

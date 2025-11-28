import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookingData {
  name: string;
  email: string;
  socialHandle: string;
  niche: string;
  audienceSize: string;
  productType: string;
  holdback: string;
  timestamp: string;
}

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [bookings, setBookings] = useState<BookingData[]>([]);

  useEffect(() => {
    const storedBookings = localStorage.getItem("optima-bookings");
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {
        console.error("Error parsing bookings data:", e);
      }
    }
  }, []);

  const clearBookings = () => {
    if (confirm("Are you sure you want to clear all booking data?")) {
      localStorage.removeItem("optima-bookings");
      setBookings([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gradient-red-orange mb-2">Admin Panel</h1>
              <p className="text-muted-foreground">Viewing all booking submissions</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="elite-card p-4 flex-1">
              <div className="text-sm text-muted-foreground">Total Bookings</div>
              <div className="text-3xl font-bold text-gradient-red-orange">{bookings.length}</div>
            </div>
            <Button variant="destructive" onClick={clearBookings}>
              Clear All Data
            </Button>
          </div>

          {bookings.length === 0 ? (
            <div className="elite-card rounded-xl p-12 text-center">
              <p className="text-xl text-muted-foreground">No bookings yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                {bookings.map((booking, index) => (
                  <div key={index} className="elite-card rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h3 className="text-xl font-bold text-foreground">{booking.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(booking.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Email</div>
                        <div className="text-foreground">{booking.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Social Handle</div>
                        <div className="text-foreground">{booking.socialHandle}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Niche</div>
                        <div className="text-foreground">{booking.niche || "Not provided"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Audience Size</div>
                        <div className="text-foreground">{booking.audienceSize || "Not provided"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Product Type</div>
                        <div className="text-foreground">{booking.productType || "Not provided"}</div>
                      </div>
                    </div>
                    
                    {booking.holdback && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Main Holdback</div>
                        <div className="text-foreground bg-muted/30 p-3 rounded-lg">
                          {booking.holdback}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Press Shift+S to close this panel
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

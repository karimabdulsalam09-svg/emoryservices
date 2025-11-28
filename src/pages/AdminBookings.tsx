import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";

interface Booking {
  id: string;
  created_at: string;
  name: string;
  email: string;
  instagram_handle: string | null;
  followers: number | null;
  niche: string | null;
  message: string | null;
  bonus_tier: string;
  source_page: string;
}

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin mode is enabled
    const adminMode = localStorage.getItem("adminMode");
    if (adminMode !== "true") {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }
    
    setIsAuthorized(true);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data || []);
      setFilteredBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredBookings(bookings);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = bookings.filter(
      (booking) =>
        booking.name.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query) ||
        booking.instagram_handle?.toLowerCase().includes(query)
    );
    setFilteredBookings(filtered);
  }, [searchQuery, bookings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background">
        {/* Blank screen - access denied */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient-red-orange mb-2">
              Admin - Booking Submissions
            </h1>
            <p className="text-muted-foreground">
              Total bookings: {bookings.length}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search by name, email, or handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {filteredBookings.length === 0 ? (
          <div className="elite-card rounded-xl p-12 text-center">
            <p className="text-xl text-muted-foreground">
              {searchQuery ? "No bookings found matching your search" : "No bookings yet"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-semibold text-muted-foreground border-b border-border">
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Name</div>
                <div className="col-span-2">Email</div>
                <div className="col-span-1">Handle</div>
                <div className="col-span-1">Followers</div>
                <div className="col-span-1">Niche</div>
                <div className="col-span-1">Bonus</div>
                <div className="col-span-2">Message</div>
              </div>

              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="elite-card rounded-lg p-4 grid grid-cols-12 gap-4 items-start hover:bg-muted/5 transition-colors"
                >
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString()}<br />
                    {new Date(booking.created_at).toLocaleTimeString()}
                  </div>
                  <div className="col-span-2 font-medium">{booking.name}</div>
                  <div className="col-span-2 text-sm break-all">{booking.email}</div>
                  <div className="col-span-1 text-sm">
                    {booking.instagram_handle || "-"}
                  </div>
                  <div className="col-span-1 text-sm">
                    {booking.followers ? booking.followers.toLocaleString() : "-"}
                  </div>
                  <div className="col-span-1 text-sm">{booking.niche || "-"}</div>
                  <div className="col-span-1">
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      {booking.bonus_tier}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">
                    {booking.message || "-"}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;

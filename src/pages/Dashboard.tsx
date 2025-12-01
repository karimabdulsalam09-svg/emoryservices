import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, TrendingUp, Clock, Target, Edit, Trash2, Plus, Download, RefreshCw, LogOut, Mail } from "lucide-react";
import { toast } from "sonner";

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

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  avgFollowers: number;
  tierBreakdown: Record<string, number>;
  nicheBreakdown: Record<string, number>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    avgFollowers: 0,
    tierBreakdown: {},
    nicheBreakdown: {},
  });
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterNiche, setFilterNiche] = useState<string>("all");

  useEffect(() => {
    // Check authentication
    const token = sessionStorage.getItem('adminToken');
    const expiry = sessionStorage.getItem('adminTokenExpiry');
    
    if (!token || !expiry || new Date(expiry) < new Date()) {
      toast.error("Session expired. Please login again.");
      navigate("/admin/login");
      return;
    }

    fetchBookings();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('dashboard-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  useEffect(() => {
    // Apply filters
    let filtered = bookings;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.email.toLowerCase().includes(query) ||
          b.instagram_handle?.toLowerCase().includes(query)
      );
    }

    if (filterTier !== "all") {
      filtered = filtered.filter((b) => b.bonus_tier === filterTier);
    }

    if (filterNiche !== "all") {
      filtered = filtered.filter((b) => b.niche === filterNiche);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchQuery, filterTier, filterNiche]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
      return;
    }

    setBookings(data || []);
    setFilteredBookings(data || []);
    calculateStats(data || []);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminTokenExpiry');
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;

    const { error } = await supabase
      .from('bookings')
      .update({
        name: editingBooking.name,
        email: editingBooking.email,
        instagram_handle: editingBooking.instagram_handle,
        niche: editingBooking.niche,
        message: editingBooking.message,
      })
      .eq('id', editingBooking.id);

    if (error) {
      console.error('Error updating booking:', error);
      toast.error("Failed to update booking");
    } else {
      toast.success("Booking updated successfully");
      setEditingBooking(null);
      fetchBookings();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      toast.error("Failed to delete booking");
    } else {
      toast.success("Booking deleted successfully");
      fetchBookings();
    }
  };

  const handleEmailBooking = async (booking: Booking) => {
    try {
      toast.loading("Sending email...");
      
      const { data, error } = await supabase.functions.invoke('send-booking-notification', {
        body: {
          name: booking.name,
          email: booking.email,
          instagramHandle: booking.instagram_handle,
          niche: booking.niche,
          followers: booking.followers?.toString() || '0',
          message: booking.message,
          bonusTier: booking.bonus_tier,
        }
      });

      if (error) throw error;

      toast.dismiss();
      toast.success("Email sent successfully to karim.2009.gg@gmail.com");
    } catch (error) {
      console.error('Error sending email:', error);
      toast.dismiss();
      toast.error("Failed to send email");
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Instagram', 'Followers', 'Niche', 'Bonus Tier', 'Message'];
    const rows = filteredBookings.map(b => [
      new Date(b.created_at).toLocaleString(),
      b.name,
      b.email,
      b.instagram_handle || '',
      b.followers || '',
      b.niche || '',
      b.bonus_tier,
      b.message || ''
    ]);

    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterTier("all");
    setFilterNiche("all");
    toast.success("Filters reset");
  };

  const calculateStats = (data: Booking[]) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const today = data.filter(b => new Date(b.created_at) >= todayStart).length;
    const thisWeek = data.filter(b => new Date(b.created_at) >= weekStart).length;

    const withFollowers = data.filter(b => b.followers !== null);
    const avgFollowers = withFollowers.length > 0
      ? Math.round(withFollowers.reduce((sum, b) => sum + (b.followers || 0), 0) / withFollowers.length)
      : 0;

    const tierBreakdown = data.reduce((acc, b) => {
      acc[b.bonus_tier] = (acc[b.bonus_tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const nicheBreakdown = data.reduce((acc, b) => {
      if (b.niche) {
        acc[b.niche] = (acc[b.niche] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    setStats({
      total: data.length,
      today,
      thisWeek,
      avgFollowers,
      tierBreakdown,
      nicheBreakdown,
    });
  };

  const getTierLabel = (tier: string) => {
    const labels: Record<string, string> = {
      '0-10': '🏆 75/25 Split',
      '10-15': '⚡ Priority Queue',
      '15-20': '✨ Personalized Audit',
      '20-37': '📄 Blueprint Draft',
      'none': 'No Bonus',
    };
    return labels[tier] || tier;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const uniqueNiches = Array.from(new Set(bookings.map(b => b.niche).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient-red-orange">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time insights into your booking performance
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Filters & Actions */}
        <Card className="elite-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search by name, email, or handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50"
            />
            
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="0-10">🏆 75/25 Split</SelectItem>
                <SelectItem value="10-15">⚡ Priority Queue</SelectItem>
                <SelectItem value="15-20">✨ Personalized Audit</SelectItem>
                <SelectItem value="20-37">📄 Blueprint Draft</SelectItem>
                <SelectItem value="none">No Bonus</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterNiche} onValueChange={setFilterNiche}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Filter by niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Niches</SelectItem>
                {uniqueNiches.map(niche => (
                  <SelectItem key={niche} value={niche!}>{niche}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleResetFilters} className="flex-1 gap-2">
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
              <Button variant="outline" onClick={handleExportCSV} className="flex-1 gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="elite-card p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
          </Card>

          <Card className="elite-card p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Today</p>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.today}</p>
          </Card>

          <Card className="elite-card p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">This Week</p>
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{stats.thisWeek}</p>
          </Card>

          <Card className="elite-card p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Avg Followers</p>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">
              {stats.avgFollowers > 0 ? stats.avgFollowers.toLocaleString() : 'N/A'}
            </p>
          </Card>
        </div>

        {/* Bonus Tier Breakdown */}
        <Card className="elite-card p-6 space-y-4">
          <h2 className="text-2xl font-bold">Bookings by Bonus Tier</h2>
          <div className="space-y-3">
            {Object.entries(stats.tierBreakdown).map(([tier, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={tier} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{getTierLabel(tier)}</span>
                    <span className="text-muted-foreground">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Niches */}
        {Object.keys(stats.nicheBreakdown).length > 0 && (
          <Card className="elite-card p-6 space-y-4">
            <h2 className="text-2xl font-bold">Top Niches</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(stats.nicheBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([niche, count]) => (
                  <div
                    key={niche}
                    className="bg-background/50 rounded-lg p-4 border border-border/50"
                  >
                    <p className="font-medium truncate">{niche}</p>
                    <p className="text-2xl font-bold text-primary">{count}</p>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* All Bookings Table */}
        <Card className="elite-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Bookings ({filteredBookings.length})</h2>
          </div>
          
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 bg-background/50 rounded-lg border border-border/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-lg">{booking.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.email}</p>
                    {booking.instagram_handle && (
                      <p className="text-sm text-muted-foreground">@{booking.instagram_handle}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEmailBooking(booking)}
                      className="gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(booking)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(booking.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Followers</p>
                    <p className="font-medium">
                      {booking.followers ? booking.followers.toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Niche</p>
                    <p className="font-medium">{booking.niche || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bonus Tier</p>
                    <p className="font-medium">{getTierLabel(booking.bonus_tier)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {booking.message && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Message:</p>
                    <p className="text-sm">{booking.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
            </DialogHeader>
            {editingBooking && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editingBooking.name}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={editingBooking.email}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instagram Handle</label>
                  <Input
                    value={editingBooking.instagram_handle || ''}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, instagram_handle: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Niche</label>
                  <Input
                    value={editingBooking.niche || ''}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, niche: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={editingBooking.message || ''}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, message: e.target.value })
                    }
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingBooking(null)}>
                    Cancel
                  </Button>
                  <Button variant="gradient" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  Users, TrendingUp, Clock, Target, Edit, Trash2, Download, RefreshCw, LogOut, 
  CheckCircle, XCircle, CalendarIcon, Plus, X 
} from "lucide-react";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  status: "pending" | "change_requested" | "confirmed";
  booking_token: string;
  requested_date: string | null;
  requested_time: string | null;
  confirmed_date: string | null;
  confirmed_time: string | null;
}

interface TimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
}

interface Stats {
  total: number;
  pending: number;
  changeRequested: number;
  confirmed: number;
  avgFollowers: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    changeRequested: 0,
    confirmed: 0,
    avgFollowers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [changeRequestBooking, setChangeRequestBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newSlotDate, setNewSlotDate] = useState<Date | undefined>();
  const [newSlotStartTime, setNewSlotStartTime] = useState("");
  const [newSlotEndTime, setNewSlotEndTime] = useState("");

  const timeOptions = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
    "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
    "9:00 PM", "10:00 PM"
  ];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated") === "true";
    if (!isAuthenticated) {
      toast.error("Please login to access the dashboard.");
      navigate("/admin/login");
      return;
    }
    setIsAdmin(true);
    fetchBookings();

    const channel = supabase
      .channel('dashboard-bookings-main')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => fetchBookings()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    if (error || !roleData) {
      toast.error("You don't have admin access.");
      await supabase.auth.signOut();
      navigate("/admin/login");
      return;
    }

    setIsAdmin(true);
    fetchBookings();
    
    const channel = supabase
      .channel('dashboard-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => fetchBookings()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
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

    if (filterStatus !== "all") {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchQuery, filterStatus]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      toast.error("Failed to fetch bookings.");
      setLoading(false);
      return;
    }

    const typedData = (data || []) as Booking[];
    setBookings(typedData);
    setFilteredBookings(typedData);
    calculateStats(typedData);
    setLoading(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem("admin_authenticated");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleAcceptBooking = async (booking: Booking) => {
    if (!booking.requested_date || !booking.requested_time) {
      toast.error("No time has been requested yet.");
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        confirmed_date: booking.requested_date,
        confirmed_time: booking.requested_time
      })
      .eq('id', booking.id);

    if (error) {
      toast.error("Failed to confirm booking.");
      return;
    }

    // Send confirmation email
    try {
      await supabase.functions.invoke('send-booking-email', {
        body: {
          type: 'confirmed',
          to: booking.email,
          name: booking.name,
          bookingToken: booking.booking_token,
          confirmedDate: format(new Date(booking.requested_date), 'EEEE, MMMM d, yyyy'),
          confirmedTime: booking.requested_time
        }
      });
    } catch (e) {
      console.error('Failed to send confirmation email:', e);
    }

    toast.success("Booking confirmed! Confirmation email sent.");
    fetchBookings();
  };

  const handleRequestChange = async () => {
    if (!changeRequestBooking || timeSlots.length === 0) {
      toast.error("Please add at least one time slot.");
      return;
    }

    // Delete existing slots for this booking
    await supabase
      .from('admin_time_slots')
      .delete()
      .eq('booking_id', changeRequestBooking.id);

    // Insert new time slots
    const slotsToInsert = timeSlots.map(slot => ({
      booking_id: changeRequestBooking.id,
      slot_date: format(slot.date, 'yyyy-MM-dd'),
      start_time: slot.startTime,
      end_time: slot.endTime
    }));

    const { error: slotsError } = await supabase
      .from('admin_time_slots')
      .insert(slotsToInsert);

    if (slotsError) {
      console.error('Error inserting time slots:', slotsError);
      toast.error("Failed to save time slots.");
      return;
    }

    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'change_requested' })
      .eq('id', changeRequestBooking.id);

    if (updateError) {
      toast.error("Failed to update booking status.");
      return;
    }

    // Send change request email
    try {
      await supabase.functions.invoke('send-booking-email', {
        body: {
          type: 'change_requested',
          to: changeRequestBooking.email,
          name: changeRequestBooking.name,
          bookingToken: changeRequestBooking.booking_token
        }
      });
    } catch (e) {
      console.error('Failed to send change request email:', e);
    }

    toast.success("Change requested! Email sent to user.");
    setChangeRequestBooking(null);
    setTimeSlots([]);
    fetchBookings();
  };

  const addTimeSlot = () => {
    if (!newSlotDate || !newSlotStartTime || !newSlotEndTime) {
      toast.error("Please fill in all slot fields.");
      return;
    }
    setTimeSlots([...timeSlots, { date: newSlotDate, startTime: newSlotStartTime, endTime: newSlotEndTime }]);
    setNewSlotDate(undefined);
    setNewSlotStartTime("");
    setNewSlotEndTime("");
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
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
      toast.error("Failed to delete booking");
    } else {
      toast.success("Booking deleted successfully");
      fetchBookings();
    }
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Instagram', 'Status', 'Requested Date', 'Requested Time', 'Confirmed Date', 'Confirmed Time'];
    const rows = filteredBookings.map(b => [
      new Date(b.created_at).toLocaleString(),
      b.name,
      b.email,
      b.instagram_handle || '',
      b.status,
      b.requested_date || '',
      b.requested_time || '',
      b.confirmed_date || '',
      b.confirmed_time || ''
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
    toast.success("CSV exported");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
  };

  const calculateStats = (data: Booking[]) => {
    const withFollowers = data.filter(b => b.followers !== null);
    const avgFollowers = withFollowers.length > 0
      ? Math.round(withFollowers.reduce((sum, b) => sum + (b.followers || 0), 0) / withFollowers.length)
      : 0;

    setStats({
      total: data.length,
      pending: data.filter(b => b.status === 'pending').length,
      changeRequested: data.filter(b => b.status === 'change_requested').length,
      confirmed: data.filter(b => b.status === 'confirmed').length,
      avgFollowers,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Pending</Badge>;
      case 'change_requested':
        return <Badge variant="outline" className="bg-orange-500/20 text-orange-500 border-orange-500/50">Change Requested</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Confirmed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient-red-orange">Booking Dashboard</h1>
            <p className="text-muted-foreground">Manage all booking requests and confirmations</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

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
              <p className="text-sm text-muted-foreground">Pending</p>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">{stats.pending}</p>
          </Card>

          <Card className="elite-card p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{stats.confirmed}</p>
          </Card>

          <Card className="elite-card p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Change Requested</p>
              <XCircle className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold">{stats.changeRequested}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="elite-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name, email, or handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50"
            />
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="change_requested">Change Requested</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
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

        {/* Bookings Table */}
        <Card className="elite-card p-6 space-y-4">
          <h2 className="text-2xl font-bold">All Bookings ({filteredBookings.length})</h2>
          
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 bg-background/50 rounded-lg border border-border/50 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-lg">{booking.name}</p>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.email}</p>
                    {booking.instagram_handle && (
                      <p className="text-sm text-muted-foreground">@{booking.instagram_handle}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {booking.status === 'pending' && booking.requested_date && booking.requested_time && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcceptBooking(booking)}
                        className="gap-2 text-green-500 hover:text-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </Button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'change_requested') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setChangeRequestBooking(booking);
                          setTimeSlots([]);
                        }}
                        className="gap-2 text-orange-500 hover:text-orange-600"
                      >
                        <CalendarIcon className="w-4 h-4" />
                        Request Change
                      </Button>
                    )}
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

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
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
                    <p className="text-muted-foreground">Requested Time</p>
                    <p className="font-medium">
                      {booking.requested_date && booking.requested_time 
                        ? `${format(new Date(booking.requested_date), 'MMM d')} @ ${booking.requested_time}`
                        : 'Not selected'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Confirmed Time</p>
                    <p className="font-medium">
                      {booking.confirmed_date && booking.confirmed_time 
                        ? `${format(new Date(booking.confirmed_date), 'MMM d')} @ ${booking.confirmed_time}`
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
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

            {filteredBookings.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No bookings found matching your filters.
              </p>
            )}
          </div>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
            </DialogHeader>
            {editingBooking && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editingBooking.name}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editingBooking.email}
                    onChange={(e) =>
                      setEditingBooking({ ...editingBooking, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram Handle</Label>
                  <Input
                    value={editingBooking.instagram_handle || ''}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        instagram_handle: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Niche</Label>
                  <Input
                    value={editingBooking.niche || ''}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        niche: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={editingBooking.message || ''}
                    onChange={(e) =>
                      setEditingBooking({
                        ...editingBooking,
                        message: e.target.value || null,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingBooking(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Change Request Dialog */}
        <Dialog open={!!changeRequestBooking} onOpenChange={() => setChangeRequestBooking(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Request Time Change</DialogTitle>
            </DialogHeader>
            {changeRequestBooking && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add available time slots for <strong>{changeRequestBooking.name}</strong> to choose from.
                  You can add up to 7 days in advance.
                </p>

                {/* Add Time Slot Form */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal text-sm",
                              !newSlotDate && "text-muted-foreground"
                            )}
                          >
                            {newSlotDate ? format(newSlotDate, "MMM d") : "Select"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newSlotDate}
                            onSelect={setNewSlotDate}
                            disabled={(date) => date < new Date() || date > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Start Time</Label>
                      <Select onValueChange={setNewSlotStartTime} value={newSlotStartTime}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Start" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">End Time</Label>
                      <Select onValueChange={setNewSlotEndTime} value={newSlotEndTime}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="End" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={addTimeSlot} size="sm" className="w-full gap-2">
                    <Plus className="w-4 h-4" /> Add Slot
                  </Button>
                </div>

                {/* Current Time Slots */}
                {timeSlots.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Time Slots:</Label>
                    {timeSlots.map((slot, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-background rounded border">
                        <span className="text-sm">
                          {format(slot.date, "EEE, MMM d")} — {slot.startTime} to {slot.endTime}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => removeTimeSlot(i)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setChangeRequestBooking(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRequestChange} disabled={timeSlots.length === 0}>
                    Send Change Request
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

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Clock, Target } from "lucide-react";

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    avgFollowers: 0,
    tierBreakdown: {},
    nicheBreakdown: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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
    calculateStats(data || []);
    setLoading(false);
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient-red-orange">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time insights into your booking performance
          </p>
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

        {/* Recent Bookings */}
        <Card className="elite-card p-6 space-y-4">
          <h2 className="text-2xl font-bold">Recent Bookings</h2>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50"
              >
                <div className="flex-1">
                  <p className="font-medium">{booking.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.instagram_handle || booking.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {getTierLabel(booking.bonus_tier)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

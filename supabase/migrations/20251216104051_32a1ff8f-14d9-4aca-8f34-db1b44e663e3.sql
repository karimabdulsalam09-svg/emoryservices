-- Drop the broken RLS policies that expose all data
DROP POLICY IF EXISTS "Anyone can read booking by token" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can update booking time by token" ON public.bookings;
DROP POLICY IF EXISTS "No public read bookings" ON public.bookings;

-- Note: Token-based access is now handled securely via edge functions
-- The existing admin-only policies remain in place for dashboard access
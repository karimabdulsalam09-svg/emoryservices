-- Add an explicit deny policy for anonymous SELECT to make public-read prevention unambiguous
DROP POLICY IF EXISTS "No public read bookings" ON public.bookings;

CREATE POLICY "No public read bookings"
ON public.bookings
FOR SELECT
TO anon
USING (false);

-- Ensure no legacy public SELECT policy exists (defensive cleanup)
DROP POLICY IF EXISTS "Anyone can select bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can select bookings " ON public.bookings;
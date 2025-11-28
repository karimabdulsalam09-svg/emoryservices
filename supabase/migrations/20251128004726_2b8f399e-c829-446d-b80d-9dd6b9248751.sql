-- Allow public read access to bookings (temporary during development)
CREATE POLICY "Anyone can select bookings"
ON public.bookings
FOR SELECT
USING (true);
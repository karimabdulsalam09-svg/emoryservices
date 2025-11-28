-- Add UPDATE and DELETE policies for bookings (temporary public access during development)
CREATE POLICY "Anyone can update bookings"
ON public.bookings
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete bookings"
ON public.bookings
FOR DELETE
USING (true);
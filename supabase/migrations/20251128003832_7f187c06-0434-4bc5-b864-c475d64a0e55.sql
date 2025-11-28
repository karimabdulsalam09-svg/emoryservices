-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  instagram_handle TEXT,
  followers INTEGER,
  niche TEXT,
  message TEXT,
  bonus_tier TEXT NOT NULL,
  source_page TEXT NOT NULL
);

-- Enable RLS (but make it publicly insertable for the booking form)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings (public form submission)
CREATE POLICY "Anyone can insert bookings"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);
-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'change_requested', 'confirmed');

-- Add new columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN status booking_status NOT NULL DEFAULT 'pending',
ADD COLUMN booking_token uuid NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN requested_date date,
ADD COLUMN requested_time text,
ADD COLUMN confirmed_date date,
ADD COLUMN confirmed_time text;

-- Create index on booking_token for fast lookups
CREATE UNIQUE INDEX idx_bookings_token ON public.bookings(booking_token);

-- Create admin time slots table for reschedule options
CREATE TABLE public.admin_time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  slot_date date NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin_time_slots
ALTER TABLE public.admin_time_slots ENABLE ROW LEVEL SECURITY;

-- Anyone can read time slots (needed for reschedule page with token)
CREATE POLICY "Anyone can read time slots" 
ON public.admin_time_slots 
FOR SELECT 
USING (true);

-- Only admins can manage time slots
CREATE POLICY "Admins can insert time slots" 
ON public.admin_time_slots 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update time slots" 
ON public.admin_time_slots 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete time slots" 
ON public.admin_time_slots 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow public to read their own booking by token (for choose-time and reschedule pages)
CREATE POLICY "Anyone can read booking by token" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Allow public to update their own booking time selection
CREATE POLICY "Anyone can update booking time by token" 
ON public.bookings 
FOR UPDATE 
USING (true)
WITH CHECK (true);
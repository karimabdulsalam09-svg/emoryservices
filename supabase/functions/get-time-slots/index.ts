import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.86.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking_id, token } = await req.json();
    
    // Validate UUID format for booking_id
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!booking_id || typeof booking_id !== 'string' || !uuidRegex.test(booking_id)) {
      console.log("Invalid booking_id format");
      return new Response(
        JSON.stringify({ error: 'Invalid booking ID' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate token format
    if (!token || typeof token !== 'string' || !uuidRegex.test(token)) {
      console.log("Invalid token format");
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    // First verify the token matches the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', booking_id)
      .eq('booking_token', token)
      .maybeSingle();

    if (bookingError || !booking) {
      console.log("Token does not match booking");
      return new Response(
        JSON.stringify({ error: 'Invalid token for this booking' }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch time slots for this booking
    const today = new Date().toISOString().split('T')[0];
    const { data: slots, error: slotsError } = await supabase
      .from('admin_time_slots')
      .select('id, slot_date, start_time, end_time')
      .eq('booking_id', booking_id)
      .gte('slot_date', today)
      .order('slot_date', { ascending: true });

    if (slotsError) {
      console.error("Error fetching slots:", slotsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch time slots' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Time slots retrieved:", slots?.length || 0);
    return new Response(
      JSON.stringify(slots || []),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('Error in get-time-slots:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

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
    const { token, requested_date, requested_time } = await req.json();
    
    // Validate UUID token format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!token || typeof token !== 'string' || !uuidRegex.test(token)) {
      console.log("Invalid token format");
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!requested_date || typeof requested_date !== 'string' || !dateRegex.test(requested_date)) {
      console.log("Invalid date format");
      return new Response(
        JSON.stringify({ error: 'Invalid date format' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Validate time (basic length check and format)
    if (!requested_time || typeof requested_time !== 'string' || requested_time.length > 20 || requested_time.length < 4) {
      console.log("Invalid time format");
      return new Response(
        JSON.stringify({ error: 'Invalid time' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Use service role to bypass RLS (we validate token manually)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    // Verify token exists and booking is in valid state
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('booking_token', token)
      .maybeSingle();

    if (fetchError) {
      console.error("Database error:", fetchError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!booking) {
      console.log("Booking not found");
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (booking.status === 'confirmed') {
      console.log("Attempted to modify confirmed booking");
      return new Response(
        JSON.stringify({ error: 'Cannot modify confirmed booking' }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update only allowed fields
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        requested_date,
        requested_time,
        status: 'pending'
      })
      .eq('booking_token', token);

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Update failed' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Booking time updated successfully");
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('Error in update-booking-time:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

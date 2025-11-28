import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.86.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { passcode } = await req.json();
    const adminPasscode = Deno.env.get('ADMIN_PASSCODE');

    console.log('Validating admin passcode attempt');

    if (!adminPasscode) {
      console.error('ADMIN_PASSCODE not configured');
      return new Response(
        JSON.stringify({ valid: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isValid = passcode === adminPasscode;

    if (isValid) {
      // Generate a session token (valid for 24 hours)
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      console.log('Admin login successful');

      return new Response(
        JSON.stringify({ 
          valid: true, 
          token,
          expiresAt
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log('Invalid passcode attempt');
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid passcode' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in validate-admin function:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

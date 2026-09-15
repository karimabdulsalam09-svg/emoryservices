import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.86.0';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  name: string;
  email: string;
  instagramHandle: string;
  niche: string;
  followers: string;
  productType: string;
  message: string;
  bonusTier: string;
}

// HTML escape function to prevent XSS
function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client to verify user
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get and verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      console.error("User is not an admin:", user.id);
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Admin user authenticated:", user.id);

    const rawData = await req.json();
    
    // Input validation
    if (!rawData.name || typeof rawData.name !== 'string' || rawData.name.length > 100) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid name' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    if (!rawData.email || typeof rawData.email !== 'string' || rawData.email.length > 254) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Validate optional fields with length limits
    if (rawData.instagramHandle && (typeof rawData.instagramHandle !== 'string' || rawData.instagramHandle.length > 50)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid Instagram handle' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    if (rawData.message && (typeof rawData.message !== 'string' || rawData.message.length > 2000)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Message too long' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const bookingData: BookingNotificationRequest = rawData;
    
    console.log("Received booking notification request for:", escapeHtml(bookingData.name));

    // Sanitize all user inputs
    const safeName = escapeHtml(bookingData.name);
    const safeEmail = escapeHtml(bookingData.email);
    const safeInstagram = escapeHtml(bookingData.instagramHandle);
    const safeNiche = escapeHtml(bookingData.niche);
    const safeFollowers = escapeHtml(bookingData.followers);
    const safeProductType = escapeHtml(bookingData.productType);
    const safeMessage = escapeHtml(bookingData.message);
    const safeBonusTier = escapeHtml(bookingData.bonusTier);

    // Format the follower count for display
    const followerDisplay = safeFollowers || "Not specified";
    
    // Format bonus tier for display
    const bonusTierDisplay = bookingData.bonusTier === "none" 
      ? "No bonus (timer expired)" 
      : `Tier: ${safeBonusTier} minutes`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-block { background: white; padding: 20px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #ff4500; }
            .info-block h3 { margin-top: 0; color: #ff4500; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-block p { margin: 8px 0; }
            .label { font-weight: 600; color: #666; }
            .message-box { background: #fff3e0; padding: 15px; border-radius: 6px; margin-top: 15px; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Emory Booking</h1>
            </div>
            <div class="content">
              <div class="info-block">
                <h3>Creator Information</h3>
                <p><span class="label">Name:</span> ${safeName}</p>
                <p><span class="label">Email:</span> ${safeEmail}</p>
                <p><span class="label">Instagram:</span> ${safeInstagram || "Not provided"}</p>
              </div>

              <div class="info-block">
                <h3>Audience &amp; Niche</h3>
                <p><span class="label">Followers:</span> ${followerDisplay}</p>
                <p><span class="label">Niche:</span> ${safeNiche || "Not specified"}</p>
              </div>

              <div class="info-block">
                <h3>Product Interest</h3>
                <p><span class="label">Product Type:</span> ${safeProductType}</p>
              </div>

              <div class="info-block">
                <h3>Bonus Qualification</h3>
                <p><span class="label">Bonus Tier:</span> ${bonusTierDisplay}</p>
              </div>

              ${safeMessage ? `
              <div class="info-block">
                <h3>Their Message</h3>
                <div class="message-box">
                  ${safeMessage}
                </div>
              </div>
              ` : ''}

              <div class="info-block">
                <h3>Submitted</h3>
                <p>${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
            <div class="footer">
              Emory Booking System • Automated Notification
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using Resend REST API directly
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Emory Bookings <onboarding@resend.dev>',
        to: ['karim.2009.gg@gmail.com'],
        subject: `🎯 New Emory Booking: ${safeName} - ${safeNiche || "No Niche"}`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailResult);
      throw new Error(`Resend API error: ${JSON.stringify(emailResult)}`);
    }

    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, data: emailResult }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    // Log detailed error server-side for debugging
    console.error("Error in send-booking-notification function:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    // Return generic error to client - don't expose internal details
    return new Response(
      JSON.stringify({ success: false, error: 'An error occurred processing your request. Please try again later.' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "https://nwdkoqshjndmcixqmydd.lovableproject.com";
const ADMIN_EMAIL = "karim.2009.gg@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "booking_received" | "confirmed" | "change_requested";
  to: string;
  name: string;
  bookingToken: string;
  requestedDate?: string;
  requestedTime?: string;
  confirmedDate?: string;
  confirmedTime?: string;
}

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EmailRequest = await req.json();
    console.log("Sending booking email:", data.type, "to:", data.to);

    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.to);
    let subject = "";
    let html = "";

    const baseStyles = `
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .info-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff4500; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
        .customer-info { background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    `;

    // Since Resend requires domain verification to send to external emails,
    // we send all notifications to the admin with customer details included
    // The admin can then manually forward or contact the customer

    if (data.type === "booking_received") {
      subject = `📥 New Booking: ${safeName} - ${escapeHtml(data.requestedDate)} @ ${escapeHtml(data.requestedTime)}`;
      html = `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📥 New Booking Request</h1>
              </div>
              <div class="content">
                <p><strong>A new booking has been submitted!</strong></p>
                
                <div class="customer-info">
                  <p style="margin: 0;"><strong>Customer:</strong> ${safeName}</p>
                  <p style="margin: 5px 0;"><strong>Email:</strong> ${safeEmail}</p>
                </div>
                
                <div class="info-box">
                  <p style="margin: 0;"><strong>📅 Requested Date:</strong> ${escapeHtml(data.requestedDate)}</p>
                  <p style="margin: 10px 0 0 0;"><strong>🕐 Requested Time:</strong> ${escapeHtml(data.requestedTime)}</p>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <ul>
                  <li>Review the booking in your dashboard</li>
                  <li>Accept or request a time change</li>
                  <li>The customer will be notified automatically</li>
                </ul>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${SITE_URL}/dashboard" class="cta-button">View Dashboard →</a>
                </div>
              </div>
              <div class="footer">
                Optima Booking System
              </div>
            </div>
          </body>
        </html>
      `;
    } else if (data.type === "confirmed") {
      subject = `✅ Booking Confirmed: ${safeName} - ${escapeHtml(data.confirmedDate)} @ ${escapeHtml(data.confirmedTime)}`;
      html = `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Booking Confirmed!</h1>
              </div>
              <div class="content">
                <p><strong>You've confirmed a booking!</strong></p>
                
                <div class="customer-info">
                  <p style="margin: 0;"><strong>Customer:</strong> ${safeName}</p>
                  <p style="margin: 5px 0;"><strong>Email:</strong> ${safeEmail}</p>
                </div>
                
                <div class="info-box">
                  <p style="margin: 0;"><strong>📅 Confirmed Date:</strong> ${escapeHtml(data.confirmedDate)}</p>
                  <p style="margin: 10px 0 0 0;"><strong>🕐 Confirmed Time:</strong> ${escapeHtml(data.confirmedTime)}</p>
                </div>
                
                <p><strong>Action Required:</strong></p>
                <ul>
                  <li>Send a calendar invite to: <strong>${safeEmail}</strong></li>
                  <li>Include your meeting link (Zoom/Google Meet)</li>
                  <li>Prepare for the call based on their submission</li>
                </ul>
                
                <p style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 20px;">
                  <strong>Note:</strong> Please manually email ${safeEmail} to confirm their call. 
                  (To enable automatic customer emails, verify a domain at resend.com/domains)
                </p>
              </div>
              <div class="footer">
                Optima Booking System
              </div>
            </div>
          </body>
        </html>
      `;
    } else if (data.type === "change_requested") {
      subject = `📅 Time Change Requested: ${safeName}`;
      html = `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📅 Time Change Requested</h1>
              </div>
              <div class="content">
                <p><strong>You've requested a time change!</strong></p>
                
                <div class="customer-info">
                  <p style="margin: 0;"><strong>Customer:</strong> ${safeName}</p>
                  <p style="margin: 5px 0;"><strong>Email:</strong> ${safeEmail}</p>
                </div>
                
                <p>The customer needs to select a new time from the slots you provided.</p>
                
                <div class="info-box">
                  <p style="margin: 0;"><strong>Reschedule Link for Customer:</strong></p>
                  <p style="margin: 10px 0 0 0; word-break: break-all;">
                    <a href="${SITE_URL}/reschedule?token=${data.bookingToken}">${SITE_URL}/reschedule?token=${data.bookingToken}</a>
                  </p>
                </div>
                
                <p><strong>Action Required:</strong></p>
                <ul>
                  <li>Copy the link above</li>
                  <li>Email it to: <strong>${safeEmail}</strong></li>
                  <li>Ask them to select a new time</li>
                </ul>
                
                <p style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 20px;">
                  <strong>Note:</strong> Please manually send this link to the customer. 
                  (To enable automatic customer emails, verify a domain at resend.com/domains)
                </p>
              </div>
              <div class="footer">
                Optima Booking System
              </div>
            </div>
          </body>
        </html>
      `;
    }

    // Always send to admin email (guaranteed to work with Resend free tier)
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Optima <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject,
        html,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailResult);
      throw new Error(`Resend API error: ${JSON.stringify(emailResult)}`);
    }

    console.log("Admin notification email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, data: emailResult }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

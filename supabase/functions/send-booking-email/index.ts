import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = Deno.env.get("SITE_URL") || "https://nwdkoqshjndmcixqmydd.lovableproject.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "time_selection" | "confirmed" | "change_requested";
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
      </style>
    `;

    if (data.type === "time_selection") {
      subject = `Action Required: Select Your Call Time — Optima`;
      html = `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📅 Select Your Call Time</h1>
              </div>
              <div class="content">
                <p>Hi ${safeName},</p>
                <p>Thanks for submitting your booking request! Your call is <strong>not confirmed yet</strong>.</p>
                <p>To proceed, please select your preferred date and time by clicking the button below:</p>
                <div style="text-align: center;">
                  <a href="${SITE_URL}/choose-time?token=${data.bookingToken}" class="cta-button">Choose Your Time →</a>
                </div>
                <div class="info-box">
                  <p style="margin: 0;"><strong>What happens next?</strong></p>
                  <p style="margin: 10px 0 0 0;">Once you select a time, we'll review and confirm your booking within 24 hours.</p>
                </div>
                <p>If you have any questions, just reply to this email.</p>
                <p>Best,<br>The Optima Team</p>
              </div>
              <div class="footer">
                Optima • Creator Operations Partner
              </div>
            </div>
          </body>
        </html>
      `;
    } else if (data.type === "confirmed") {
      subject = `✅ Your Call is Confirmed — Optima`;
      html = `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Call Confirmed!</h1>
              </div>
              <div class="content">
                <p>Hi ${safeName},</p>
                <p>Great news! Your call has been <strong>confirmed</strong>.</p>
                <div class="info-box">
                  <p style="margin: 0;"><strong>📅 Date:</strong> ${escapeHtml(data.confirmedDate)}</p>
                  <p style="margin: 10px 0 0 0;"><strong>🕐 Time:</strong> ${escapeHtml(data.confirmedTime)}</p>
                </div>
                <p>You'll receive a calendar invite shortly with the meeting link.</p>
                <p>Please make sure to:</p>
                <ul>
                  <li>Be in a quiet place with good internet</li>
                  <li>Have your content/niche ideas ready to discuss</li>
                  <li>Come with questions about your digital product</li>
                </ul>
                <p>Looking forward to speaking with you!</p>
                <p>Best,<br>The Optima Team</p>
              </div>
              <div class="footer">
                Optima • Creator Operations Partner
              </div>
            </div>
          </body>
        </html>
      `;
    } else if (data.type === "change_requested") {
      subject = `📅 Time Change Needed — Optima`;
      html = `
        <!DOCTYPE html>
        <html>
          <head>${baseStyles}</head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📅 Time Change Needed</h1>
              </div>
              <div class="content">
                <p>Hi ${safeName},</p>
                <p>Unfortunately, your originally requested time is <strong>not available</strong>.</p>
                <p>We've opened up some alternative time slots for you. Please select a new time that works:</p>
                <div style="text-align: center;">
                  <a href="${SITE_URL}/reschedule?token=${data.bookingToken}" class="cta-button">Select New Time →</a>
                </div>
                <div class="info-box">
                  <p style="margin: 0;">Don't worry — we're still excited to chat with you. Just pick a new slot and we'll get you confirmed ASAP.</p>
                </div>
                <p>If you have any questions, just reply to this email.</p>
                <p>Best,<br>The Optima Team</p>
              </div>
              <div class="footer">
                Optima • Creator Operations Partner
              </div>
            </div>
          </body>
        </html>
      `;
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Optima <onboarding@resend.dev>',
        to: [data.to],
        subject,
        html,
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

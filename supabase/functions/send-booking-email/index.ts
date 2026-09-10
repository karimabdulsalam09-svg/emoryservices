import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const GMAIL_USER = Deno.env.get("GMAIL_USER");
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");
const SITE_URL = Deno.env.get("SITE_URL") || "https://estherconnect.lovable.app";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || GMAIL_USER || "";

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
  localTime?: string;
  confirmedDate?: string;
  confirmedTime?: string;
}

function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const baseStyles = `
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%); color: white; padding: 36px 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 26px; }
    .content { background: white; padding: 34px 30px; border-radius: 0 0 12px 12px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 18px 0; }
    .info-box { background: #f9f9f9; padding: 18px; border-radius: 8px; margin: 18px 0; border-left: 4px solid #ff4500; }
    .footer { text-align: center; padding: 18px; color: #999; font-size: 12px; }
  </style>
`;

const wrap = (title: string, body: string) => `<!DOCTYPE html><html><head>${baseStyles}</head><body>
  <div class="container">
    <div class="header"><h1>${title}</h1></div>
    <div class="content">${body}</div>
    <div class="footer">Esther Booking System</div>
  </div></body></html>`;

async function sendMail(to: string, subject: string, html: string) {
  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: { username: GMAIL_USER!, password: GMAIL_APP_PASSWORD! },
    },
  });
  try {
    await client.send({
      from: `Esther <${GMAIL_USER}>`,
      to,
      subject,
      html,
      content: "text/html",
    });
  } finally {
    await client.close();
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error("Gmail credentials are not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Email sending is not configured yet." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const rawData = await req.json();

    const validTypes = ["booking_received", "confirmed", "change_requested"];
    if (!rawData.type || !validTypes.includes(rawData.type)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid email type" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!rawData.to || typeof rawData.to !== "string" || rawData.to.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawData.to)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!rawData.name || typeof rawData.name !== "string" || rawData.name.length > 100) {
      return new Response(JSON.stringify({ success: false, error: "Invalid name" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!rawData.bookingToken || !uuidRegex.test(rawData.bookingToken)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid booking token" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const data: EmailRequest = rawData;
    const name = escapeHtml(data.name);
    const email = escapeHtml(data.to);
    const reqDate = escapeHtml(data.requestedDate);
    const reqTime = escapeHtml(data.requestedTime);
    const localTime = escapeHtml(data.localTime);
    const confDate = escapeHtml(data.confirmedDate);
    const confTime = escapeHtml(data.confirmedTime);

    let adminSubject = "";
    let adminHtml = "";
    let clientSubject = "";
    let clientHtml = "";

    if (data.type === "booking_received") {
      adminSubject = `New booking request: ${name} — ${reqDate} @ ${reqTime}`;
      adminHtml = wrap("New Booking Request", `
        <p><strong>${name}</strong> requested a call.</p>
        <div class="info-box">
          <p style="margin:0"><strong>Email:</strong> ${email}</p>
          <p style="margin:8px 0 0"><strong>Date:</strong> ${reqDate}</p>
          <p style="margin:8px 0 0"><strong>Time:</strong> ${reqTime}</p>
          ${localTime ? `<p style="margin:8px 0 0"><strong>Their local time:</strong> ${localTime}</p>` : ""}
        </div>
        <div style="text-align:center"><a href="${SITE_URL}/dashboard" class="cta-button">Review in dashboard →</a></div>`);

      clientSubject = "We've received your booking request";
      clientHtml = wrap("Booking Request Received", `
        <p>Hi ${name},</p>
        <p>Thanks for booking a strategy call. Here's what you requested:</p>
        <div class="info-box">
          <p style="margin:0"><strong>Date:</strong> ${reqDate}</p>
          <p style="margin:8px 0 0"><strong>Time:</strong> ${reqTime}</p>
          ${localTime ? `<p style="margin:8px 0 0"><strong>Your local time:</strong> ${localTime}</p>` : ""}
        </div>
        <p>This time isn't locked in yet — you'll get another email once it's confirmed, usually within 24 hours.</p>`);
    } else if (data.type === "confirmed") {
      adminSubject = `Booking confirmed: ${name} — ${confDate} @ ${confTime}`;
      adminHtml = wrap("Booking Confirmed", `
        <div class="info-box">
          <p style="margin:0"><strong>Customer:</strong> ${name} (${email})</p>
          <p style="margin:8px 0 0"><strong>Date:</strong> ${confDate}</p>
          <p style="margin:8px 0 0"><strong>Time:</strong> ${confTime}</p>
        </div>
        <p>Send the meeting link to ${email}.</p>`);

      clientSubject = "Your call is confirmed";
      clientHtml = wrap("Your Call Is Confirmed", `
        <p>Hi ${name},</p>
        <p>Your strategy call is locked in:</p>
        <div class="info-box">
          <p style="margin:0"><strong>Date:</strong> ${confDate}</p>
          <p style="margin:8px 0 0"><strong>Time:</strong> ${confTime}</p>
        </div>
        <p>Find a quiet spot and bring your ideas — see you then.</p>`);
    } else {
      adminSubject = `Time change requested: ${name}`;
      adminHtml = wrap("Time Change Requested", `
        <p>You asked <strong>${name}</strong> (${email}) to pick a new time.</p>
        <div class="info-box"><a href="${SITE_URL}/reschedule?token=${data.bookingToken}">${SITE_URL}/reschedule?token=${data.bookingToken}</a></div>`);

      clientSubject = "Please pick a new time for your call";
      clientHtml = wrap("Pick a New Time", `
        <p>Hi ${name},</p>
        <p>Unfortunately your requested time isn't available. Please choose one of the available slots below:</p>
        <div style="text-align:center"><a href="${SITE_URL}/reschedule?token=${data.bookingToken}" class="cta-button">Choose a new time →</a></div>`);
    }

    const results = await Promise.allSettled([
      ADMIN_EMAIL ? sendMail(ADMIN_EMAIL, adminSubject, adminHtml) : Promise.resolve(),
      sendMail(data.to, clientSubject, clientHtml),
    ]);

    const failures = results
      .map((r, i) => (r.status === "rejected" ? `${i === 0 ? "admin" : "customer"}: ${r.reason}` : null))
      .filter(Boolean);

    if (failures.length) {
      console.error("Email send failures:", failures.join(" | "));
      return new Response(JSON.stringify({ success: false, error: failures.join(" | ") }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Booking emails sent:", data.type);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);

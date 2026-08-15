import { Resend } from "resend";

// Lazy-load Resend client to ensure environment variables are available
let resend = null;

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY in environment variables");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export default async function sendEmail({ to, subject, html }) {
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const client = getResendClient();

  return client.emails.send({
    from,
    to,
    subject,
    html,
  });
}

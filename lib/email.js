import { Resend } from "resend";

let _resend;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
const resend = { emails: { send: (...args) => getResend().emails.send(...args) } };

export async function sendPatientReply({ to, patientName, clinic, aiReplyText }) {
  const bookingBlock = clinic.calendlyLink
    ? `<p><a href="${clinic.calendlyLink}" target="_blank">Click here to book your appointment</a></p>`
    : "";

  return resend.emails.send({
    from: `${clinic.branding?.displayName || clinic.name} <onboarding@resend.dev>`,
    to,
    subject: `Re: Your enquiry to ${clinic.branding?.displayName || clinic.name}`,
    html: `<p>Hi ${patientName},</p><p>${aiReplyText}</p>${bookingBlock}<p>Thank you,<br/>${clinic.branding?.displayName || clinic.name}</p>`,
  });
}

export async function sendClinicNotification({ clinic, submission }) {
  if (!clinic.notificationChannels?.discordWebhook) return;

  await fetch(clinic.notificationChannels.discordWebhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `📩 New patient enquiry${submission.urgent ? " ⚠️ URGENT" : ""}\n**Name:** ${submission.patientName}\nCheck the dashboard for full details.`,
    }),
  });
}

export async function sendFollowUpNoShow({ to, patientName, clinic }) {
  return resend.emails.send({
    from: `${clinic.branding?.displayName || clinic.name} <onboarding@resend.dev>`,
    to,
    subject: `We missed you — ${clinic.branding?.displayName || clinic.name}`,
    html: `<p>Hi ${patientName},</p><p>We noticed you weren't able to make your appointment. Would you like to reschedule?</p>${
      clinic.calendlyLink ? `<p><a href="${clinic.calendlyLink}">Rebook here</a></p>` : ""
    }`,
  });
}

import nodemailer from "nodemailer";

function smtpUser() {
  return process.env.SMTP_USER?.trim() || "";
}

function smtpPass() {
  return process.env.SMTP_PASS?.trim() || "";
}

export function isMailConfigured() {
  return Boolean(smtpUser() && smtpPass());
}

function transport() {
  const user = smtpUser();
  const pass = smtpPass();
  if (!user || !pass) return null;

  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const gmail = /@gmail\.com$/i.test(user) || host === "smtp.gmail.com";

  if (gmail && !host) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });
}

export async function sendMail(to: string, subject: string, html: string) {
  const user = smtpUser();
  const from = process.env.SMTP_FROM?.trim() || `Morada Móveis <${user}>`;
  const mailer = transport();
  if (!mailer) {
    throw new Error("Envio de e-mail não configurado.");
  }

  await mailer.sendMail({ from, to, subject, html });
}

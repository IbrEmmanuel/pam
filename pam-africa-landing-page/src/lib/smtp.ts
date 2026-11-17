import nodemailer from "nodemailer";
import { emailSetupHelpMessage } from "@/lib/userFacingErrors";

export function getSmtpConfig() {
  const host = process.env.SMTP_HOST || "mail.ai4africa.app";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS;

  return { host, port, secure, user, pass };
}

export function assertSmtpConfigured() {
  const { user, pass } = getSmtpConfig();
  if (!user || !pass) {
    throw new Error("Email is not configured");
  }
}

export function createMailTransporter() {
  assertSmtpConfigured();
  const { host, port, secure, user, pass } = getSmtpConfig();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    requireTLS: !secure && port === 587,
    tls: {
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== "false",
      minVersion: "TLSv1.2",
    },
  });
}

export async function verifySmtpConnection() {
  const transporter = createMailTransporter();
  await transporter.verify();
}

export function smtpNotConfiguredUserMessage() {
  return emailSetupHelpMessage();
}

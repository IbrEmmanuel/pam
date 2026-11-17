export function supportContactEmail() {
  return process.env.ADMIN_EMAIL?.trim() || "support@pamafrica.com";
}

export function emailSetupHelpMessage() {
  return `We couldn't send this email. Please contact ${supportContactEmail()} for help with email setup.`;
}

export function authNotReadyMessage() {
  return "Sign-in is temporarily unavailable. Please try again later or contact support.";
}

/** Maps SMTP / mail errors to admin-safe copy (no env or server details). */
export function formatSmtpErrorForAdmin(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);

  if (!raw || /not configured|EMAIL_|SMTP_|\.env/i.test(raw)) {
    return emailSetupHelpMessage();
  }
  if (/535|authentication failed|invalid login|auth/i.test(raw)) {
    return emailSetupHelpMessage();
  }
  if (/self signed|certificate|TLS|SSL/i.test(raw)) {
    return `There was a problem connecting to the email server. Please contact ${supportContactEmail()} for help.`;
  }
  if (/ECONNREFUSED|ETIMEDOUT|ENOTFOUND|connect/i.test(raw)) {
    return emailSetupHelpMessage();
  }

  return emailSetupHelpMessage();
}

/** Developer-facing detail for CLI checks only. */
export function formatSmtpErrorForDev(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (/535|authentication failed|invalid login/i.test(raw)) {
    return (
      "SMTP login failed (535). Check EMAIL_USER and EMAIL_PASS in .env.local — use the mailbox password or app password, and match SMTP_HOST/SMTP_PORT (587 + SMTP_SECURE=false is typical)."
    );
  }
  if (/self signed|certificate/i.test(raw)) {
    return "SMTP TLS certificate issue. If you use a private mail server, set SMTP_TLS_REJECT_UNAUTHORIZED=false in .env.local.";
  }
  if (!raw) {
    return "Failed to send email. Set EMAIL_USER and EMAIL_PASS in .env.local.";
  }
  return raw;
}

/** Avoid leaking database / infrastructure errors in admin UI. */
export function formatAdminActionError(error: unknown, fallback: string): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (!raw) return fallback;
  if (/permission denied|42501|JWT|Supabase|service_role|\.env|ECONNREFUSED|fetch failed/i.test(raw)) {
    return fallback;
  }
  if (/535|SMTP|nodemailer|Invalid login/i.test(raw)) {
    return formatSmtpErrorForAdmin(error);
  }
  return raw.length > 160 ? fallback : raw;
}

import { createMailTransporter } from "@/lib/smtp";
import { formatSmtpErrorForAdmin } from "@/lib/userFacingErrors";

export interface ContactFormData {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
}

function mailFrom() {
  const from = process.env.EMAIL_USER?.trim();
  if (!from) throw new Error("Email is not configured");
  return from;
}

export const sendContactEmail = async (formData: ContactFormData) => {
  try {
    const transporter = createMailTransporter();
    const from = mailFrom();

    const companyMailOptions = {
      from,
      to: process.env.COMPANY_EMAIL || from,
      subject: `New Contact Form Submission from ${formData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #131313; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #131313; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            ${formData.company ? `<p><strong>Company:</strong> ${formData.company}</p>` : ""}
            ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ""}
          </div>
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #131313;">
            <h3 style="color: #131313; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6;">${formData.message.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
      `,
    };

    const customerMailOptions = {
      from,
      to: formData.email,
      subject: "Thank you for contacting PAM Africa",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #131313;">Thank You, ${formData.name}!</h1>
          <p>We have received your message and will get back to you as soon as possible.</p>
        </div>
      `,
    };

    await transporter.sendMail(companyMailOptions);
    await transporter.sendMail(customerMailOptions);

    return { success: true, message: "Emails sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: formatSmtpErrorForAdmin(error) };
  }
};

export async function sendAdminInviteEmail(email: string, inviteUrl: string) {
  const transporter = createMailTransporter();
  const from = mailFrom();
  await transporter.sendMail({
    from,
    to: email,
    subject: "You're invited to PAM Admin",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h1 style="color: #131313;">Join PAM Admin</h1>
        <p>You have been invited to manage journals and media on the PAM Africa website.</p>
        <p>
          <a href="${inviteUrl}" style="display:inline-block;background:#131313;color:#fff;padding:12px 20px;text-decoration:none;">
            Accept invite & set password
          </a>
        </p>
        <p>This link expires in 7 days. If you were not expecting this, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const transporter = createMailTransporter();
  const from = mailFrom();
  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your PAM Admin password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h1 style="color: #131313;">Reset your password</h1>
        <p>We received a request to reset the PAM Admin password for this email.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#131313;color:#fff;padding:12px 20px;text-decoration:none;">
            Choose a new password
          </a>
        </p>
        <p>This link expires in one hour. If you did not ask for a reset, you can ignore this email.</p>
      </div>
    `,
  });
}

import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Interface for the email sending options.
 */
export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Create the Nodemailer transporter using SendGrid SMTP.
 */
const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // This must be the literal string "apikey" when using SendGrid
    pass: process.env.SENDGRID_API_KEY as string, // your SendGrid API Key
  },
});

/**
 * Sends an email using the configured transporter.
 *
 * @async
 * @function sendEmail
 * @param options - Email sending options.
 * @param options.to - Recipient email address.
 * @param options.subject - Subject of the email.
 * @param options.html - HTML body of the email.
 * @returns A promise that resolves with the result of the sending operation.
 * @throws {Error} If sending the email fails.
 *
 * @example
 * await sendEmail({
 *   to: "user@example.com",
 *   subject: "Recuperación de contraseña",
 *   html: "<p>Hola, haz clic en el enlace para restablecer tu contraseña</p>"
 * });
 */
export async function sendEmail(options: IEmailOptions): Promise<any> {
  const { to, subject, html } = options;

  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER no está configurado en las variables de entorno.");
  }

  return transporter.sendMail({
    from: process.env.EMAIL_USER, // verified sender in SendGrid
    to,
    subject,
    html,
  });
}

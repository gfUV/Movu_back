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
 * Asegúrate de tener configurado SENDGRID_API_KEY y EMAIL_USER
 * en tus variables de entorno (Render o .env local).
 */
const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // TLS automático en 587
  auth: {
    user: "apikey", // Literal "apikey" (no tu correo)
    pass: process.env.SENDGRID_API_KEY as string, // Tu clave API de SendGrid
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

  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_USER) {
    throw new Error("Faltan variables de entorno: SENDGRID_API_KEY o EMAIL_USER");
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Debe ser un remitente verificado en SendGrid
      to,
      subject,
      html,
    });

    console.log("✅ Correo enviado con éxito:", info.messageId);
    return info;
  } catch (error: any) {
    console.error("❌ Error al enviar correo:", error.message);
    throw new Error("Fallo al enviar correo: " + error.message);
  }
}

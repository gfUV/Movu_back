import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Interface for email options.
 */
export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Create the Nodemailer transporter using Gmail SMTP.
 * Make sure to use an App Password, not your normal Gmail password.
 */
const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using Gmail SMTP.
 *
 * @param options - Email details (recipient, subject, body HTML).
 * @returns Promise that resolves if the email is sent successfully.
 */
export async function sendEmail(options: IEmailOptions): Promise<any> {
  const { to, subject, html } = options;

  if (!process.env.EMAIL_USER) {
    throw new Error("EMAIL_USER no está configurado en las variables de entorno.");
  }

  try {
    const info = await transporter.sendMail({
      from: `"Soporte Movu" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Correo enviado correctamente:", info.messageId);
    return info;
  } catch (error: any) {
    console.error("❌ Error al enviar correo:", error);
    throw new Error("No se pudo enviar el correo. Verifica las credenciales SMTP.");
  }
}

import { Resend } from "resend";
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
 * Create the Resend client instance.
 * Make sure RESEND_API_KEY and EMAIL_FROM are set in your environment.
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email using Resend API.
 *
 * @async
 * @function sendEmail
 * @param options - Email sending options.
 * @returns A promise that resolves when the email is sent.
 */
export async function sendEmail(options: IEmailOptions): Promise<void> {
  const { to, subject, html } = options;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("❌ Faltante: RESEND_API_KEY no está configurado en las variables de entorno.");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("❌ Faltante: EMAIL_FROM no está configurado en las variables de entorno.");
  }

  try {
    console.log("📧 Enviando correo con Resend...");
    console.log("➡️ Para:", to);
    console.log("➡️ Asunto:", subject);

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error("❌ Error de Resend:", result.error);
      throw new Error(result.error.message);
    }

    console.log("✅ Correo enviado exitosamente con ID:", result.data?.id);
  } catch (error: any) {
    console.error("❌ Fallo al enviar correo con Resend:", error.message);
    throw new Error("Fallo al enviar correo: " + error.message);
  }
}

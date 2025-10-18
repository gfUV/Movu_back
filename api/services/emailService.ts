import { Resend } from "resend";
import dotenv from "dotenv";

// Load environment variables only in local environment (Render injects them automatically)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  console.log("🧩 Variables de entorno cargadas localmente con dotenv");
}

/**
 * Represents the required options to send an email.
 * @interface IEmailOptions
 * @property {string} to - The recipient's email address.
 * @property {string} subject - The subject of the email.
 * @property {string} html - The HTML content of the email body.
 */
export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using the Resend API.
 *
 * This function checks that the API key and sender address are properly configured.
 * It then sends the email and logs the result or any error that occurs during the process.
 *
 * @async
 * @function sendEmail
 * @param {IEmailOptions} options - The options for the email (recipient, subject, and HTML content).
 * @throws {Error} Throws an error if required environment variables are missing or if sending fails.
 * @returns {Promise<void>} A promise that resolves when the email is sent successfully.
 */
export async function sendEmail(options: IEmailOptions): Promise<void> {
  const { to, subject, html } = options;

  // Validate and log (for controlled debugging)
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey) {
    console.error("❌ Error: RESEND_API_KEY no está definida en process.env");
    throw new Error("Faltante: RESEND_API_KEY no configurada");
  }

  if (!from) {
    console.error("❌ Error: EMAIL_FROM no está definida en process.env");
    throw new Error("Faltante: EMAIL_FROM no configurada");
  }

  // Create the Resend instance inside the function
  const resend = new Resend(apiKey);

  try {
    console.log("📧 Enviando correo con Resend...");
    console.log("➡️ Para:", to);
    console.log("➡️ Desde:", from);
    console.log("➡️ Asunto:", subject);

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error("❌ Error al enviar el correo:", result.error);
      throw new Error(result.error.message);
    }

    console.log("✅ Correo enviado exitosamente con ID:", result.data?.id);
  } catch (error: any) {
    console.error("❌ Fallo general al enviar correo:", error.message);
    throw new Error("Fallo al enviar correo: " + error.message);
  }
}

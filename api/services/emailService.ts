import { Resend } from "resend";
import dotenv from "dotenv";

// Carga las variables solo en entorno local (Render ya las inyecta)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  console.log("🧩 Variables de entorno cargadas localmente con dotenv");
}

/**
 * Interface for the email sending options.
 */
export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using Resend API.
 */
export async function sendEmail(options: IEmailOptions): Promise<void> {
  const { to, subject, html } = options;

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

  const resend = new Resend(apiKey);

  try {
    console.log("📧 Enviando correo con Resend...");
    console.log("➡️ Para:", to);
    console.log("➡️ Desde:", from);
    console.log("➡️ Asunto:", subject);

    const result = await resend.emails.send({
      from, // 👈 obligatorio
      to,   // 👈 usa el valor pasado a la función
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

// ✅ Ejemplo de uso directo (para probar)
sendEmail({
  to: "alexandramoralesh1234@hotmail.com",
  subject: "Prueba de Movu",
  html: "<p>Hola, esta es una prueba de envío desde Movu 🚀</p>",
});

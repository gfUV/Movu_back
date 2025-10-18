import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

/**
 * Interfaz para las opciones del correo
 */
export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Configurar SendGrid con la API Key
 */
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

/**
 * Función para enviar correos con SendGrid
 */
export async function sendEmail({ to, subject, html }: IEmailOptions) {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_USER) {
    throw new Error(
      "Faltan variables de entorno: SENDGRID_API_KEY o EMAIL_USER"
    );
  }

  const msg = {
    to,
    from: process.env.EMAIL_USER, // ⚠️ Debe ser un remitente verificado en SendGrid
    subject,
    html,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ Correo enviado con éxito:", response[0].statusCode);
    return response;
  } catch (error: any) {
    console.error("❌ Error al enviar correo:", error.response?.body || error.message);
    throw new Error("Fallo al enviar correo: " + (error.message || "Error desconocido"));
  }
}

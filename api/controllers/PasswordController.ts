import { Request, Response } from "express";
import crypto from "crypto";
import UserDAO from "../dao/UserDAO";
import { sendEmail } from "../services/emailService";
import { IUser } from "../models/User";

/**
 * Controller responsible for managing password recovery and reset processes.
 */
export default class PasswordController {
  /**
   * Initiates the password reset process by generating a token and sending
   * an email with reset instructions to the user.
   */
  async requestReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const user = (await UserDAO.findOne({ email })) as IUser | null;
      console.log("Buscando usuario con correo:", email);
      console.log("Resultado de búsqueda:", user);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      // Generate a unique token and set expiration date (1 hour)
      const token = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await (user as any).save(); // ⚠️ cast si el DAO devuelve un documento Mongoose

      // Frontend URL - puedes cambiarla si usas otra
      const resetUrl = `https://movu-theta.vercel.app/ConfirResetPage?token=${token}`;

      // 💬 Responder rápido al cliente
      res.status(200).json({ message: "Correo de recuperación en proceso" });
      console.log("Enviando correo a:", user.email); // Debugging log

      sendEmail({
        to: user.email,
        subject: "Recuperación de contraseña",
        html: `
          <p>Hola,</p>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
          <a href="${resetUrl}">Restablecer contraseña</a>
          <p>Si no solicitaste este cambio, ignora este correo.</p>
        `,
      })
      .then(() => console.log("✅ Correo enviado correctamente a", user.email))
      .catch((err) => console.error("❌ Error al enviar correo:", err));

    } catch (error: any) {
         if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
    }
  }

  /**
   * Resets the user's password using the provided token and new password.
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body as {
        token: string;
        newPassword: string;
      };

      const user = (await UserDAO.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      })) as IUser | null;

      if (!user) {
        res.status(400).json({ message: "Token inválido o expirado" });
        return;
      }

      // ⚠️ Asegúrate de tener hashing en un pre-save hook en tu modelo User
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await (user as any).save();

      res.json({ message: "Contraseña actualizada con éxito" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

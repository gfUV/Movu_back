import { Request, Response } from "express";
import crypto from "crypto";
import UserDAO from "../dao/UserDAO";
import { sendEmail } from "../services/emailService";
import { IUser } from "../models/User";

/**
 * Controller responsible for handling password recovery and reset operations.
 * 
 * @class PasswordController
 */
export default class PasswordController {
  /**
   * 📩 Step 1: Handles password recovery requests.
   * 
   * - Generates a unique token valid for 1 hour.
   * - Saves the token and expiration time in the user's record.
   * - Sends a recovery email with the reset link to the user.
   *
   * @async
   * @function requestReset
   * @memberof PasswordController
   * @param {Request} req - Express request object containing the user's email in the body.
   * @param {Response} res - Express response object used to send the HTTP response.
   * @returns {Promise<void>} Returns nothing. Sends a JSON response indicating success or failure.
   */
  async requestReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      console.log("📩 Solicitud de recuperación recibida para:", email);
      const user = (await UserDAO.findOne({ email })) as IUser | null;

      if (!user) {
        console.log("⚠️ Usuario no encontrado:", email);
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      // Generar token único (válido por 1 hora)
      const token = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
      await (user as any).save();

      // URL de recuperación (ajústala según tu frontend)
      const resetUrl = `https://movu-theta.vercel.app/ConfirResetPage?token=${token}`;

      // Enviar respuesta al cliente primero
      res.status(200).json({
        message: "Correo de recuperación enviado, revisa tu bandeja de entrada.",
      });

      // Enviar el correo (fuera del flujo principal)
      console.log("📧 Enviando correo a:", user.email);

      await sendEmail({
        to: user.email,
        subject: "Recuperación de contraseña",
        html: `
          <h2>Recuperar tu contraseña</h2>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <p><a href="${resetUrl}" style="color:#007bff;font-weight:bold">Restablecer contraseña</a></p>
          <p>Este enlace expirará en 1 hora.</p>
          <p>Si no solicitaste este cambio, ignora este correo.</p>
        `,
      });

      console.log("✅ Correo enviado exitosamente a", user.email);
    } catch (error: any) {
      console.error("❌ Error en requestReset:", error.message);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error interno al procesar la solicitud" });
      }
    }
  }

  /**
   * 🔑 Step 2: Handles password reset confirmation.
   * 
   * - Verifies that the reset token is valid and not expired.
   * - Updates the user's password.
   * - Clears the token and expiration fields from the user's record.
   *
   * @async
   * @function resetPassword
   * @memberof PasswordController
   * @param {Request} req - Express request object containing the token and new password in the body.
   * @param {Response} res - Express response object used to send the HTTP response.
   * @returns {Promise<void>} Returns nothing. Sends a JSON response indicating success or failure.
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      console.log("🔑 Intentando restablecer contraseña con token:", token);

      const user = (await UserDAO.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }, // token no expirado
      })) as IUser | null;

      if (!user) {
        console.log("⚠️ Token inválido o expirado");
        res.status(400).json({ message: "Token inválido o expirado" });
        return;
      }

      // Cambiar contraseña (asumiendo hash automático en pre-save)
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await (user as any).save();

      console.log("✅ Contraseña actualizada para:", user.email);
      res.json({ message: "Contraseña actualizada con éxito" });
    } catch (error: any) {
      console.error("❌ Error en resetPassword:", error.message);
      res.status(500).json({ message: "Error al restablecer la contraseña" });
    }
  }
}

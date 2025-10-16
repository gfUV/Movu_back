import { Router, Request, Response } from "express";
import PasswordController from "../controllers/PasswordController";

const passwordController = new PasswordController();

/**
 * Defines authentication-related routes for password reset and confirmation.
 * @module routes/password
 */

const router: Router = Router();

/**
 * POST /auth/reset-password
 * Sends an email with a password reset link.
 *
 * @name POST /auth/reset-password
 * @function
 * @memberof module:routes/password
 * @inner
 * @param req - Express request object containing the user email.
 * @param res - Express response object used to send responses.
 */
router.post("/reset-password", (req: Request, res: Response) =>
  passwordController.requestReset(req, res)
);

/**
 * POST /auth/reset-password/confirm
 * Resets the password using the provided token and new password.
 *
 * @name POST /auth/reset-password/confirm
 * @function
 * @memberof module:routes/password
 * @inner
 * @param req - Express request object containing the token and new password.
 * @param res - Express response object used to send responses.
 */
router.post("/reset-password/confirm", (req: Request, res: Response) =>
  passwordController.resetPassword(req, res)
);

export default router;

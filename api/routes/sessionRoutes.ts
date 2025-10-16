import { Router, Request, Response } from "express";
import SessionController from "../controllers/SessionController";

const sessionController = new SessionController();


/**
 * Session Routes
 *
 * Provides endpoints related to user authentication and session handling.
 *
 * @module api/routes/session
 */

const router: Router = Router();

/**
 * POST /sessions/login
 *
 * Handles user login by validating email and password.
 *
 * @name Login
 * @route {POST} /sessions/login
 * @body {string} email - The user's email address.
 * @body {string} password - The user's password.
 * @returns {Object} 200 - Success message and user ID.
 * @returns {Object} 400 - Missing fields, invalid credentials, or user not found.
 * @returns {Object} 500 - Internal server error.
 */
router.post("/login", (req: Request, res: Response) => {
  sessionController.login(req, res);
});

export default router;

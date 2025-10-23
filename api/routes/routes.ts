import { Router } from "express";
import userRoutes from "./userRoutes";
import sessionRoutes from "./sessionRoutes";
import passwordRoutes from "./passwordRoutes";

/**
 * Main API router.
 *
 * This file centralizes all route modules and mounts them under
 * their respective base paths.
 *
 * @module api/routes/index
 *
 * Mounted routes:
 * - `/users` → User management routes
 * - `/tasks` → Task management routes
 * - `/sessions` → Authentication and session routes
 * - `/auth` → Password reset & authentication routes
 */


const router: Router = Router();

router.use("/users", userRoutes);
router.use("/sessions", sessionRoutes);
router.use("/auth", passwordRoutes);

export default router;

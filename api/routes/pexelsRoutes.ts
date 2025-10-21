import { Router, Request, Response } from "express";
import { getPopularVideos } from "../controllers/PexelsController";

/**
 * @module routes/pexelsRoutes
 * Defines the routes that interact with the Pexels API.
 */
const router = Router();

/**
 * GET /api/pexels/videos/popular
 * Returns a list of popular videos from Pexels (limited to 3 results).
 */
router.get("/videos/popular", getPopularVideos);

export default router;
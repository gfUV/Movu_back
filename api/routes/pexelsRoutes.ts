import { Router } from "express";
import { getPopularVideos, searchVideos } from "../controllers/PexelsController";

/**
 * @module routes/pexelsRoutes
 * Defines the routes that interact with the Pexels API.
 */
const router = Router();

console.log("✅ Pexels routes loaded");

/**
 * GET /api/v1/pexels/videos/popular
 * Returns a list of popular videos from Pexels (limited to 3 results).
 */
router.get("/videos/popular", getPopularVideos);

/**
 * GET /api/v1/pexels/videos/search
 * Searches videos on Pexels using a query parameter.
 * Example: /api/v1/pexels/videos/search?query=nature&per_page=5
 */
router.get("/videos/search", searchVideos);

export default router;
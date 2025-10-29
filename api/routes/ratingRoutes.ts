import express from "express";
import RatingController from "../controllers/RatingController";

const router = express.Router();

/**
 * @file ratingRoutes.ts
 * @description Defines all routes related to video ratings.
 * Provides endpoints for creating/updating, retrieving averages, and user-specific ratings.
 */

// 🔹 Create or update a user's rating for a video
router.post("/", RatingController.rateVideo.bind(RatingController));

// 🔹 Get average rating for a video
router.get(
  "/average/:videoId",
  RatingController.getAverageRating.bind(RatingController)
);

// 🔹 Get a specific user's rating for a video
router.get(
  "/user",
  RatingController.getUserRating.bind(RatingController)
);

export default router;

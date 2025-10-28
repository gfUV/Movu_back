import express from "express";
import VideoController from "../controllers/VideoController";

const router = express.Router();

/**
 * Defines routes for managing videos and subtitles.
 * @module routes/videos
 */

// Register a new video
router.post("/", VideoController.addVideo.bind(VideoController));

// Get all videos
router.get("/", VideoController.getAll.bind(VideoController));

// Get a video by its Pexels ID
router.get("/:pexelsId", VideoController.getVideoByPexelsId.bind(VideoController));

export default router;

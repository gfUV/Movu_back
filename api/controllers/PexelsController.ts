import { Request, Response } from "express";
import { createClient } from "pexels";

/**
 * @module controllers/PexelsController
 * Handles communication with the Pexels API.
 */

/** Initializes the Pexels client with the API key from environment variables. */
const client = createClient(process.env.PEXELS_API_KEY as string);

/**
 * Fetches popular videos from Pexels.
 * @function
 * @async
 * @param {Request} _req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Responds with a JSON object containing the videos or an error.
 */
export const getPopularVideos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await client.videos.popular({ per_page: 3 });
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching Pexels videos:", err);
    res.status(500).json({ error: "Failed to fetch popular videos" });
  }
};
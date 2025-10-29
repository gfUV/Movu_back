import { Rating, IRating } from "../models/Rating";
import GlobalDAO from "./GlobalDAO";

/**
 * RatingDAO - Handles specific operations for the "ratings" collection.
 * Extends the generic CRUD functions from GlobalDAO.
 */
class RatingDAO extends GlobalDAO<IRating> {
  constructor() {
    super(Rating);
  }

  /**
   * Finds the rating given by a specific user for a specific video.
   * @param userId - The ID of the user.
   * @param videoId - The ID of the video (Pexels).
   * @returns The user's rating document or null.
   */
  async findByUserAndVideo(userId: string, videoId: string): Promise<IRating | null> {
    return await this.findOne({ userId, videoId });
  }

  /**
   * Finds all ratings for a specific video.
   * @param videoId - The ID of the video (Pexels).
   * @returns A list of ratings for the video.
   */
  async findByVideo(videoId: string): Promise<IRating[]> {
    return await this.getAll({ videoId });
  }

  /**
   * Calculates the average rating for a video.
   * @param videoId - The ID of the video (Pexels).
   * @returns The average rating (1–5) or 0 if no ratings exist.
   */
  async getAverageRating(videoId: string): Promise<number> {
    const result = await Rating.aggregate([
      { $match: { videoId } },
      { $group: { _id: "$videoId", avgRating: { $avg: "$rating" } } },
    ]);
    return result.length > 0 ? result[0].avgRating : 0;
  }

  /**
   * Updates the rating value for a user's existing rating.
   * @param userId - The ID of the user.
   * @param videoId - The ID of the video.
   * @param rating - The new rating value (1–5).
   * @returns The updated rating document.
   */
  async updateRating(userId: string, videoId: string, rating: number): Promise<IRating | null> {
    return await Rating.findOneAndUpdate(
      { userId, videoId },
      { rating },
      { new: true, upsert: false }
    );
  }
}

export default new RatingDAO();
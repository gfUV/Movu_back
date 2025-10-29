import { Request, Response } from "express";
import RatingDAO from "../dao/RatingDAO";
import GlobalController from "./GlobalController";
import { IRating } from "../models/Rating";

/**
 * RatingController
 *
 * Extends GlobalController to inherit generic CRUD operations,
 * adding specific methods for video rating management.
 */
class RatingController extends GlobalController<IRating> {
  constructor() {
    super(RatingDAO);
  }

  /**
   * Creates or updates a user's rating for a specific video.
   * If the user has already rated the video, it updates the value.
   */
  async rateVideo(req: Request, res: Response): Promise<void> {
    try {
      const { userId, videoId, rating } = req.body;

      if (!userId || !videoId || rating === undefined) {
        res.status(400).json({ message: "Faltan datos obligatorios." });
        return;
      }

      // Check if the user already rated this video
      const existing = await RatingDAO.findByUserAndVideo(userId, videoId);

      if (existing) {
        const updated = await RatingDAO.updateRating(userId, videoId, rating);
        res.status(200).json({
          message: "Calificación actualizada correctamente.",
          rating: updated,
        });
        return;
      }

      // Create new rating
      const newRating = await this.dao.create({
        userId,
        videoId,
        rating,
      } as Partial<IRating>);

      res.status(201).json({
        message: "Calificación registrada exitosamente.",
        rating: newRating,
      });
    } catch (error: any) {
      res.status(500).json({
        message: `Error al registrar la calificación: ${error.message}`,
      });
    }
  }

  /**
   * Retrieves the average rating for a specific video.
   */
  async getAverageRating(req: Request, res: Response): Promise<void> {
    try {
      const { videoId } = req.params;
      const average = await RatingDAO.getAverageRating(videoId);

      res.status(200).json({ videoId, average });
    } catch (error: any) {
      res.status(500).json({
        message: `Error al obtener la calificación promedio: ${error.message}`,
      });
    }
  }

  /**
   * Retrieves the rating given by a specific user for a specific video.
   */
  async getUserRating(req: Request, res: Response): Promise<void> {
    try {
      const { userId, videoId } = req.query;

      const rating = await RatingDAO.findByUserAndVideo(
        String(userId),
        String(videoId)
      );

      res.status(200).json(rating || { message: "El usuario no ha calificado este video." });
    } catch (error: any) {
      res.status(500).json({
        message: `Error al obtener la calificación del usuario: ${error.message}`,
      });
    }
  }
}

export default new RatingController();

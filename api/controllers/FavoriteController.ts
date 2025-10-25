import { Request, Response } from "express";
import FavoriteDAO from "../dao/FavoriteDAO";
import GlobalController from "./GlobalController";
import { IFavorite } from "../models/Favorite";

/**
 * FavoriteController
 *
 * Extiende GlobalController para heredar las operaciones CRUD genéricas,
 * y añade métodos específicos para favoritos.
 */
class FavoriteController extends GlobalController<IFavorite> {
  constructor() {
    super(FavoriteDAO);
  }

  /**
   * Agrega un video a favoritos del usuario.
   * Ahora también guarda videoData completo.
   */
  async addFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { userId, videoId, videoData } = req.body;
      const existing = await FavoriteDAO.findByUserAndVideo(userId, videoId);

      if (existing) {
        res.status(400).json({ message: "El video ya está en favoritos." });
        return;
      }

      // Guardamos videoId y videoData completo
      const favorite = await this.dao.create({
        userId,
        videoId,
        videoData,
      } as Partial<IFavorite>);

      res.status(201).json(favorite);
    } catch (error: any) {
      res.status(500).json({ message: `Error al agregar favorito: ${error.message}` });
    }
  }

  /**
   * Obtiene todos los favoritos de un usuario.
   */
  async getFavorites(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const favorites = await FavoriteDAO.findByUser(userId);

      // Retornamos videoData completo para el frontend
      const favoritesWithData = favorites.map((f) => ({
        ...f.toObject(),
        id: f.videoId,
      }));

      res.status(200).json(favoritesWithData);
    } catch (error: any) {
      res.status(500).json({ message: `Error al obtener favoritos: ${error.message}` });
    }
  }

  /**
   * Elimina un video de favoritos del usuario.
   */
  async removeFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { userId, videoId } = req.body;
      const deleted = await FavoriteDAO.deleteByUserAndVideo(userId, videoId);

      if (!deleted) {
        res.status(404).json({ message: "El favorito no existe." });
        return;
      }

      res.status(200).json({ message: "Favorito eliminado correctamente." });
    } catch (error: any) {
      res.status(500).json({ message: `Error al eliminar favorito: ${error.message}` });
    }
  }

  /**
   * Verifica si un video está en favoritos del usuario.
   */
  async checkFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { userId, videoId } = req.query;
      const favorite = await FavoriteDAO.findByUserAndVideo(
        String(userId),
        String(videoId)
      );
      res.status(200).json({ isFavorite: !!favorite });
    } catch (error: any) {
      res.status(500).json({ message: `Error al verificar favorito: ${error.message}` });
    }
  }
}

export default new FavoriteController();

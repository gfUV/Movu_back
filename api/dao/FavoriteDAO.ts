import { Favorite, IFavorite } from "../models/Favorite";
import GlobalDAO from "./GlobalDAO";

/**
 * FavoriteDAO - Maneja las operaciones específicas de la colección "favorites".
 * Extiende las funciones CRUD genéricas de GlobalDAO.
 */
class FavoriteDAO extends GlobalDAO<IFavorite> {
  constructor() {
    super(Favorite);
  }

  /**
   * Busca todos los favoritos de un usuario.
   * @param userId - ID del usuario.
   * @returns Lista de favoritos del usuario.
   */
  async findByUser(userId: string): Promise<IFavorite[]> {
    return await this.getAll({ userId });
  }

  /**
   * Busca si un video está en favoritos del usuario.
   * @param userId - ID del usuario.
   * @param videoId - ID del video (Pexels).
   * @returns Documento del favorito o null.
   */
  async findByUserAndVideo(userId: string, videoId: string): Promise<IFavorite | null> {
    return await this.findOne({ userId, videoId });
  }

  /**
   * Elimina un video de favoritos del usuario.
   * @param userId - ID del usuario.
   * @param videoId - ID del video.
   * @returns Documento eliminado o null.
   */
  async deleteByUserAndVideo(userId: string, videoId: string): Promise<IFavorite | null> {
    return await Favorite.findOneAndDelete({ userId, videoId });
  }
}

export default new FavoriteDAO();

import { Request, Response } from "express";
import CommentDAO from "../dao/CommentDAO";
import GlobalController from "./GlobalController";
import { IComment } from "../models/Comment";

/**
 * @class CommentController
 * @extends GlobalController
 * @description Handles business logic for user comments on videos.
 * Inherits generic CRUD operations from GlobalController and adds
 * specific methods for comment handling.
 */
class CommentController extends GlobalController<IComment> {
  constructor() {
    super(CommentDAO);
  }

  /**
   * Adds a comment to a video.
   * @async
   * @param {Request} req - Express request.
   * @param {Response} res - Express response.
   */
  async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { userId, videoId, text } = req.body;

      if (!userId || !videoId || !text) {
        res.status(400).json({ message: "Faltan datos obligatorios para agregar el comentario." });
        return;
      }

      const comment = await this.dao.create({
        userId,
        videoId,
        text,
      } as Partial<IComment>);

      res.status(201).json(comment);
    } catch (error: any) {
      res.status(500).json({ message: `Error al agregar comentario: ${error.message}` });
    }
  }

  /**
   * Gets all comments for a given video.
   * @async
   * @param {Request} req - Express request.
   * @param {Response} res - Express response.
   */
  async getCommentsByVideo(req: Request, res: Response): Promise<void> {
    try {
      const { videoId } = req.params;
      const comments = await CommentDAO.findByVideo(videoId);
      res.status(200).json(comments);
    } catch (error: any) {
      res.status(500).json({ message: `Error al obtener comentarios: ${error.message}` });
    }
  }

  /**
   * Gets all comments made by a specific user.
   * @async
   * @param {Request} req - Express request.
   * @param {Response} res - Express response.
   */
  async getCommentsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const comments = await CommentDAO.findByUser(userId);
      res.status(200).json(comments);
    } catch (error: any) {
      res.status(500).json({ message: `Error al obtener los comentarios del usuario: ${error.message}` });
    }
  }

  /**
   * Updates the text of a comment.
   * @async
   * @param {Request} req - Express request.
   * @param {Response} res - Express response.
   */
  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId, text } = req.body;

      if (!commentId || !text) {
        res.status(400).json({ message: "Faltan datos para actualizar el comentario." });
        return;
      }

      const updated = await CommentDAO.updateCommentText(commentId, text);

      if (!updated) {
        res.status(404).json({ message: "Comentario no encontrado." });
        return;
      }

      res.status(200).json({ message: "Comentario actualizado correctamente.", updated });
    } catch (error: any) {
      res.status(500).json({ message: `Error al actualizar comentario: ${error.message}` });
    }
  }

  /**
   * Deletes a comment by its ID.
   * @async
   * @param {Request} req - Express request.
   * @param {Response} res - Express response.
   */
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.body;

      if (!commentId) {
        res.status(400).json({ message: "Falta el ID del comentario a eliminar." });
        return;
      }

      const deleted = await CommentDAO.deleteComment(commentId);

      if (!deleted) {
        res.status(404).json({ message: "Comentario no encontrado." });
        return;
      }

      res.status(200).json({ message: "Comentario eliminado correctamente." });
    } catch (error: any) {
      res.status(500).json({ message: `Error al eliminar comentario: ${error.message}` });
    }
  }
}

export default new CommentController();
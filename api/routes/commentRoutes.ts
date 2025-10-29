import express from "express";
import CommentController from "../controllers/CommentController";

const router = express.Router();

/**
 * Defines routes for managing user comments on videos.
 * All routes use CommentController methods.
 */

// Agregar un nuevo comentario
router.post("/", CommentController.addComment.bind(CommentController));

// Obtener todos los comentarios de un video
router.get(
  "/video/:videoId",
  CommentController.getCommentsByVideo.bind(CommentController)
);

// Obtener todos los comentarios de un usuario
router.get(
  "/user/:userId",
  CommentController.getCommentsByUser.bind(CommentController)
);

// Actualizar un comentario (solo autor)
router.put("/", CommentController.updateComment.bind(CommentController));

// Eliminar un comentario (solo autor)
router.delete("/", CommentController.deleteComment.bind(CommentController));

export default router;

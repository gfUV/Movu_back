import express from "express";
import FavoriteController from "../controllers/FavoriteController";

const router = express.Router();

// Agregar un video a favoritos
router.post("/", FavoriteController.addFavorite.bind(FavoriteController));

// Obtener todos los favoritos de un usuario
router.get(
  "/:userId",
  FavoriteController.getFavorites.bind(FavoriteController)
);

// Eliminar un favorito
router.delete("/", FavoriteController.removeFavorite.bind(FavoriteController));

// Verificar si un video está en favoritos
router.get(
  "/check/favorite",
  FavoriteController.checkFavorite.bind(FavoriteController)
);

export default router;

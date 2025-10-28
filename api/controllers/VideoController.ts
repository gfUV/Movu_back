import { Request, Response } from "express";
import VideoDAO from "../dao/VideoDAO";
import GlobalController from "./GlobalController";
import { IVideo } from "../models/Video";

/**
 * Controller for managing video-related operations.
 * Extends GlobalController for shared CRUD functionality.
 */
class VideoController extends GlobalController<IVideo> {
  constructor() {
    super(VideoDAO);
  }

/**
 * Registers a new video with its subtitle URLs.
 * Automatically links existing .vtt subtitle files from /subtitles directory.
 * @route POST /videos
 */
async addVideo(req: Request, res: Response): Promise<void> {
  try {
    const { pexelsId, title, videoUrl } = req.body;

    if (!pexelsId || !videoUrl) {
      res.status(400).json({
        message: "El ID de Pexels y la URL del video son obligatorios.",
      });
      return;
    }

    const existing = await VideoDAO.findByPexelsId(pexelsId);
    if (existing) {
      res
        .status(400)
        .json({ message: "El video ya existe en la base de datos." });
      return;
    }

    // 🔹 Define la URL base del backend (local o producción)
    const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";

    // 🔹 Genera automáticamente las URLs de subtítulos
    const subtitles = {
      es: `${baseUrl}/subtitles/${pexelsId}_es.vtt`,
      en: `${baseUrl}/subtitles/${pexelsId}_en.vtt`,
    };

    // 🔹 Crea el registro en la base de datos
    const video = await VideoDAO.create({
      pexelsId,
      title,
      videoUrl,
      subtitles,
    });

    res.status(201).json({
      message: "Video registrado exitosamente con subtítulos.",
      data: video,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno al registrar el video." });
  }
}

  /**
   * Retrieves a video by its Pexels ID.
   * @route GET /videos/:pexelsId
   */
  async getVideoByPexelsId(req: Request, res: Response): Promise<void> {
    try {
      const { pexelsId } = req.params;
      const video = await VideoDAO.findByPexelsId(pexelsId);

      if (!video) {
        res
          .status(404)
          .json({ message: "No se encontró el video solicitado." });
        return;
      }

      res.status(200).json(video);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno al obtener el video." });
    }
  }
}

export default new VideoController();

import VideoModel, { IVideo } from "../models/Video";
import GlobalDAO from "./GlobalDAO";

/**
 * Data Access Object for managing Video entities.
 * Extends the generic GlobalDAO to provide video-specific logic.
 */
class VideoDAO extends GlobalDAO<IVideo> {
  constructor() {
    super(VideoModel);
  }

  /**
   * Finds a video by its Pexels ID.
   * @param {string} pexelsId - The Pexels video ID.
   * @returns {Promise<Video | null>} The video document if found.
   */
  async findByPexelsId(pexelsId: string): Promise<IVideo | null> {
    return this.model.findOne({ pexelsId });
  }
}

export default new VideoDAO();

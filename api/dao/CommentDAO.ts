import { Comment, IComment } from "../models/Comment";
import GlobalDAO from "./GlobalDAO";

/**
 * @class CommentDAO
 * @extends GlobalDAO
 * @description Data Access Object for managing comments on videos.
 * Provides specific queries for finding, updating, and deleting comments.
 */
class CommentDAO extends GlobalDAO<IComment> {
  constructor() {
    super(Comment);
  }

  /**
   * Finds all comments for a specific video.
   * @param {string} videoId - The video’s Pexels ID.
   * @returns {Promise<IComment[]>} List of comments for the video.
   */
  async findByVideo(videoId: string): Promise<IComment[]> {
    return await this.getAll({ videoId });
  }

  /**
   * Finds all comments made by a specific user.
   * @param {string} userId - The user’s ID.
   * @returns {Promise<IComment[]>} List of comments made by the user.
   */
  async findByUser(userId: string): Promise<IComment[]> {
    return await this.getAll({ userId });
  }

  /**
   * Finds a specific comment by user and video.
   * Useful to verify if the user already commented.
   * @param {string} userId - The user’s ID.
   * @param {string} videoId - The video’s Pexels ID.
   * @returns {Promise<IComment | null>} The comment document, if found.
   */
  async findByUserAndVideo(userId: string, videoId: string): Promise<IComment | null> {
    return await this.findOne({ userId, videoId });
  }

  /**
   * Updates a comment’s text.
   * @param {string} commentId - The comment’s ID.
   * @param {string} newText - The updated text.
   * @returns {Promise<IComment | null>} The updated comment or null.
   */
  async updateCommentText(commentId: string, newText: string): Promise<IComment | null> {
    return await Comment.findByIdAndUpdate(
      commentId,
      { text: newText },
      { new: true }
    );
  }

  /**
   * Deletes a comment by its ID.
   * @param {string} commentId - The comment’s ID.
   * @returns {Promise<IComment | null>} The deleted comment or null.
   */
  async deleteComment(commentId: string): Promise<IComment | null> {
    return await Comment.findByIdAndDelete(commentId);
  }
}

export default new CommentDAO();

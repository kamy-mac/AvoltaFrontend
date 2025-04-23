/**
 * Comment Service
 *
 * This module provides functionality for managing comments on publications.
 *
 * @module services/comment
 */

import api from "./api";
import { Comment } from "../types";

// Removed unused ApiResponse interface

/**
 * Comment service
 */
class CommentService {
  /**
   * Get comments for a publication
   * @param publicationId Publication ID
   * @returns List of comments
   */
  public async getCommentsByPublicationId(
    publicationId: string
  ): Promise<Comment[]> {
    try {
      const response = await api.getComments(publicationId);
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching comments for publication ${publicationId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Create a new comment (requires authentication)
   * @param publicationId Publication ID
   * @param content Comment content
   * @returns Created comment
   */
  public async createComment(
    publicationId: string,
    content: string
  ): Promise<Comment> {
    try {
      const response = await api.addComment(publicationId, { content });
      return response.data.data;
    } catch (error) {
      console.error(
        `Error creating comment for publication ${publicationId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete a comment (requires authentication)
   * @param publicationId Publication ID
   * @param commentId Comment ID
   */
  public async deleteComment(
    publicationId: string,
    commentId: string
  ): Promise<void> {
    try {
      await api.deleteComment(publicationId, commentId);
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const commentService = new CommentService();
export default commentService;

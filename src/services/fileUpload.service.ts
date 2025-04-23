/**
 * File Upload Service
 *
 * This module provides functionality for uploading files to the server.
 *
 * @module services/fileUpload
 */

import api from "./api";

/**
 * File upload service
 */
class FileUploadService {
  /**
   * Upload file to server
   * @param file File to upload
   * @returns URL of the uploaded file
   */
  public async uploadFile(file: File): Promise<string> {
    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name);
      
      // Make the API call
      const response = await api.uploadFile(formData);
      
      console.log("Upload response:", response.data);
      
      // Return the URL of the uploaded file
      // Adaptez cette ligne selon la structure réelle de votre réponse
       // Extract the file URL from the response
    if (response.data && response.data.fileUrl) {
        return response.data.fileUrl;
      } else {
        throw new Error("Unexpected response format: " + JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const fileUploadService = new FileUploadService();
export default fileUploadService;
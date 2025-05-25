// src/services/imageUpload.service.ts
import api from './api';

export interface ImageUploadResponse {
  width: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
  height: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
  imageUrl: string;
  publicId: string;
  originalFileName: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
}

class ImageUploadService {
  async uploadImage(file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Erreur upload image:', error);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de l\'upload de l\'image'
      );
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await api.delete(`/images/${publicId}`);
    } catch (error: any) {
      console.error('Erreur suppression image:', error);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la suppression de l\'image'
      );
    }
  }
}

export default new ImageUploadService();
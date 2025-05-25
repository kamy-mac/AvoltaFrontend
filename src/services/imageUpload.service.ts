// src/services/imageUpload.service.ts
import { API_CONFIG } from '../config/api-config';

export interface ImageUploadResponse {
  width: number;
  height: number;
  imageUrl: string;
  publicId: string;
  originalFileName: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

class ImageUploadService {
  private readonly baseUrl = API_CONFIG.BASE_URL;

  /**
   * Upload une image vers Cloudinary via le backend
   */
  async uploadImage(file: File): Promise<ImageUploadResponse> {
    try {
      // Validation côté client
      this.validateImageFile(file);

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${this.baseUrl}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Erreur HTTP: ${response.status}`
        );
      }

      const result: ApiResponse<ImageUploadResponse> = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de l\'upload');
      }

      return result.data;
    } catch (error) {
      console.error('Erreur lors de l\'upload d\'image:', error);
      throw error;
    }
  }

  /**
   * Supprime une image de Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${this.baseUrl}/images/${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Erreur HTTP: ${response.status}`
        );
      }
    } catch (error) {
      console.error('Erreur lors de la suppression d\'image:', error);
      throw error;
    }
  }

  /**
   * Génère une URL d'image transformée
   */
  getTransformedImageUrl(
    publicId: string, 
    width: number, 
    height: number, 
    cropMode: string = 'fill'
  ): string {
    try {
      // Pour Cloudinary, on peut construire l'URL directement
      // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
      const baseCloudinaryUrl = 'https://res.cloudinary.com/dlskkweya/image/upload';
      const transformations = `w_${width},h_${height},c_${cropMode},q_auto,f_auto`;
      return `${baseCloudinaryUrl}/${transformations}/${publicId}`;
    } catch (error) {
      console.error('Erreur lors de la génération d\'URL transformée:', error);
      // Retourner l'URL de base en cas d'erreur
      return `https://res.cloudinary.com/dlskkweya/image/upload/${publicId}`;
    }
  }

  /**
   * Validation des fichiers côté client
   */
  private validateImageFile(file: File): void {
    if (!file) {
      throw new Error('Aucun fichier sélectionné');
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format d\'image non supporté. Formats acceptés: JPEG, PNG, GIF, WebP');
    }

    // Vérifier la taille (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('La taille du fichier ne doit pas dépasser 10MB');
    }
  }

  /**
   * Prévisualise une image avant upload
   */
  previewImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Aucun fichier fourni'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Compresse une image avant upload (optionnel)
   */
  async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculer les nouvelles dimensions
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          const newWidth = img.width * ratio;
          const newHeight = img.height * ratio;

          // Redimensionner le canvas
          canvas.width = newWidth;
          canvas.height = newHeight;

          // Dessiner l'image redimensionnée
          ctx?.drawImage(img, 0, 0, newWidth, newHeight);

          // Convertir en blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Erreur lors de la compression'));
              }
            },
            file.type,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Erreur lors du chargement de l\'image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export default new ImageUploadService();
// src/services/imageUpload.service.ts

import api from './api';

export interface ImageUploadResponse {
  imageUrl: string;
  publicId: string;
  originalFileName: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface ImageUploadError {
  message: string;
  code?: string;
}

class ImageUploadService {
  /**
   * Upload une image vers Cloudinary via l'API backend
   */
  async uploadImage(file: File): Promise<ImageUploadResponse> {
    try {
      // Validation côté client
      this.validateImageFile(file);

      // Création du FormData
      const formData = new FormData();
      formData.append('file', file);

      // Appel API
      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Progress tracking si nécessaire
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'upload');
      }
    } catch (error: any) {
      console.error('Erreur upload image:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Erreur inconnue lors de l\'upload');
      }
    }
  }

  /**
   * Supprime une image de Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      const response = await api.delete(`/images/${publicId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur lors de la suppression');
      }
    } catch (error: any) {
      console.error('Erreur suppression image:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Erreur lors de la suppression de l\'image');
      }
    }
  }

  /**
   * Validation côté client
   */
  private validateImageFile(file: File): void {
    // Vérifier que c'est bien un fichier
    if (!file) {
      throw new Error('Aucun fichier sélectionné');
    }

    // Vérifier le type MIME
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format de fichier non supporté. Utilisez JPEG, PNG, GIF ou WebP.');
    }

    // Vérifier la taille (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('Le fichier est trop volumineux. Taille maximum: 10MB.');
    }

    // Vérifier le nom du fichier
    if (file.name.length > 255) {
      throw new Error('Le nom du fichier est trop long.');
    }
  }

  /**
   * Redimensionne une image côté client avant upload (optionnel)
   */
  async resizeImage(file: File, maxWidth: number = 1200, maxHeight: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Configurer le canvas
        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Erreur lors du redimensionnement'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Impossible de charger l\'image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Génère un aperçu de l'image
   */
  generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Erreur lors de la génération de l\'aperçu'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Génère une URL Cloudinary transformée
   */
  getTransformedUrl(publicId: string, width?: number, height?: number, crop: string = 'fill'): string {
    // Cette fonction peut être utilisée pour générer des URLs avec transformations
    // côté client, mais il est recommandé de le faire côté serveur
    const baseUrl = 'https://res.cloudinary.com/dlskkweya/image/upload/';
    
    let transformations = '';
    if (width && height) {
      transformations = `w_${width},h_${height},c_${crop}/`;
    } else if (width) {
      transformations = `w_${width}/`;
    } else if (height) {
      transformations = `h_${height}/`;
    }
    
    return `${baseUrl}${transformations}${publicId}`;
  }

  /**
   * Utilitaire pour formater la taille des fichiers
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default new ImageUploadService();
import api from './api';

// Interface principale pour les réponses d'upload
export interface ImageUploadResponse {
  imageUrl: string;
  publicId?: string;
  originalFileName: string;
  fileSize: number;
  width?: number;
  height?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

// Alias pour compatibilité
export interface ImageUploadResult extends ImageUploadResponse {}

class ImageUploadService {
  /**
   * Upload une image vers Cloudinary via le backend
   */
  async uploadImage(file: File): Promise<ImageUploadResult> {
    try {
      console.log('Uploading image to Cloudinary...');
      
      // Validation côté client
      this.validateFile(file);

      // Utiliser la méthode Cloudinary du service API
      const response = await api.uploadToCloudinary(file);
      
      // Vérifier le statut de la réponse
      if (response.status !== 200) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      // Vérifier la structure de la réponse
      const responseData = response.data;
      
      if (!responseData) {
        throw new Error('Réponse vide du serveur');
      }

      // Gérer différents formats de réponse possible
      let imageData;
      if (responseData.success === false) {
        throw new Error(responseData.message || 'Erreur lors de l\'upload');
      }
      
      if (responseData.data) {
        imageData = responseData.data;
      } else if (responseData.imageUrl) {
        imageData = responseData;
      } else {
        throw new Error('Format de réponse invalide du serveur');
      }

      if (!imageData.imageUrl && !imageData.url) {
        throw new Error('URL de l\'image manquante dans la réponse');
      }

      console.log('Image uploaded successfully:', imageData);
      
      // Adapter la réponse selon le format de votre backend
      const result: ImageUploadResponse = {
        imageUrl: imageData.imageUrl || imageData.url,
        publicId: imageData.publicId || imageData.public_id,
        originalFileName: imageData.originalFileName || imageData.original_filename || file.name,
        fileSize: imageData.fileSize || imageData.file_size || file.size,
        width: imageData.width,
        height: imageData.height,
        dimensions: imageData.dimensions || (imageData.width && imageData.height ? {
          width: imageData.width,
          height: imageData.height
        } : undefined)
      };

      return result;
    } catch (error) {
      console.error('Erreur upload image Cloudinary:', error);
      
      // Extraire le message d'erreur approprié
      let errorMessage = 'Erreur inconnue lors de l\'upload';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        // Essayer d'extraire le message d'erreur de différentes propriétés
        const errorObj = error as any;
        errorMessage = errorObj.message || 
                     errorObj.error || 
                     errorObj.details || 
                     'Erreur lors de l\'upload vers Cloudinary';
      }

      // Ne pas inclure "Erreur lors de l'upload de l'image:" si déjà présent
      if (!errorMessage.includes('Erreur lors de l\'upload')) {
        errorMessage = `Erreur lors de l'upload de l'image: ${errorMessage}`;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Upload d'image classique (fallback)
   */
  async uploadImageClassic(file: File): Promise<ImageUploadResult> {
    try {
      console.log('Uploading image via classic endpoint...');
      
      this.validateFile(file);

      const response = await api.uploadImage(file);
      
      if (response.status !== 200) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('Classic upload response:', response.data);
      
      const responseData = response.data;
      
      if (!responseData) {
        throw new Error('Réponse vide du serveur');
      }

      // Construire l'URL de l'image
      let imageUrl = '';
      if (responseData.fileUrl) {
        imageUrl = responseData.fileUrl;
      } else if (responseData.filename) {
        imageUrl = api.getImageUrl(responseData.filename);
      } else if (responseData.url) {
        imageUrl = responseData.url;
      } else {
        throw new Error('Impossible de déterminer l\'URL de l\'image');
      }
      
      const result: ImageUploadResponse = {
        imageUrl: imageUrl,
        originalFileName: responseData.originalFileName || file.name,
        fileSize: responseData.fileSize || file.size,
        width: responseData.width,
        height: responseData.height,
        dimensions: responseData.dimensions
      };
      
      return result;
    } catch (error) {
      console.error('Erreur upload image classique:', error);
      
      let errorMessage = 'Erreur inconnue lors de l\'upload';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      throw new Error(`Erreur lors de l'upload de l'image: ${errorMessage}`);
    }
  }

  /**
   * Supprimer une image de Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      if (!publicId) {
        throw new Error('Public ID manquant');
      }

      await api.delete(`/images/${publicId}`);
      console.log('Image deleted successfully');
    } catch (error) {
      console.error('Erreur suppression image:', error);
      throw new Error('Erreur lors de la suppression de l\'image');
    }
  }

  /**
   * Valider le fichier avant upload
   */
  private validateFile(file: File): void {
    if (!file) {
      throw new Error('Aucun fichier sélectionné');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Le fichier doit être une image');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('La taille du fichier ne doit pas dépasser 10MB');
    }

    if (file.size === 0) {
      throw new Error('Le fichier est vide');
    }

    const supportedFormats = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'image/webp',
      'image/bmp',
      'image/tiff'
    ];
    
    if (!supportedFormats.includes(file.type)) {
      throw new Error('Format non supporté. Utilisez JPEG, PNG, GIF, WebP, BMP ou TIFF');
    }

    // Vérifier le nom du fichier
    if (file.name.length > 255) {
      throw new Error('Le nom du fichier est trop long');
    }

    // Vérifier les caractères spéciaux dans le nom
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(file.name)) {
      throw new Error('Le nom du fichier contient des caractères non autorisés');
    }
  }

  /**
   * Valider une URL d'image
   */
  validateImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Obtenir les informations d'une image à partir de son URL
   */
  async getImageInfo(url: string): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      if (!this.validateImageUrl(url)) {
        resolve(null);
        return;
      }

      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = url;
    });
  }

  /**
   * Redimensionner une image côté client (utilitaire)
   */
  async resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
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

          canvas.width = width;
          canvas.height = height;

          // Dessiner l'image redimensionnée
          ctx?.drawImage(img, 0, 0, width, height);

          // Convertir en blob
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Erreur lors du redimensionnement'));
            }
          }, file.type, quality);
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
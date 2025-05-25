
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import imageUploadService, { ImageUploadResponse } from '../../services/imageUpload.service';

// Configuration constants
const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxWidth: 4096,
  maxHeight: 4096,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
} as const;

interface ImageUploadProps {
  onImageUploaded: (imageData: ImageUploadResponse) => void;
  currentImageUrl?: string;
  onImageRemoved?: () => void;
  className?: string;
  disabled?: boolean;
  maxFileSize?: number;
  acceptedTypes?: string[];
  showPreview?: boolean;
  multiple?: boolean;
  onProgress?: (progress: number) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export default function ImageUpload({
  onImageUploaded,
  currentImageUrl,
  onImageRemoved,
  className = '',
  disabled = false,
  maxFileSize = UPLOAD_CONFIG.maxFileSize,
  acceptedTypes = [...UPLOAD_CONFIG.acceptedTypes],
  showPreview = true,
  multiple = false,
  onProgress
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Clear success message after delay
  useEffect(() => {
    if (uploadState.success) {
      const timer = setTimeout(() => {
        setUploadState(prev => ({ ...prev, success: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadState.success]);

  const validateFile = useCallback((file: File): string | null => {
    // Vérification du type MIME
    if (!acceptedTypes.includes(file.type)) {
      return `Type de fichier non supporté. Formats acceptés: ${acceptedTypes.join(', ')}`;
    }

    // Vérification de la taille
    if (file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(1);
      return `Fichier trop volumineux. Taille maximale: ${maxSizeMB}MB`;
    }

    // Vérification du nom de fichier
    if (file.name.length > 255) {
      return 'Nom de fichier trop long (maximum 255 caractères)';
    }

    return null;
  }, [acceptedTypes, maxFileSize]);

  const validateImageDimensions = useCallback((file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        if (img.width > UPLOAD_CONFIG.maxWidth || img.height > UPLOAD_CONFIG.maxHeight) {
          resolve(`Dimensions trop importantes. Maximum: ${UPLOAD_CONFIG.maxWidth}x${UPLOAD_CONFIG.maxHeight}px`);
        } else {
          resolve(null);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('Fichier image corrompu ou invalide');
      };
      
      img.src = url;
    });
  }, []);

  const updateUploadState = useCallback((updates: Partial<UploadState>) => {
    setUploadState(prev => ({ ...prev, ...updates }));
  }, []);

  const createPreview = useCallback((file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, [previewUrl]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (multiple) {
        files.forEach(file => handleFileUpload(file));
      } else {
        handleFileUpload(files[0]);
      }
    }
  }, [multiple]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (multiple) {
        fileArray.forEach(file => handleFileUpload(file));
      } else if (fileArray[0]) {
        handleFileUpload(fileArray[0]);
      }
    }
    // Reset input value pour permettre la re-sélection du même fichier
    e.target.value = '';
  }, [multiple]);

  const handleFileUpload = async (file: File) => {
    updateUploadState({
      error: null,
      isUploading: true,
      progress: 0,
      success: false
    });

    try {
      // Validation côté client
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // Validation des dimensions pour les images
      const dimensionError = await validateImageDimensions(file);
      if (dimensionError) {
        throw new Error(dimensionError);
      }

      // Créer un aperçu si demandé
      if (showPreview) {
        createPreview(file);
      }

      // Simuler le progrès pour l'UX (à adapter selon votre service)
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          if (prev.progress < 90) {
            const newProgress = prev.progress + Math.random() * 20;
            onProgress?.(newProgress);
            return { ...prev, progress: Math.min(newProgress, 90) };
          }
          return prev;
        });
      }, 200);

      const result = await imageUploadService.uploadImage(file);
      
      clearInterval(progressInterval);
      updateUploadState({
        isUploading: false,
        progress: 100,
        success: true
      });
      
      onProgress?.(100);
      onImageUploaded(result);
      
    } catch (error: any) {
      updateUploadState({
        error: error.message || 'Erreur lors du téléchargement',
        isUploading: false,
        progress: 0
      });
      onProgress?.(0);
    }
  };

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    updateUploadState({
      error: null,
      success: false,
      progress: 0
    });
    onImageRemoved?.();
  }, [previewUrl, onImageRemoved]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const isDisabled = disabled || uploadState.isUploading;
  const displayImageUrl = currentImageUrl || previewUrl;

  return (
    <div className={`w-full ${className}`}>
      {/* Zone d'upload */}
      {!displayImageUrl && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.02]'
              : 'border-gray-300 hover:border-gray-400'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isDisabled && fileInputRef.current?.click()}
          onKeyDown={handleKeyDown}
          tabIndex={isDisabled ? -1 : 0}
          role="button"
          aria-label="Zone de téléchargement d'image"
          aria-describedby="upload-instructions"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isDisabled}
            multiple={multiple}
            aria-label="Sélectionner des fichiers images"
          />

          {uploadState.isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600 mb-2">Téléchargement en cours...</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${uploadState.progress}%` }}
                >
                  <span className="text-xs text-white font-medium">
                    {Math.round(uploadState.progress)}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2" id="upload-instructions">
                Glissez votre{multiple ? 's' : ''} image{multiple ? 's' : ''} ici ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Formats supportés: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
              </p>
              <p className="text-xs text-gray-400">
                Taille maximale: {formatFileSize(maxFileSize)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Aperçu de l'image */}
      {displayImageUrl && (
        <div className="relative group">
          <img
            src={displayImageUrl}
            alt="Image téléchargée"
            className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md opacity-90 hover:opacity-100"
            title="Supprimer l'image"
            aria-label="Supprimer l'image"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
          
          {/* Overlay de succès */}
          {uploadState.success && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="bg-white rounded-full p-2 shadow-md">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Messages d'état */}
      {uploadState.error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-600 font-medium">Erreur de téléchargement</p>
            <p className="text-sm text-red-500">{uploadState.error}</p>
          </div>
        </div>
      )}

      {uploadState.success && !uploadState.error && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-600 font-medium">Image téléchargée avec succès!</p>
        </div>
      )}
    </div>
  );
}
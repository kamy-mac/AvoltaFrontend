// src/components/admin/ImageUpload.tsx
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import imageUploadService from '../../services/imageUpload.service';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string, publicId: string) => void;
  onImageRemoved?: () => void;
  currentImageUrl?: string;
  className?: string;
  maxSizeMB?: number;
  aspectRatio?: 'square' | '16:9' | '4:3' | 'auto';
  showPreview?: boolean;
}

interface UploadStatus {
  type: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
  progress?: number;
}

export default function ImageUpload({
  onImageUploaded,
  onImageRemoved,
  currentImageUrl,
  className = '',
  maxSizeMB = 10,
  aspectRatio = 'auto',
  showPreview = true
}: ImageUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ type: 'idle' });
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    auto: 'min-h-[200px]'
  };

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setUploadStatus({ type: 'uploading', message: 'Préparation du fichier...' });

      // Validation
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Le fichier doit faire moins de ${maxSizeMB}MB`);
      }

      // Prévisualisation
      if (showPreview) {
        const preview = await imageUploadService.previewImage(file);
        setPreviewUrl(preview);
      }

      setUploadStatus({ type: 'uploading', message: 'Upload en cours...', progress: 50 });

      // Upload
      const result = await imageUploadService.uploadImage(file);
      
      setUploadStatus({ type: 'success', message: 'Image uploadée avec succès!' });
      setPreviewUrl(result.imageUrl);
      onImageUploaded(result.imageUrl, result.publicId);

      // Reset status after 3 seconds
      setTimeout(() => {
        setUploadStatus({ type: 'idle' });
      }, 3000);

    } catch (error) {
      console.error('Erreur upload:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Erreur lors de l\'upload' 
      });
      setPreviewUrl(null);

      // Reset error after 5 seconds
      setTimeout(() => {
        setUploadStatus({ type: 'idle' });
      }, 5000);
    }
  }, [maxSizeMB, showPreview, onImageUploaded]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setPreviewUrl(null);
    setUploadStatus({ type: 'idle' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemoved?.();
  }, [onImageRemoved]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getStatusIcon = () => {
    switch (uploadStatus.type) {
      case 'uploading':
        return <Loader2 className="w-6 h-6 animate-spin text-blue-500" />;
      case 'success':
        return <Check className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Upload className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus.type) {
      case 'uploading':
        return 'border-blue-300 bg-blue-50';
      case 'success':
        return 'border-green-300 bg-green-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      default:
        return dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <div
        className={`
          relative rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer
          ${aspectRatioClasses[aspectRatio]}
          ${getStatusColor()}
          hover:border-primary hover:bg-primary/5
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Sélectionner une image"
        />

        {previewUrl ? (
          // Prévisualisation de l'image
          <div className="relative w-full h-full group">
            <img
              src={previewUrl}
              alt="Prévisualisation"
              className="w-full h-full object-cover rounded-lg"
            />
            
            {/* Overlay avec boutons */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                aria-label="Changer l'image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                aria-label="Supprimer l'image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status indicator */}
            {uploadStatus.type === 'uploading' && (
              <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">{uploadStatus.message}</p>
                  {uploadStatus.progress && (
                    <div className="w-32 h-2 bg-white/20 rounded-full mt-2 mx-auto">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${uploadStatus.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Zone de drop vide
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            {getStatusIcon()}
            
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {uploadStatus.type === 'uploading' 
                ? 'Upload en cours...' 
                : 'Ajouter une image'
              }
            </h3>
            
            <p className="mt-2 text-sm text-gray-500">
              {uploadStatus.type === 'uploading' 
                ? uploadStatus.message
                : 'Glissez-déposez une image ici, ou cliquez pour sélectionner'
              }
            </p>

            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG, GIF, WebP jusqu'à {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {/* Messages de statut */}
      {uploadStatus.message && uploadStatus.type !== 'uploading' && (
        <div className={`p-3 rounded-md flex items-center space-x-2 ${
          uploadStatus.type === 'success' 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {getStatusIcon()}
          <span className="text-sm">{uploadStatus.message}</span>
        </div>
      )}

      {/* Barre de progression pour l'upload */}
      {uploadStatus.type === 'uploading' && uploadStatus.progress && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadStatus.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
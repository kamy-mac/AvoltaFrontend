

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import imageUploadService, { ImageUploadResponse } from '../../services/imageUpload.service';

interface ImageUploadProps {
  onImageUpload: (imageData: ImageUploadResponse) => void;
  onImageRemove?: () => void;
  currentImageUrl?: string;
  disabled?: boolean;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  showPreview?: boolean;
  className?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: string | null;
}

export default function ImageUpload({
  onImageUpload,
  onImageRemove,
  currentImageUrl,
  disabled = false,
  maxSizeMB = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  showPreview = true,
  className = ''
}: ImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: null
  });
  
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset des messages après 3 secondes
  const resetMessages = useCallback(() => {
    setTimeout(() => {
      setUploadState(prev => ({ ...prev, error: null, success: null }));
    }, 3000);
  }, []);

  // Gestion de l'upload
  const handleFileUpload = async (file: File) => {
    if (disabled) return;

    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      success: null
    });

    try {
      // Validation de base
      if (!acceptedFormats.includes(file.type)) {
        throw new Error(`Format non supporté. Utilisez: ${acceptedFormats.join(', ')}`);
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Fichier trop volumineux. Maximum: ${maxSizeMB}MB`);
      }

      // Générer un aperçu
      if (showPreview) {
        const preview = await imageUploadService.generatePreview(file);
        setPreviewUrl(preview);
      }

      // Upload vers Cloudinary
      const imageData = await imageUploadService.uploadImage(file);

      // Succès
      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        success: 'Image uploadée avec succès!'
      });

      // Mettre à jour l'URL de prévisualisation avec l'URL Cloudinary
      setPreviewUrl(imageData.imageUrl);
      
      // Notifier le parent
      onImageUpload(imageData);
      
      resetMessages();
    } catch (error: any) {
      console.error('Erreur upload:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.message || 'Erreur lors de l\'upload',
        success: null
      });
      
      // Réinitialiser l'aperçu en cas d'erreur
      setPreviewUrl(currentImageUrl || null);
      
      resetMessages();
    }
  };

  // Supprimer l'image
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (onImageRemove) {
      onImageRemove();
    }
    // Reset du file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag & Drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  // Click handler pour ouvrir le file picker
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Zone d'upload */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary hover:bg-primary/5'}
          ${uploadState.isUploading ? 'pointer-events-none' : ''}
        `}
        onClick={handleClick}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          className="hidden"
          disabled={disabled}
        />

        {/* Contenu de la zone d'upload */}
        {uploadState.isUploading ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-gray-600">Upload en cours...</p>
            {uploadState.progress > 0 && (
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            )}
          </div>
        ) : previewUrl && showPreview ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Aperçu"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              dragActive ? 'bg-primary/20' : 'bg-gray-100'
            }`}>
              {dragActive ? (
                <Upload className="w-6 h-6 text-primary" />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-medium text-primary">Cliquez ici</span> ou glissez-déposez
              </p>
              <p className="text-sm text-gray-500">
                {acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')} - Max {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Messages d'erreur et de succès */}
      {uploadState.error && (
        <div className="mt-3 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md animate-fadeIn">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800 text-sm">{uploadState.error}</p>
          </div>
        </div>
      )}

      {uploadState.success && (
        <div className="mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md animate-fadeIn">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-800 text-sm">{uploadState.success}</p>
          </div>
        </div>
      )}

      {/* CSS pour l'animation */}
      <style >{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
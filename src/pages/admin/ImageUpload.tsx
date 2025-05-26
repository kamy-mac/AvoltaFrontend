import React, { useState, useRef } from 'react';
import { Upload, X, Link2, Image as ImageIcon, Loader2, Check, AlertTriangle } from 'lucide-react';
import imageUploadService from '../../services/imageUpload.service';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
}

type UploadMode = 'file' | 'url';

export default function ImageUpload({ onImageSelect, currentImage, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<UploadMode>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      setSuccess(null);
      setUploadProgress(0);

      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        // Essayer d'abord Cloudinary
        const result = await imageUploadService.uploadImage(file);
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setPreviewUrl(result.imageUrl);
        onImageSelect(result.imageUrl);
        setSuccess('Image uploadée avec succès via Cloudinary!');
      } catch (cloudinaryError) {
        console.warn('Cloudinary upload failed, trying classic upload:', cloudinaryError);
        
        // Fallback vers l'upload classique
        const result = await imageUploadService.uploadImageClassic(file);
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setPreviewUrl(result.imageUrl);
        onImageSelect(result.imageUrl);
        setSuccess('Image uploadée avec succès!');
      }
      
      setTimeout(() => {
        setSuccess(null);
        setUploadProgress(0);
      }, 3000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
      setUploadProgress(0);
      console.error('Erreur upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!imageUrl.trim()) {
      setError('Veuillez entrer une URL d\'image');
      return;
    }

    if (!imageUploadService.validateImageUrl(imageUrl)) {
      setError('URL d\'image invalide');
      return;
    }

    setPreviewUrl(imageUrl);
    onImageSelect(imageUrl);
    setSuccess('Image ajoutée avec succès!');
    
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    } else {
      setError('Veuillez déposer un fichier image valide');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setImageUrl('');
    onImageSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setMode('file')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'file'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload fichier
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'url'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Link2 className="w-4 h-4 mr-2" />
          URL image
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
          <Check className="w-4 h-4 mr-2 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* File Upload Mode */}
      {mode === 'file' && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? 'border-[#6A0DAD] bg-purple-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          
          <div className="text-center">
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="mx-auto h-12 w-12 text-[#6A0DAD] animate-spin" />
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#6A0DAD] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">Upload en cours... {uploadProgress}%</p>
              </div>
            ) : (
              <div className="space-y-4">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Glissez votre image ici
                  </p>
                  <p className="text-sm text-gray-500">
                    ou <span className="text-[#6A0DAD] hover:underline">cliquez pour parcourir</span>
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF jusqu'à 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* URL Mode */}
      {mode === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'image
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemple.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#6A0DAD] text-white py-2 px-4 rounded-md hover:bg-[#5a0b91] transition-colors"
          >
            Ajouter l'image
          </button>
        </form>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Aperçu"
            className="w-full h-48 object-cover rounded-md border"
            onError={() => {
              setError('Impossible de charger l\'image');
              setPreviewUrl(null);
            }}
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Calendar, Heart, MessageCircle, Share2, Tag, User } from 'lucide-react';
import publicationService from '../../services/publication.service';
import { Post } from '../../types';
import { LazyImage } from '../../utils/lazyLoad';

interface NewsCardProps {
  post: Post;
}

export default function NewsCard({ post }: NewsCardProps) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher la navigation
    e.stopPropagation();
    try {
      if (!isLiked) {
        await publicationService.likePublication(post.id);
        setLikes(likes + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du like :', error);
    }
  };

  const handlePostClick = () => {
    // Navigation simulée vers les détails de la publication
    window.location.href = `/news/${post.id}`;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher la navigation
    e.stopPropagation(); // Empêcher la propagation de l'événement
    const shareUrl = `${window.location.origin}/news/${post.id}`;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Lien copié dans le presse-papiers');
      })
      .catch(err => {
        console.error('Erreur de copie du lien :', err);
        alert('Impossible de copier le lien');
      });
  };

  return (
    <div 
      onClick={handlePostClick}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative">
        
        {post.imageUrl ? (
          <LazyImage
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover object-center"
            aspectRatio="16/9"
            onError={(e) => {
              console.error("Erreur de chargement d'image:", post.imageUrl);
              e.currentTarget.src = '../../../../public/images/FA_AVOLTA_NAV_CORE_RGB.jpg'; // Une image par défaut
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            Pas d'image
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-[#6A0DAD] shadow">
            <Tag className="w-4 h-4 mr-1" />
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(post.createdAt).toLocaleDateString('fr-BE')}
        </div>
        
        <h3 className="text-xl font-display font-semibold mb-3 text-gray-900 line-clamp-2 hover:text-[#6A0DAD] transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2 font-sans">{post.content}</p>
        
        <div className="flex items-center justify-between text-gray-500 pt-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-1" />
              {/* Utilisation du nom d'affichage ou de l'email */}
              {/* @ts-ignore */}
              {post.authorDisplayName || post.author?.email || 'Auteur inconnu'}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className={`flex items-center hover:text-[#6A0DAD] transition-colors ${
                isLiked ? 'text-[#6A0DAD]' : ''
              }`}
            >
              <Heart className="w-5 h-5 mr-1" />
              {likes}
            </button>
            <div className="flex items-center hover:text-[#6A0DAD] transition-colors">
              <MessageCircle className="w-5 h-5 mr-1" />
              {post.comments?.length || 0}
            </div>
            <button 
              onClick={handleShare}
              className="flex items-center hover:text-[#6A0DAD] transition-colors"
            >
              <Share2 className="w-5 h-5 mr-1" />
              Partager
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
}
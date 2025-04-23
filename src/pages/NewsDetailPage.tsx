import React, { useState, useEffect, useRef, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Send,
  Tag,
  User,
  Mail,
  Clock,
  Eye,
  BookmarkPlus,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle,
} from "lucide-react";
// Removed unused useTranslation import
import { Post, Comment } from "../types";
import publicationService from "../services/publication.service";
import commentService from "../services/comment.service";

// Composant mémorisé pour les commentaires individuels
const CommentItem = memo(({ comment }: { comment: Comment }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#6A0DAD] rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-medium text-gray-900">
            {comment.author}
          </span>
          <div className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString("fr-BE", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })}
          </div>
        </div>
      </div>
      <button className="text-gray-400 hover:text-[#6A0DAD]">
        <Heart className="w-5 h-5" />
      </button>
    </div>
    <p className="text-gray-700">{comment.content}</p>
  </div>
));

// Composant de chargement optimisé
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      <p className="mt-4 text-gray-600">Chargement...</p>
    </div>
  </div>
);

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const shareOptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        // Appeler directement getPublicationById pour récupérer une publication spécifique
        const response = await publicationService.getPublicationById(id);
        console.log("API response:", response);
        
        // Si response existe et a une propriété data
        if (response && response.data) {
          // La réponse de l'API est l'objet de publication directement
          // Vérifier si response.data a un champ id (c'est une publication)
          if (response.data.id) {
            console.log("Publication trouvée:", response.data);
            setPost(response.data);
          } 
          // Si response.data a un champ data (format ApiResponse)
          else if (response.data.data && response.data.data.id) {
            console.log("Publication trouvée (format ApiResponse):", response.data.data);
            setPost(response.data.data);
          }
          // Format non reconnu
          else {
            console.error("Format de réponse inattendu:", response.data);
            navigate("/news");
          }
        } else {
          console.error("Réponse vide ou non valide:", response);
          navigate("/news");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/news");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();

    // Fermer les options de partage si on clique ailleurs
    const handleClickOutside = (event: MouseEvent) => {
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [id, navigate]);

  const handleLike = async () => {
    if (!post || isLiked) return;
    try {
      await publicationService.likePublication(post.id);
      setPost((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
      setIsLiked(true);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !comment.trim()) return;
    try {
      const newComment = await commentService.createComment(post.id, comment);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, newComment],
            }
          : null
      );
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(console.error);
  };

  const handleFocusComment = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Publication non trouvée
          </h2>
          <p className="text-gray-600 mb-6">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => navigate("/news")}
            className="px-6 py-3 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#5a0b91] transition-colors"
          >
            Retourner aux actualités
          </button>
        </div>
      </div>
    );
  }

  // Formater les paragraphes du contenu de manière plus efficace
  const contentParagraphs = post.content.split('\n');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-[#6A0DAD] mb-8 group bg-white px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Retour aux actualités
        </button>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image avec meilleure qualité */}
          <div className="relative h-80 sm:h-96">
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover object-center brightness-105 contrast-105"
                loading="eager"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-6 right-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white text-[#6A0DAD] shadow-sm">
                <Tag className="w-4 h-4 mr-2" />
                {post.category}
              </span>
            </div>

            {/* Info overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-white/90 text-sm gap-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.createdAt).toLocaleDateString("fr-BE")}
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {post.comments.length} commentaire{post.comments.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Author Info */}
            <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-[#6A0DAD] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {post.authorName}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Mail className="w-4 h-4 mr-1" />
                    {post.authorEmail}
                  </div>
                </div>
              </div>
              
              {/* Save & Share buttons - simplifiés */}
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full text-gray-600 hover:text-[#6A0DAD] hover:bg-purple-50 transition-all border border-gray-200">
                  <BookmarkPlus className="w-5 h-5" />
                </button>
                <div className="relative" ref={shareOptionsRef}>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full text-gray-600 hover:text-[#6A0DAD] hover:bg-purple-50 transition-all border border-gray-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  
                  {/* Share options dropdown */}
                  {showShareOptions && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-md bg-white ring-1 ring-black/5 z-10 py-1">
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} 
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Facebook className="w-4 h-4 mr-3 text-blue-600" />
                        Facebook
                      </a>
                      <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`} 
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Twitter className="w-4 h-4 mr-3 text-blue-400" />
                        Twitter
                      </a>
                      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} 
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Linkedin className="w-4 h-4 mr-3 text-blue-700" />
                        LinkedIn
                      </a>
                      <button 
                        onClick={handleCopyLink}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                            <span className="text-green-500">Lien copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-3 text-gray-500" />
                            Copier le lien
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-8 text-gray-700 leading-relaxed">
              {contentParagraphs.map((paragraph, index) => (
                paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : null
              ))}
            </div>

            {/* Validity Dates */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#6A0DAD]" />
                <span>
                  Valide du{" "}
                  <strong>{new Date(post.validFrom).toLocaleDateString("fr-BE")}</strong>
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#6A0DAD]" />
                <span>
                  au <strong>{new Date(post.validTo).toLocaleDateString("fr-BE")}</strong>
                </span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex flex-wrap items-center justify-between border-t border-gray-200 pt-6">
              <button
                onClick={handleLike}
                className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                  isLiked
                    ? "text-[#6A0DAD] bg-purple-50"
                    : "text-gray-500 hover:text-[#6A0DAD] hover:bg-purple-50"
                } border border-gray-200`}
              >
                <Heart
                  className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`}
                />
                <span>{post.likes} J'aime{post.likes !== 1 ? "s" : ""}</span>
              </button>
              
              <button 
                onClick={handleFocusComment}
                className="flex items-center px-4 py-2 rounded-full text-gray-500 hover:text-[#6A0DAD] hover:bg-purple-50 transition-colors border border-gray-200">
                <MessageCircle className="w-5 h-5 mr-2" />
                <span>Commenter</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-50 px-6 sm:px-8 py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-[#6A0DAD]" />
              Commentaires ({post.comments.length})
            </h2>

            <form onSubmit={handleComment} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-[#6A0DAD] focus:ring-1 focus:ring-[#6A0DAD]"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Commenter
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {post.comments.map((comment: Comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}

              {post.comments.length === 0 && (
                <div className="text-center bg-white rounded-lg py-8 px-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun commentaire</h3>
                  <p className="text-gray-500 mb-4">
                    Soyez le premier à partager votre avis sur cet article !
                  </p>
                  <button
                    onClick={handleFocusComment}
                    className="px-5 py-2 bg-[#6A0DAD]/10 text-[#6A0DAD] rounded-lg hover:bg-[#6A0DAD]/20 transition-colors"
                  >
                    Ajouter un commentaire
                  </button>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
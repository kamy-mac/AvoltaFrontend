import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';

import publicationService from '../../services/publication.service';
import { Post } from '../../types';
import NewsCard from '../news/NewsCard';

export default function NewsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const postsPerPage = 6;

  // Chargement des publications
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        // Récupérer toutes les publications actives de la catégorie news
        const fetchedPosts = await publicationService.getActivePublicationsByCategory('news');
        
        // Trier les publications par date (du plus récent au plus ancien)
        const sortedPosts = fetchedPosts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setPosts(sortedPosts);
        setTotalPages(Math.ceil(sortedPosts.length / postsPerPage));
      } catch (err) {
        console.error('Error fetching news publications:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();

    // Observer pour détecter quand la section devient visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('news-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Navigation vers la page de toutes les actualités
  const handleNewsClick = () => {
    window.location.href = "/news";
  };

  // Réessayer le chargement en cas d'erreur
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    publicationService.getActivePublicationsByCategory('news')
      .then(fetchedPosts => {
        const sortedPosts = fetchedPosts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
        setTotalPages(Math.ceil(sortedPosts.length / postsPerPage));
      })
      .catch(err => {
        console.error('Error retrying fetch:', err);
        setError('Failed to load news. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Navigation vers la page précédente du carousel
  const goToPrevPage = useCallback(() => {
    if (currentPage > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 500); // Attendre la fin de la transition
    }
  }, [currentPage, isTransitioning]);

  // Navigation vers la page suivante du carousel
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentPage(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 500); // Attendre la fin de la transition
    }
  }, [currentPage, totalPages, isTransitioning]);

  // Gestion des événements tactiles pour le swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const diffX = touchStartX.current - touchEndX.current;
    const threshold = 50; // Seuil minimum pour considérer un swipe
    
    if (diffX > threshold) {
      // Swipe vers la gauche -> page suivante
      goToNextPage();
    } else if (diffX < -threshold) {
      // Swipe vers la droite -> page précédente
      goToPrevPage();
    }
    
    // Réinitialiser les valeurs
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Obtenir les publications pour la page actuelle
  const getCurrentPagePosts = () => {
    const startIndex = currentPage * postsPerPage;
    return posts.slice(startIndex, startIndex + postsPerPage);
  };

  // Affichage conditionnel du contenu
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index}
              className="bg-white shadow-md rounded-xl overflow-hidden"
            >
              <div className="bg-gray-200 animate-pulse h-48 w-full"></div>
              <div className="p-6">
                <div className="h-4 w-1/3 bg-gray-200 animate-pulse mb-4 rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse mb-4 rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse mb-4 w-3/4 rounded"></div>
                <div className="h-5 w-1/4 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-100 text-red-700 p-8 rounded-xl text-center max-w-lg mx-auto">
          <div className="font-semibold mb-2">Une erreur est survenue</div>
          <p>{error}</p>
          <button 
            onClick={handleRetry} 
            className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-700 flex items-center justify-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </button>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="bg-blue-50 border border-blue-100 text-blue-700 p-8 rounded-xl text-center max-w-lg mx-auto">
          <div className="font-semibold mb-2">Information</div>
          <p>Aucune actualité disponible pour le moment</p>
        </div>
      );
    }

    const currentPosts = getCurrentPagePosts();

    return (
      <div className="space-y-8">
        <div 
          ref={carouselRef}
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-transform duration-500 ease-in-out`}
            style={{ transform: `translateX(0)` }}
          >
            {currentPosts.map((post, index) => (
              <div
                key={post.id}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`transform transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } ${isTransitioning ? 'scale-95 opacity-75' : 'scale-100 opacity-100'}`}
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
                  <NewsCard post={post} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-10">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-full ${
                currentPage === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              } transition-colors`}
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage + 1}</span> sur <span className="font-medium">{totalPages}</span>
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-full ${
                currentPage === totalPages - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              } transition-colors`}
              aria-label="Page suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="news-section" className="py-10 bg-gradient-to-br from-sand to-sand/80 relative overflow-hidden">
      {/* Éléments décoratifs améliorés */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/3 -translate-y-1/3 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2" />
      <div className="absolute bottom-40 left-20 w-48 h-48 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute top-60 right-10 w-48 h-48 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-primary/15 rounded-full blur-lg" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-1 bg-primary rounded-full mr-4" />
                <span className="text-primary font-medium uppercase tracking-wider text-sm">Actualités</span>
              </div>
              <h2 className="style-raffine text-night text-3xl md:text-4xl font-bold">Restez informé</h2>
              <p className="text-night/70 mt-3 max-w-xl">Découvrez les dernières actualités et tendances du secteur</p>
            </div>
            <button
              onClick={handleNewsClick}
              className="group flex items-center px-6 py-2 bg-night text-day rounded-full hover:bg-primary transition-all duration-300 shadow-md hover:shadow-lg self-start md:self-auto"
            >
              <span className="mr-2">Toutes les actualités</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {renderContent()}
        </div>
      </div>
    </section>
  );
}
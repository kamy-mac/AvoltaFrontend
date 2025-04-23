import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Info, 
  Calendar, 
  Mail, 
  Phone, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Users, 
  Check,
  ChevronDown
} from 'lucide-react';

// Typage de l'établissement
interface Establishment {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  description: string;
}

// Typage du formulaire
interface ReservationFormData {
  fullName: string;
  email: string;
  phone: string;
  establishmentId: string;
  date: string;
  time: string;
  guests: number;
  message: string;
}

export default function VideoSection() {
  // États pour la vidéo
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // États pour la réservation
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState<ReservationFormData>({
    fullName: '',
    email: '',
    phone: '',
    establishmentId: '',
    date: new Date().toISOString().split('T')[0], // Date du jour par défaut
    time: '12:00',
    guests: 2,
    message: ''
  });
  
  // Références
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reservationSectionRef = useRef<HTMLDivElement>(null);

  // Observer pour l'animation à l'entrée
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fonctions de contrôle vidéo mémorisées
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error(`Erreur de lecture vidéo: ${err.message}`);
          // Montrer un message à l'utilisateur
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!videoContainerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    } catch (err) {
      console.error(`Erreur lors du passage en plein écran: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  // Mettre à jour l'état du plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Pause automatique de la vidéo lorsqu'elle n'est plus visible
  useEffect(() => {
    if (!videoRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!isPlaying && videoRef.current) {
            videoRef.current.play().catch(err => console.error(err));
            setIsPlaying(true);
          }
        } else {
          if (isPlaying && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.2 }
    );
    
    observer.observe(videoRef.current);
    
    return () => observer.disconnect();
  }, [isPlaying]);

  // Gestion de la soumission du formulaire de réservation
  const handleReservationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('idle');
    
    try {
      // Simule un appel API asynchrone
      setFormStatus('idle');
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validation des données (exemple simple)
      if (!formData.fullName || !formData.email || !formData.establishmentId) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      
      console.log('Données de réservation:', formData);
      
      // Simuler une réponse positive
      setFormStatus('success');
      
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setFormStatus('idle');
        setIsFormVisible(false);
        setFormData({
          ...formData,
          message: ''
        });
      }, 8000);
    } catch (error) {
      console.error('Erreur de réservation: veillez contacté directement notre FINE DINING pour faire votre réservation', error);
      setFormStatus('error');
    }
  };

  // Gestion des modifications du formulaire
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Coordonnées de contact d'Avolta
  const contactInfo = {
    email: "reception-airport@autogrill.net",
    phone: "+32 499706836",
    address: "Brussels Airport, Zaventem, Belgium"
  };

  // Liste des établissements
  const establishments: Establishment[] = [
    {
      id: 1,
      name: "Le Belle & Belge",
      location: "Zone publique - Halle de départ, Brussels Airport",
      imageUrl: "https://mindtrip.ai/cdn-cgi/image/w=640,format=webp,h=409,fit=cover/https://media-cdn.tripadvisor.com/media/photo-o/0c/fb/47/69/b-b2.jpg",
      description: "Cuisine Belge raffinée dans un cadre élégant et confortable avec une vue imprénable."
    },
    {
      id: 2,
      name: "Le Amo",
      location: "Terminal A, Brussels Airport",
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/b3/95/8c/caption.jpg?w=900&h=500&s=1",
      description: "Authentiques saveurs italiennes et cafés de spécialité pour une pause délicieuse."
    },
    {
      id: 3,
      name: "Le Black Pearls",
      location: "Terminal A, Brussels Airport",
      imageUrl: "https://media.brusselsairport.be/bruweb/featured_item/0001/39/thumb_38184_featured_item_default.png",
      description: "Découvrez notre sélection de soupe de poisson, des moules belges, un risotto crémeux, et accompagnez le tout d'un vin raffiné."
    }
  ];

  // Effet pour animer l'apparition de la section de réservation
  useEffect(() => {
    const reservationObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          reservationSectionRef.current?.classList.add('animate-fadeIn');
          reservationObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (reservationSectionRef.current) {
      reservationObserver.observe(reservationSectionRef.current);
    }

    return () => reservationObserver.disconnect();
  }, []);

  // Fonctions d'accessibilité pour les raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ne pas interférer avec les champs de formulaire
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement || 
          e.target instanceof HTMLSelectElement) {
        return;
      }

      if (e.code === 'Space' && document.activeElement !== videoRef.current) {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay, toggleMute, toggleFullscreen]);

  // Récupérer l'établissement actuel sélectionné
  const selectedEstablishment = establishments.find(
    e => e.id.toString() === formData.establishmentId
  );

  return (
    <section 
      ref={sectionRef}
      className="py-10 lg:py-10 bg-gradient-to-b from-sand to-white relative overflow-hidden"
      aria-label="Section vidéo et réservation"
    >
      {/* Éléments décoratifs pour le haut de la section */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" aria-hidden="true"></div>
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-primary/30 rounded-full blur-sm" aria-hidden="true"></div>
      <div className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-primary/20 rounded-full blur-sm" aria-hidden="true"></div>
      
      <div className="absolute top-80 right-20 w-36 h-32 bg-primary/10 rounded-full blur-xl" aria-hidden="true" />
      <div className="absolute bottom-40 left-20 w-48 h-48 bg-primary/10 rounded-full blur-xl" aria-hidden="true" />
  
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* En-tête de section avec animation améliorée */}
        <div 
          className={`text-center mb-16 transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center justify-center px-12 py-2 mb-6 bg-primary/10 rounded-full">
            <span className="text-primary font-medium text-sm">Notre vision</span>
          </div>
          <div className="flex items-center justify-center mb-1"></div>
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold text-night mb-8 relative inline-block">
            Découvrez Avolta Belgique
            <div className="absolute -bottom-5 right-1 transform -translate-x-1 w-60 h-1 bg-primary rounded-full"></div>
          </h2>
          
          <p className="text-night/60 max-w-3xl mx-auto text-lg mt-3">
            Plongez dans l'univers d'Avolta et découvrez comment nous façonnons l'avenir 
            des aéroports avec des solutions innovantes et une expertise inégalée.
          </p>
        </div>

        {/* Container pour la vidéo en pleine largeur */}
        <div 
          className={`w-full transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-10'
          }`}
        >
          <div 
            ref={videoContainerRef}
            className="relative aspect-video rounded-3xl overflow-hidden shadow-xl group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            
            {/* Vidéo avec optimisations */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-2xl"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              aria-label="Vidéo de présentation d'Avolta Belgique"
              onCanPlay={(e) => {
                const video = e.target as HTMLVideoElement;
                video.muted = true;
              }}
            >
              <source src="https://www.avoltaworld.com/sites/default/files/2023-10/Hero-video-with-centred-text_compressed.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            
            {/* Léger overlay pour améliorer la visibilité des contrôles */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-night/50 via-night/20 to-transparent pointer-events-none"
              aria-hidden="true"
            ></div>
            
            {/* Contrôles vidéo avec accessibilité améliorée */}
            <div 
              className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-between bg-night/40 backdrop-blur-md rounded-full px-6 py-3 transition-all duration-500 w-auto min-w-[280px] sm:min-w-[340px] ${
                isHovered || !isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              role="group"
              aria-label="Contrôles vidéo"
            >
              <button 
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors text-white"
                aria-label={isPlaying ? "Mettre en pause" : "Lire"}
                title={isPlaying ? "Mettre en pause (Espace)" : "Lire (Espace)"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <div className="hidden sm:block text-white text-sm font-medium mx-3">
                Avolta Belgique
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors text-white"
                  aria-label={isMuted ? "Activer le son" : "Couper le son"}
                  title={isMuted ? "Activer le son (M)" : "Couper le son (M)"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors text-white"
                  aria-label="Plein écran"
                  title="Plein écran (F)"
                >
                  <Maximize className="w-5 h-5" />
                </button>
                
                <button
                  className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-colors text-white"
                  aria-label="Informations"
                  title="Informations sur la vidéo"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Badge de qualité */}
            <div 
              className="absolute top-6 right-6 px-4 py-2 bg-night/40 backdrop-blur-md rounded-full text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              aria-hidden="true"
            >
              HD
            </div>
          </div>
        
          {/* Crédits vidéo */}
          <div className="text-center mt-4 text-night/40 text-sm">
            © 2023 Avolta World - Tous droits réservés
          </div>
          
        </div>
        
      </div>

      {/* Section de réservation intégrée avec amélioration d'accessibilité */}
      <div
        ref={reservationSectionRef}
        className="py-16 mt-16 opacity-0 translate-y-10 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden"
        aria-labelledby="reservation-heading"
      >
        {/* Éléments décoratifs pour la section réservation */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" aria-hidden="true"></div>
        
        <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white/10 rounded-full blur-md" aria-hidden="true"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-md" aria-hidden="true"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start">
            {/* Contenu texte */}
            <div className="w-full lg:w-2/5 pr-0 lg:pr-8 mb-12 lg:mb-0">
              <h2 id="reservation-heading" className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                Réservez votre expérience gastronomique
              </h2>
              <div className="text-white text-opacity-90 mb-8">
                <p>
                  Transformez votre attente à l'aéroport en une expérience mémorable dans l'un de nos 
                  établissements. Profitez d'un moment de détente et de plaisir culinaire avant votre vol, 
                  avec une vue imprenable sur les pistes et un service d'excellence.
                </p>
                <p className="mt-4">
                  Nos restaurants et cafés proposent une cuisine de qualité, des produits locaux et 
                  une ambiance chaleureuse qui feront de ce moment une partie intégrante de votre voyage.
                </p>
              </div>
              
              <div className="space-y-4 text-white mb-8">
                <a href={`mailto:${contactInfo.email}`} className="flex items-center hover:underline">
                  <Mail className="w-5 h-5 text-white mr-3" />
                  <span>{contactInfo.email}</span>
                </a>
                <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="flex items-center hover:underline">
                  <Phone className="w-5 h-5 text-white mr-3" />
                  <span>{contactInfo.phone}</span>
                </a>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-white mr-3" />
                  <span>{contactInfo.address}</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="inline-flex items-center px-6 py-3 border border-white rounded-full text-sm font-medium text-white bg-transparent hover:bg-white hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-expanded={isFormVisible}
                aria-controls="reservation-form-container"
              >
                {isFormVisible ? "Voir nos établissements" : "Faire une réservation"}
                <ArrowRight className={`ml-2 w-5 h-5 transition-transform duration-300 ${isFormVisible ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {/* Contenu droit - Formulaire ou établissements */}
            <div className="w-full lg:w-3/5" id="reservation-form-container">
              {isFormVisible ? (
                <div className="bg-white rounded-xl p-6 shadow-xl transform transition-all duration-500 animate-fadeIn">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Demande de réservation</h3>
                  
                  {formStatus === 'success' && (
                    <div role="alert" className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Votre demande a été envoyée ! Nous vous contacterons pour confirmer votre réservation.</span>
                    </div>
                  )}
                  
                  {formStatus === 'error' && (
                    <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                      <span>Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.</span>
                    </div>
                  )}
                  
                  <form onSubmit={handleReservationRequest} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="establishmentId" className="block text-sm font-medium text-gray-700 mb-1">
                          Établissement <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="establishmentId"
                            name="establishmentId"
                            value={formData.establishmentId}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary appearance-none"
                            required
                          >
                            <option value="">Sélectionnez un établissement</option>
                            {establishments.map(est => (
                              <option key={est.id} value={est.id}>{est.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            required
                            min={new Date().toISOString().split('T')[0]}
                          />
                          <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                          Heure <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            required
                          />
                          <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de personnes <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            id="guests"
                            name="guests"
                            min="1"
                            max="20"
                            value={formData.guests}
                            onChange={handleFormChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            required
                          />
                          <Users className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message ou demandes spéciales
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      ></textarea>
                    </div>
                    
                    {selectedEstablishment && (
                      <div className="bg-gray-50 p-3 rounded-lg flex items-start mt-2 mb-2">
                        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden mr-3">
                          <img
                            src={selectedEstablishment.imageUrl}
                            alt={selectedEstablishment.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop";
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{selectedEstablishment.name}</h4>
                          <p className="text-sm text-gray-600">{selectedEstablishment.location}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end items-center">
                      <p className="text-xs text-gray-500 mr-4">
                        Les champs avec <span className="text-red-500">*</span> sont obligatoires
                      </p>
                      <button
                        type="submit"
                        disabled={formStatus === 'success'}
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {formStatus === 'idle' ? (
                          <>Envoyer la demande</>
                        ) : formStatus === 'success' ? (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Demande envoyée !
                          </>
                        ) : (
                          <>Réessayer</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Affichage des établissements en grille
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                  {establishments.map((est, index) => (
                    <div
                      key={est.id}
                      className={`rounded-lg overflow-hidden shadow-lg ${index === 2 ? 'md:col-span-2' : ''}`}
                    >
                      <div className="relative group h-60 md:h-72">
                        {/* Image avec fallback */}
                        <img
                          src={est.imageUrl}
                          alt={est.name}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop";
                          }}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"
                          aria-hidden="true"
                        ></div>
                        <div className="absolute bottom-0 left-0 p-6">
                          <h3 className="text-white text-xl font-bold mb-1">{est.name}</h3>
                          <div className="flex items-center text-white text-opacity-90 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{est.location}</span>
                          </div>
                          <p className="text-white text-opacity-80 text-sm line-clamp-2 mb-3">
                            {est.description}
                          </p>
                          <button
                            onClick={() => {
                              setIsFormVisible(true);
                              setFormData({
                                ...formData,
                                establishmentId: est.id.toString()
                              });
                            }}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary/80 hover:bg-primary rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                          >
                            Réserver une table
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS pour les animations personnalisées */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeIn {
            animation: none;
            opacity: 1;
            transform: translateY(0);
          }
          
          .transition-all,
          .transition-opacity,
          .transition-transform,
          .transition-colors {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
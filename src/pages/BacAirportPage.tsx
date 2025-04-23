/**
 * BAC Airport Page
 *
 * Enhanced page displaying exclusive content for BAC Airport personnel.
 * Features secure access control, animated transitions, personalized content,
 * and an improved user experience.
 *
 * @module pages/BacAirportPage
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Lock,
  Building2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  User,
  Search,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Download,
  FileText,
  Info
} from "lucide-react";
import { Post } from "../types";
import NewsCard from "../components/news/NewsCard";
import publicationService from "../services/publication.service";
import { LazyImage } from "../utils/lazyLoad";

// Access code for BAC personnel
const BAC_ACCESS_CODE = "bac123";

// Session timeout (in minutes)
const SESSION_TIMEOUT = 30;

// Staff directory data
const staffDirectory = [
  {
    id: "1",
    name: "Jean Dupont",
    department: "Opérations",
    position: "Directeur",
    email: "j.dupont@bac.be",
    phone: "+32 2 753 XX XX",
    location: "Terminal A, Niveau 3",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop",
  },
  {
    id: "2",
    name: "Marie Lambert",
    department: "Ressources Humaines",
    position: "Responsable",
    email: "m.lambert@bac.be",
    phone: "+32 2 753 XX XX",
    location: "Terminal B, Niveau 2",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop",
  },
  {
    id: "3",
    name: "Pierre Durand",
    department: "Sécurité",
    position: "Chef d'équipe",
    email: "p.durand@bac.be",
    phone: "+32 2 753 XX XX",
    location: "Terminal A, Niveau 1",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&fit=crop",
  },
  {
    id: "4",
    name: "Sophie Martin",
    department: "Communication",
    position: "Coordinatrice",
    email: "s.martin@bac.be",
    phone: "+32 2 753 XX XX",
    location: "Terminal B, Niveau 3",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&fit=crop",
  },
  {
    id: "5",
    name: "Thomas Leroy",
    department: "Maintenance",
    position: "Technicien",
    email: "t.leroy@bac.be",
    phone: "+32 2 753 XX XX",
    location: "Terminal A, Niveau 0",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&fit=crop",
  },
];

// Upcoming events data
const upcomingEvents = [
  {
    id: "1",
    title: "Réunion du personnel",
    date: "15 avril 2025",
    time: "14:00",
    location: "Salle de conférence principale",
    description: "Réunion trimestrielle pour tous les employés de BAC Airport.",
  },
  {
    id: "2",
    title: "Formation sécurité",
    date: "22 avril 2025",
    time: "09:30",
    location: "Terminal A, Niveau 2, Salle 12",
    description: "Formation obligatoire sur les nouvelles procédures de sécurité.",
  },
  {
    id: "3",
    title: "Team building",
    date: "30 avril 2025",
    time: "12:00 - 17:00",
    location: "Parc du Cinquantenaire",
    description: "Activités de team building pour renforcer la cohésion d'équipe.",
  },
];

// Resources data
const resources = [
  {
    id: "1",
    title: "Guide d'utilisation de l'intranet",
    type: "PDF",
    size: "2.4 MB",
    url: "#",
  },
  {
    id: "2",
    title: "Procédures de sécurité 2025",
    type: "PDF",
    size: "3.8 MB",
    url: "#",
  },
  {
    id: "3",
    title: "Manuel employé",
    type: "PDF",
    size: "5.2 MB",
    url: "#",
  },
  {
    id: "4",
    title: "Calendrier des congés",
    type: "XLSX",
    size: "1.1 MB",
    url: "#",
  },
];

// Function component for animated skeleton loader
const SkeletonLoader = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-xl shadow-lg h-96 overflow-hidden"
      >
        <div className="h-48 bg-gray-200 animate-pulse"></div>
        <div className="p-6 space-y-3">
          <div className="h-6 bg-gray-200 animate-pulse w-3/4 rounded-md"></div>
          <div className="h-4 bg-gray-200 animate-pulse w-1/2 rounded-md"></div>
          <div className="h-4 bg-gray-200 animate-pulse w-full rounded-md"></div>
          <div className="h-4 bg-gray-200 animate-pulse w-5/6 rounded-md"></div>
          <div className="mt-6 flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function BacAirportPage() {
  // State management
  const [accessCode, setAccessCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("news"); // news, directory, events, resources
  // Removed unused sessionTimer state
  const [timeRemaining, setTimeRemaining] = useState(SESSION_TIMEOUT * 60);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);
  
  // Refs
  const accessFormRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter staff by search query
  const filteredStaff = staffDirectory.filter(
    person =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Session timer management
  const startSessionTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTimeRemaining(SESSION_TIMEOUT * 60);
    const timerId = setInterval(() => {
      setTimeRemaining(prev => {
        // Show warning when 2 minutes left
        if (prev === 120) {
          setShowSessionWarning(true);
        }
        
        // Logout when timer reaches 0
        if (prev <= 1) {
          handleLogout();
          clearInterval(timerId);
          return 0;
        }
        
        return prev - 1;
      });
    }, 1000);
    
    timerRef.current = timerId;
    return timerId;
  }, []);
  
  // Reset session timer on user activity
  const resetTimer = useCallback(() => {
    if (isAuthorized) {
      setShowSessionWarning(false);
      setTimeRemaining(SESSION_TIMEOUT * 60);
    }
  }, [isAuthorized]);
  
  // Format time remaining in MM:SS format
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if user is already authorized (from localStorage)
  useEffect(() => {
    const authorized = localStorage.getItem("bac_authorized") === "true";
    setIsAuthorized(authorized);

    if (authorized) {
      loadBacPosts();
      const timerId = startSessionTimer();
      
      // Set up event listeners for user activity
      const resetTimerOnActivity = () => resetTimer();
      document.addEventListener('mousedown', resetTimerOnActivity);
      document.addEventListener('keypress', resetTimerOnActivity);
      document.addEventListener('scroll', resetTimerOnActivity);
      
      return () => {
        clearInterval(timerId);
        document.removeEventListener('mousedown', resetTimerOnActivity);
        document.removeEventListener('keypress', resetTimerOnActivity);
        document.removeEventListener('scroll', resetTimerOnActivity);
      };
    } else {
      setIsLoading(false);
    }
  }, [isAuthorized, startSessionTimer, resetTimer]);

  // Smooth scroll to top when authorized status changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAuthorized]);

  // Scroll animation when transitioning between unauthorized and authorized views
  useEffect(() => {
    if (isAuthorized) {
      contentRef.current?.classList.add('animate-fadeIn');
    } else if (accessFormRef.current) {
      accessFormRef.current.classList.add('animate-fadeIn');
    }
  }, [isAuthorized]);

  // Load BAC-specific posts
  const loadBacPosts = async () => {
    try {
      setIsLoading(true);
      // Use the publication service
      const allPosts = await publicationService.getActivePublications();

      // Filter posts for BAC content
      const bacPosts = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes("bac") ||
          post.content.toLowerCase().includes("bac") ||
          post.category === "bac"
      );

      // If no BAC posts found, use regular posts for demo
      setPosts(bacPosts.length > 0 ? bacPosts : allPosts.slice(0, 3));
    } catch (error) {
      console.error("Error loading BAC posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle access code submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (accessCode === BAC_ACCESS_CODE) {
      setIsAuthorized(true);
      setSuccess("Accès autorisé. Bienvenue dans l'espace BAC Airport!");
      
      // Save authorization in localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("bac_authorized", "true");
      }
      
      loadBacPosts();
      startSessionTimer();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } else {
      setError("Code d'accès incorrect. Veuillez réessayer.");
      // Shake the form to indicate error
      if (accessFormRef.current) {
        accessFormRef.current.classList.add('animate-shake');
        setTimeout(() => {
          accessFormRef.current?.classList.remove('animate-shake');
        }, 500);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem("bac_authorized");
    setAccessCode("");
    setActiveTab("news");
    setShowSessionWarning(false);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Toggle event details
  const toggleEvent = (eventId: string) => {
    setSelectedEvent(selectedEvent === eventId ? null : eventId);
  };

  // Extend session
  const extendSession = () => {
    resetTimer();
    setShowSessionWarning(false);
  };

  // Handle person expansion in directory
  const togglePersonExpansion = (personId: string) => {
    setExpandedPerson(expandedPerson === personId ? null : personId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      {/* Session timeout warning */}
      {showSessionWarning && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 z-50 w-80 border-l-4 border-yellow-500 animate-slideIn">
          <div className="flex items-start space-x-4">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Expiration de session</h4>
              <p className="text-sm text-gray-600 mb-3">Votre session expire dans {formatTimeRemaining()}</p>
              <button 
                onClick={extendSession}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors text-sm"
              >
                Prolonger la session
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Espace BAC Airport
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Contenu exclusif pour le personnel de Brussels Airport
              </p>
            </div>
          </div>

          {isAuthorized && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>Session: {formatTimeRemaining()}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-gray-700 shadow-sm flex items-center transition-colors"
              >
                <Lock className="w-4 h-4 mr-2 text-primary" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>

        {/* Access Form */}
        {!isAuthorized ? (
          <div 
            ref={accessFormRef}
            className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-auto border border-gray-100 transition-all duration-500"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Accès Réservé
              </h2>
              <p className="text-gray-600 max-w-xs mx-auto">
                Cet espace est exclusivement réservé au personnel de Brussels Airport Company.
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md flex items-start animate-fadeIn">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="accessCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Code d'accès
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="Entrez le code d'accès"
                    required
                    aria-describedby="password-hint"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p id="password-hint" className="mt-1 text-xs text-gray-500">
                  Indice: Pour cette démo, le code est "bac123"
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi sur cet appareil
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                aria-label="Accéder à l'espace BAC"
              >
                <Shield className="w-5 h-5 mr-2" />
                <span>Accéder</span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Info className="w-4 h-4 mr-1 text-gray-400" />
                  <span>Besoin d'aide?</span>
                </div>
                <a href="mailto:support@bac.be" className="text-primary hover:text-primary-dark">
                  Contactez le support
                </a>
              </div>
            </div>
          </div>
        ) : (
          // BAC Content (visible after authentication)
          <div 
            ref={contentRef}
            className="transition-all duration-500"
          >
            {/* Welcome Banner */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Bienvenue dans l'espace BAC Airport
                  </h2>
                  <p className="text-gray-600 max-w-2xl">
                    Accédez à des informations exclusives, des ressources et des actualités dédiées au personnel 
                    de Brussels Airport Company. Cet espace est régulièrement mis à jour avec du contenu pertinent.
                  </p>
                </div>
                <div className="shrink-0 bg-primary/10 rounded-xl p-4 flex items-center space-x-3">
                  <Calendar className="w-10 h-10 text-primary" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Aujourd'hui</div>
                    <div className="font-semibold">{new Date().toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-md mb-8 p-2 border border-gray-100">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab("news")}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "news"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Tag className="w-5 h-5 mr-2" />
                  <span>Actualités</span>
                </button>
                <button
                  onClick={() => setActiveTab("events")}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "events"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Événements</span>
                </button>
                <button
                  onClick={() => setActiveTab("directory")}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "directory"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <User className="w-5 h-5 mr-2" />
                  <span>Annuaire</span>
                </button>
                <button
                  onClick={() => setActiveTab("resources")}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "resources"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  <span>Ressources</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fadeIn">
              {/* News Tab */}
              {activeTab === "news" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Tag className="w-6 h-6 mr-2 text-primary" />
                    Actualités BAC
                  </h2>

                  {isLoading ? (
                    <SkeletonLoader />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {posts.map((post) => (
                        <NewsCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}

                  {posts.length === 0 && !isLoading && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Tag className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Aucune actualité disponible
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Il n'y a pas d'actualités spécifiques à BAC Airport pour le moment. 
                        Veuillez vérifier ultérieurement.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Calendar className="w-6 h-6 mr-2 text-primary" />
                    Événements à venir
                  </h2>

                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg"
                      >
                        <div 
                          className="p-6 cursor-pointer"
                          onClick={() => toggleEvent(event.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="bg-primary/10 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>{event.date} à {event.time}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              className="text-gray-400 hover:text-primary"
                              aria-label="Toggle event details"
                            >
                              {selectedEvent === event.id ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          
                          {selectedEvent === event.id && (
                            <div className="mt-4 pt-4 border-t border-gray-100 text-gray-600 animate-fadeIn">
                              <p>{event.description}</p>
                              <div className="mt-4 flex space-x-4">
                                <button className="flex items-center text-sm text-primary">
                                  <Bookmark className="w-4 h-4 mr-1" />
                                  <span>Ajouter au calendrier</span>
                                </button>
                                <button className="flex items-center text-sm text-primary">
                                  <Mail className="w-4 h-4 mr-1" />
                                  <span>Confirmer ma présence</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Directory Tab */}
              {activeTab === "directory" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="w-6 h-6 mr-2 text-primary" />
                    Annuaire du Personnel
                  </h2>

                  <div className="mb-6 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher par nom, département ou poste..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>

                  <div className="space-y-4">
                    {filteredStaff.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <p className="text-gray-600">Aucun résultat ne correspond à votre recherche.</p>
                      </div>
                    ) : (
                      filteredStaff.map((person) => (
                        <div 
                          key={person.id} 
                          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg"
                        >
                          <div className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                              <div className="flex items-center space-x-4">
                                <LazyImage
                                  src={person.imageUrl}
                                  alt={person.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                  placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-900">{person.name}</h3>
                                  <p className="text-primary font-medium">{person.position}</p>
                                  <p className="text-sm text-gray-500">{person.department}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <a 
                                  href={`mailto:${person.email}`}
                                  className="p-2 bg-gray-100 hover:bg-primary/10 rounded-full text-gray-600 hover:text-primary transition-colors"
                                  aria-label={`Envoyer un email à ${person.name}`}
                                >
                                  <Mail className="w-5 h-5" />
                                </a>
                                <a 
                                  href={`tel:${person.phone}`}
                                  className="p-2 bg-gray-100 hover:bg-primary/10 rounded-full text-gray-600 hover:text-primary transition-colors"
                                  aria-label={`Appeler ${person.name}`}
                                >
                                  <Phone className="w-5 h-5" />
                                </a>
                                <button
                                  onClick={() => togglePersonExpansion(person.id)}
                                  className="p-2 bg-gray-100 hover:bg-primary/10 rounded-full text-gray-600 hover:text-primary transition-colors"
                                  aria-label="Voir plus d'informations"
                                  aria-expanded={expandedPerson === person.id}
                                >
                                  {expandedPerson === person.id ? (
                                    <ChevronUp className="w-5 h-5" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            {expandedPerson === person.id && (
                              <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="flex items-start">
                                    <Mail className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                                    <div>
                                      <p className="text-xs text-gray-500">Email</p>
                                      <p className="text-gray-900">{person.email}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <Phone className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                                    <div>
                                      <p className="text-xs text-gray-500">Téléphone</p>
                                      <p className="text-gray-900">{person.phone}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start sm:col-span-2">
                                    <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                                    <div>
                                      <p className="text-xs text-gray-500">Emplacement</p>
                                      <p className="text-gray-900">{person.location}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Resources Tab */}
              {activeTab === "resources" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-primary" />
                    Ressources
                  </h2>

                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <ul className="divide-y divide-gray-200">
                      {resources.map((resource) => (
                        <li key={resource.id}>
                          <a 
                            href={resource.url}
                            className="block hover:bg-gray-50 transition-colors"
                          >
                            <div className="px-6 py-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                                  <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{resource.title}</p>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs mr-2">{resource.type}</span>
                                    <span>{resource.size}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4">
                                <button className="p-2 hover:bg-primary/10 rounded-full text-gray-500 hover:text-primary transition-colors">
                                  <Download className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 bg-primary/5 rounded-xl p-6 flex items-start space-x-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <ExternalLink className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Autres ressources</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Accédez à d'autres ressources et outils sur l'intranet BAC
                      </p>
                      <a
                        href="https://intranet.bac.be"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
                      >
                        <span>Visiter l'intranet</span>
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSS Keyframes for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }

        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Eye,
  Calendar,
  Search,
  Edit2,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  Info,
  Clock,
  AlertCircle
} from "lucide-react";
import publicationService from "../../services/publication.service";
import { Post } from "../../types";
import { useAuth } from "../../context/AuthContext";

// Référence en dehors du composant pour éviter les problèmes avec StrictMode
const apiCallInProgress = { current: false };

// Guide d'utilisation
const PendingPublicationsGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Guide d'utilisation des publications en attente</h3>
        </div>
        <ChevronDown className={`h-5 w-5 text-purple-600 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 text-sm text-gray-700 space-y-3">
          <p className="flex items-start">
            <Info className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Cette section vous permet de modérer les publications en attente avant qu'elles ne soient visibles sur le site.</span>
          </p>
          
          <div className="pl-6 space-y-2">
            <p className="font-semibold text-purple-800">Fonctionnalités disponibles :</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><span className="font-medium">Rechercher</span> : Trouvez rapidement une publication spécifique en utilisant la barre de recherche.</li>
              <li><span className="font-medium">Prévisualiser</span> : Examinez l'apparence finale d'une publication avec le bouton <Eye className="h-4 w-4 inline text-gray-600" />.</li>
              <li><span className="font-medium">Modifier</span> : Corrigez ou améliorez une publication avant de l'approuver avec le bouton <Edit2 className="h-4 w-4 inline text-blue-600" />.</li>
              <li><span className="font-medium">Approuver</span> : Validez et publiez une publication avec le bouton <Check className="h-4 w-4 inline text-green-600" />.</li>
              <li><span className="font-medium">Rejeter</span> : Refusez une publication qui ne respecte pas les standards avec le bouton <X className="h-4 w-4 inline text-red-600" />.</li>
              <li><span className="font-medium">Actualiser</span> : Mettez à jour la liste des publications en attente avec le bouton <RefreshCw className="h-4 w-4 inline text-gray-600" />.</li>
            </ul>
          </div>
          
          <div className="pl-6 mt-3">
            <p className="font-semibold text-purple-800">Informations importantes :</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>En tant que Super Administrateur, vous êtes responsable de la validation du contenu avant publication.</li>
              <li>Vérifiez attentivement les dates de validité avant d'approuver une publication.</li>
              <li>Une fois rejetée, une publication devra être soumise à nouveau pour être publiée.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour le skeleton loader
const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

// Composant pour un élément de publication
const PublicationItem = ({
  publication,
  onPreview,
  onEdit,
  onApprove,
  onReject,
}: {
  publication: Post;
  onPreview: (id: string) => void;
  onEdit: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) => {
  // Déterminer si la publication est programmée dans le futur
  const now = new Date();
  const validFrom = new Date(publication.validFrom);
  const validTo = new Date(publication.validTo);
  const isScheduled = validFrom > now;
  const isExpiringSoon = validTo < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 jours
  
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">
              {new Date(publication.createdAt).toLocaleDateString("fr-BE")}
            </span>
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              En attente
            </span>
            {isScheduled && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Programmée
              </span>
            )}
            {isExpiringSoon && !isScheduled && (
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                Expiration proche
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {publication.title}
          </h3>
          <p className="text-gray-600 line-clamp-2 mb-4">{publication.content}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPreview(publication.id)}
              className="inline-flex items-center text-gray-600 hover:text-[#6A0DAD] transition-colors"
              title="Prévisualiser la publication"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </button>
            <button
              onClick={() => onEdit(publication.id)}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              title="Modifier la publication"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              onClick={() => onApprove(publication.id)}
              className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
              title="Approuver la publication"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </button>
            <button
              onClick={() => onReject(publication.id)}
              className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
              title="Rejeter la publication"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </button>
          </div>
        </div>
        {publication.imageUrl ? (
          <img
            src={publication.imageUrl}
            alt={publication.title}
            className="w-32 h-32 object-cover rounded-lg ml-4 shadow-sm"
            loading="lazy"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-100 rounded-lg ml-4 flex items-center justify-center text-gray-400">
            <span className="text-xs text-center px-2">No image</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <span>
          Valid from {new Date(publication.validFrom).toLocaleDateString("fr-BE")}
        </span>
        <span className="mx-2">to</span>
        <span>{new Date(publication.validTo).toLocaleDateString("fr-BE")}</span>
      </div>
    </div>
  );
};

export default function PendingPublications() {
  // Component state
  const [publications, setPublications] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);

  // Hooks
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  // Fonction pour extraire les données de publication de la réponse API
  const extractPublicationsData = (response: any): Post[] => {
    // Cas 1: La réponse est directement un tableau
    if (Array.isArray(response)) {
      return response;
    }

    // Cas 2: La réponse est un objet avec une propriété 'data'
    if (response && typeof response === "object" && "data" in response) {
      const responseData = response.data as any;

      // Cas 2.1: response.data est un tableau
      if (Array.isArray(responseData)) {
        return responseData;
      }

      // Cas 2.2: response.data est un objet avec une propriété 'data' qui est un tableau
      if (
        responseData &&
        typeof responseData === "object" &&
        "data" in responseData &&
        Array.isArray(responseData.data)
      ) {
        return responseData.data;
      }
    }

    // Si aucun format valide n'est trouvé, retourner un tableau vide
    return [];
  };

  // Chargement des publications
  const loadPublications = useCallback(async (showLoadingIndicator = true) => {
    // Éviter les appels multiples pendant le cycle StrictMode
    if (apiCallInProgress.current) {
      return;
    }

    // Marquer l'appel API comme en cours
    apiCallInProgress.current = true;

    if (showLoadingIndicator) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);
    setSuccess(null);

    try {
      // Ajouter un timeout pour les requêtes API
      const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Request timeout after 10 seconds"));
        }, 10000);
        return () => clearTimeout(timeoutId);
      });

      // Faire la requête API avec timeout
      const response = await Promise.race([
        publicationService.getPendingPublications(),
        timeoutPromise,
      ]);

      // Extraire et valider les données
      const publicationsData = extractPublicationsData(response);
      if (!Array.isArray(publicationsData)) {
        throw new Error(
          "Invalid data format: Expected an array of publications."
        );
      }

      // Trier les données par date de création (les plus récentes en premier)
      const sortedData = [...publicationsData].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Mettre à jour l'état
      setPublications(sortedData);
      
      if (!showLoadingIndicator) {
        setSuccess("La liste des publications en attente a été actualisée");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error: any) {
      setError(
        error.message || "Error loading pending publications. Please try again."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      apiCallInProgress.current = false;
    }
  }, []);

  // Effet pour la vérification d'authentification et le chargement des données
  useEffect(() => {
    // Réinitialiser isMountedRef
    isMountedRef.current = true;

    // Vérifier l'authentification
    if (!user) {
      navigate("/login", { state: { from: "/admin/pending" } });
      return;
    }

    if (user.role.toLowerCase() !== "superadmin") {
      navigate("/admin");
      return;
    }

    // Éviter le double chargement en mode strict
    if (!initialLoadAttempted) {
      setInitialLoadAttempted(true);
      loadPublications();
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [user, navigate, loadPublications, initialLoadAttempted]);

  // Gestionnaire d'action pour les publications
  const handlePublicationAction = async (
    id: string,
    action: "approve" | "reject",
    confirmMessage?: string
  ) => {
    if (!isMountedRef.current) return;

    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }

    setError(null);
    
    const actionLabel = action === "approve" ? "Approbation" : "Rejet";
    const publication = publications.find(pub => pub.id === id);
    const publicationTitle = publication ? publication.title : "la publication";

    try {
      if (action === "approve") {
        await publicationService.approvePublication(id);
        setSuccess(`La publication "${publicationTitle}" a été approuvée avec succès`);
      } else {
        await publicationService.rejectPublication(id);
        setSuccess(`La publication "${publicationTitle}" a été rejetée`);
      }

      // Mettre à jour l'état local pour supprimer la publication traitée
      setPublications((prev) => prev.filter((pub) => pub.id !== id));
      
      // Masquer le message de succès après quelques secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError(
        error.message || `Erreur lors de ${actionLabel.toLowerCase()} de la publication. Veuillez réessayer.`
      );
    }
  };

  // Handlers pour les différentes actions
  const handleApprove = (id: string) => handlePublicationAction(id, "approve");
  const handleReject = (id: string) =>
    handlePublicationAction(
      id,
      "reject",
      "Êtes-vous sûr de vouloir rejeter cette publication ?"
    );
  const handleEdit = (id: string) => navigate(`/admin/publications/edit/${id}`);
  const handlePreview = (id: string) => navigate(`/news/${id}`);
  const handleRefresh = () => loadPublications(false);

  // Filtrer les publications en fonction du terme de recherche
  const filteredPublications = publications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Afficher le skeleton loader pendant le chargement
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Afficher le contenu principal
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Guide d'utilisation */}
      <PendingPublicationsGuide />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 mr-4">
                Publications en attente
              </h1>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {publications.length} en attente
              </span>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              title="Actualiser la liste"
            >
              <RefreshCw
                className={`w-5 h-5 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Actualiser
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 flex items-start">
              <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une publication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {filteredPublications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm
              ? "Aucune publication ne correspond à votre recherche"
              : "Aucune publication en attente de validation"}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPublications.map((publication) => (
              <PublicationItem
                key={publication.id}
                publication={publication}
                onPreview={handlePreview}
                onEdit={handleEdit}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
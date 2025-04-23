import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Trash2, 
  Eye, 
  Edit2, 
  Search, 
  Clock, 
  AlertCircle, 
  Check, 
  RefreshCw,
  HelpCircle,
  ChevronDown,
  Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Post } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import publicationService from '../../services/publication.service';

// Component guide d'utilisation
const PublicationGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Guide d'utilisation du gestionnaire de publications</h3>
        </div>
        <ChevronDown className={`h-5 w-5 text-purple-600 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 text-sm text-gray-700 space-y-3">
          <p className="flex items-start">
            <Info className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Ce module vous permet de gérer toutes les publications et actualités de la plateforme.</span>
          </p>
          
          <div className="pl-6 space-y-2">
            <p className="font-semibold text-purple-800">Fonctionnalités disponibles :</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><span className="font-medium">Créer une publication</span> : Ajoutez de nouvelles publications en utilisant le bouton "Créer une publication".</li>
              <li><span className="font-medium">Rechercher</span> : Utilisez la barre de recherche pour trouver rapidement une publication par son titre ou contenu.</li>
              <li><span className="font-medium">Filtrer</span> : Sélectionnez différentes catégories pour afficher les publications selon leur statut (actives, expirées, en attente).</li>
              <li><span className="font-medium">Voir</span> : Visualisez une publication telle qu'elle apparaît aux utilisateurs avec le bouton <Eye className="h-4 w-4 inline text-purple-600" />.</li>
              <li><span className="font-medium">Modifier</span> : Éditez une publication existante avec le bouton <Edit2 className="h-4 w-4 inline text-blue-600" />.</li>
              <li><span className="font-medium">Supprimer</span> : Supprimez définitivement une publication avec le bouton <Trash2 className="h-4 w-4 inline text-red-600" /> (action irréversible).</li>
              <li><span className="font-medium">Actualiser</span> : Mettez à jour la liste des publications avec le bouton <RefreshCw className="h-4 w-4 inline text-gray-600" />.</li>
            </ul>
          </div>
          
          <div className="pl-6 mt-3">
            <p className="font-semibold text-purple-800">Informations importantes :</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Chaque publication possède une période de validité (de / à) qui détermine quand elle sera visible.</li>
              <li>Les publications "en attente" doivent être validées par un administrateur avant d'être publiées.</li>
              <li>Une image peut être ajoutée à chaque publication pour la rendre plus attractive.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Publications() {
  const [publications, setPublications] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'pending'>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Chargement initial des publications
  useEffect(() => {
    loadPublications();
  }, []);

  // Fonction pour charger les publications depuis le backend
  const loadPublications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Utiliser le service de publication pour récupérer les données
      const data = await publicationService.getAllPublications();
      
      // Trier par date de création (plus récente en premier)
      setPublications(data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error: any) {
      console.error('Error loading publications:', error);
      setError(error.response?.data?.message || 'Erreur lors du chargement des publications');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les publications selon les critères de recherche et de filtre
  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pub.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const validFrom = new Date(pub.validFrom);
    const validTo = new Date(pub.validTo);
    
    switch (filter) {
      case 'active':
        return matchesSearch && now >= validFrom && now <= validTo && pub.status === 'published';
      case 'expired':
        return matchesSearch && now > validTo && pub.status === 'published';
      case 'pending':
        return matchesSearch && pub.status === 'pending';
      default:
        return matchesSearch;
    }
  });

  // Gérer la suppression d'une publication
  const handleDelete = async (id: string) => {
    if (window.confirm(t('admin.publications.confirmDelete'))) {
      setIsDeleting(id);
      setError(null);
      setSuccess(null);
      
      try {
        // Utiliser le service de publication pour la suppression
        await publicationService.deletePublication(id);
        
        // Mettre à jour l'état local après suppression réussie
        setPublications(prev => prev.filter(pub => pub.id !== id));
        setSuccess("Publication supprimée avec succès");
        
        // Masquer le message de succès après quelques secondes
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (error: any) {
        console.error('Error deleting publication:', error);
        setError(error.response?.data?.message || 'Erreur lors de la suppression de la publication');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Naviguer vers la page d'édition
  const handleEdit = (id: string) => {
    navigate(`/admin/publications/edit/${id}`);
  };

  // Obtenir la classe CSS pour le statut de la publication
  const getStatusBadgeClass = (publication: Post) => {
    const now = new Date();
    const validFrom = new Date(publication.validFrom);
    const validTo = new Date(publication.validTo);
    
    if (publication.status === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (now < validFrom) {
      return 'bg-blue-100 text-blue-800';
    } else if (now > validTo) {
      return 'bg-gray-100 text-gray-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  // Obtenir le texte du statut de la publication
  const getStatusText = (publication: Post) => {
    const now = new Date();
    const validFrom = new Date(publication.validFrom);
    const validTo = new Date(publication.validTo);
    
    if (publication.status === 'pending') {
      return 'En attente';
    } else if (now < validFrom) {
      return 'Programmée';
    } else if (now > validTo) {
      return 'Expirée';
    } else {
      return 'Active';
    }
  };

  // Afficher un état de chargement
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Guide d'utilisation */}
      <PublicationGuide />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('admin.publications.title')}
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={loadPublications}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                disabled={isLoading}
                title="Actualiser la liste"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
              
              <Link
                to="/admin/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] transition-colors"
              >
                {t('admin.publications.create')}
              </Link>
            </div>
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

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher une publication..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="sm:w-48">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
              >
                <option value="all">Toutes les publications</option>
                <option value="active">Publications actives</option>
                <option value="expired">Publications expirées</option>
                {user?.role === 'admin' && (
                  <option value="pending">Publications en attente</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {filteredPublications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm 
              ? "Aucune publication ne correspond à votre recherche"
              : t('admin.publications.noPublications')}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPublications.map((publication) => (
              <div key={publication.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {new Date(publication.createdAt).toLocaleDateString('fr-BE')}
                      </span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusBadgeClass(publication)}`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {getStatusText(publication)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {publication.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {publication.content}
                    </p>
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/news/${publication.id}`}
                        className="inline-flex items-center text-[#6A0DAD] hover:text-[#5a0b91] transition-colors"
                        title="Voir la publication"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Link>
                      <button
                        onClick={() => handleEdit(publication.id)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        title="Modifier la publication"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        {t('admin.publications.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(publication.id)}
                        disabled={isDeleting === publication.id}
                        className="inline-flex items-center text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Supprimer la publication"
                      >
                        {isDeleting === publication.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4 mr-1 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Suppression...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
                            {t('admin.publications.delete')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  {publication.imageUrl ? (
                    <img
                      src={publication.imageUrl}
                      alt={publication.title}
                      className="w-32 h-32 object-cover rounded-lg ml-4 shadow-sm"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg ml-4 flex items-center justify-center text-gray-400">
                      <span className="text-xs text-center px-2">Aucune image</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>Valide du {new Date(publication.validFrom).toLocaleDateString('fr-BE')}</span>
                  <span className="mx-2">au</span>
                  <span>{new Date(publication.validTo).toLocaleDateString('fr-BE')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
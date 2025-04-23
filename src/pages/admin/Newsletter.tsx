import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Trash2,
  Download,
  Filter,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  Info,
  Search,
  Users,
  MailOpen,
  Bell,
  CheckSquare,
  XSquare,
  MessageSquare,
  Calendar,
  FileText,
  Eye
} from "lucide-react";
import newsletterService from "../../services/newsletter.service";
import publicationService from "../../services/publication.service";
import { Post } from "../../types";

// Guide d'utilisation pour la gestion de la newsletter
const NewsletterGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">Guide de gestion de la newsletter</h3>
        </div>
        <ChevronDown className={`h-5 w-5 text-purple-600 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 text-sm text-gray-700 space-y-3">
          <p className="flex items-start">
            <Info className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Cette interface vous permet de gérer vos abonnés à la newsletter et d'envoyer des communications.</span>
          </p>
          
          <div className="pl-6 space-y-2">
            <p className="font-semibold text-purple-800">Fonctionnalités disponibles :</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><span className="font-medium">Gérer les abonnés</span> : Consultez la liste complète des abonnés avec leur statut et historique.</li>
              <li><span className="font-medium">Filtrer</span> : Utilisez les options de filtre pour afficher seulement les abonnés actifs ou désabonnés.</li>
              <li><span className="font-medium">Envoyer une newsletter</span> : Sélectionnez une publication existante pour l'envoyer à tous vos abonnés.</li>
              <li><span className="font-medium">Tester</span> : Envoyez un email de test pour vérifier l'apparence de votre newsletter.</li>
              <li><span className="font-medium">Exporter en CSV</span> : Téléchargez la liste de vos abonnés au format CSV pour vos archives ou analyses.</li>
              <li><span className="font-medium">Supprimer</span> : Retirez un abonné de votre liste avec le bouton <Trash2 className="h-4 w-4 inline text-red-600" />.</li>
            </ul>
          </div>
          
          <div className="pl-6 mt-3">
            <p className="font-semibold text-purple-800">Bonnes pratiques :</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Envoyez des newsletters à intervalles réguliers pour maintenir l'engagement sans surcharger vos abonnés.</li>
              <li>Testez toujours votre newsletter sur différents appareils avant l'envoi final.</li>
              <li>Respectez le RGPD et donnez toujours la possibilité de se désabonner facilement.</li>
              <li>Surveillez les statistiques pour améliorer continuellement vos campagnes.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

interface Subscriber {
  id: string;
  email_address: string;
  status: string;
  merge_fields: {
    FNAME: string;
    LNAME: string;
  };
  timestamp_signup: string;
  last_changed: string;
}

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [publications, setPublications] = useState<Post[]>([]);
  const [selectedPublication, setSelectedPublication] = useState<string>("");
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const [showTestEmailForm, setShowTestEmailForm] = useState(false);
  const [showNewsletterForm, setShowNewsletterForm] = useState(false);
  const [showPublicationPreview, setShowPublicationPreview] = useState(false);
  const [selectedEmailsAction, setSelectedEmailsAction] = useState<string>("");

  useEffect(() => {
    loadSubscribers();
    loadPublications();
  }, []);

  // Dans le composant Newsletter.tsx
  const loadSubscribers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await newsletterService.getAllSubscribers();
      //tofix: par rapport à ton mailchimp
      // Adapter les données au format attendu par le composant
      const adaptedSubscribers: Subscriber[] = response.map((sub) => ({
        id: sub.id,
        email_address: sub.email,
        status: sub.confirmed ? "subscribed" : "unsubscribed",
        merge_fields: {
          FNAME: sub.firstName || "",
          LNAME: sub.lastName || "",
        },
        timestamp_signup: sub.createdAt,
        last_changed: sub.lastSentAt || sub.createdAt,
      }));

      setSubscribers(adaptedSubscribers);
      setSuccess("Liste des abonnés chargée avec succès");
      
      // Masquer le message de succès après quelques secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error loading subscribers:", err);
      setError("Erreur lors du chargement des abonnés");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadSubscribers();
  };

  const loadPublications = async () => {
    try {
      const data = await publicationService.getActivePublications();
      setPublications(data);
    } catch (err) {
      console.error("Error loading publications:", err);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmails(filteredSubscribers.map((sub) => sub.email_address));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectSubscriber = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    try {
      setIsSendingTest(true);
      setError(null);
      await newsletterService.sendTestEmail(testEmail, selectedPublication);
      setSuccess(`Email de test envoyé avec succès à ${testEmail} !`);
      setTestEmail("");
      setShowTestEmailForm(false);

      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi de l'email de test");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPublication) return;

    try {
      setIsSendingNewsletter(true);
      setError(null);

      const publication = publications.find(
        (p) => p.id === selectedPublication
      );
      if (!publication) {
        throw new Error("Publication non trouvée");
      }
      
      // Confirmation avant envoi
      if (!window.confirm(`Êtes-vous sûr de vouloir envoyer cette newsletter à ${filteredSubscribers.length} abonnés ?`)) {
        setIsSendingNewsletter(false);
        return;
      }
      
      //tofix: par rapport à ton mailchimp
      // await sendNewsletterCampaign({
      //   title: publication.title,
      //   content: publication.content,
      //   imageUrl: publication.imageUrl,
      //   category: publication.category,
      // });

      setSuccess(`Newsletter "${publication.title}" envoyée avec succès à ${filteredSubscribers.length} abonnés !`);
      setSelectedPublication("");
      setShowNewsletterForm(false);

      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi de la newsletter");
    } finally {
      setIsSendingNewsletter(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet abonné ?")) {
      return;
    }
    
    try {
      await newsletterService.deleteSubscriber(id);
      setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
      setSuccess("Abonné supprimé avec succès");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError("Erreur lors de la suppression de l'abonné");
    }
  };

  const handleBulkAction = async () => {
    if (!selectedEmailsAction || selectedEmails.length === 0) return;
    
    if (!window.confirm(`Êtes-vous sûr de vouloir ${selectedEmailsAction === 'delete' ? 'supprimer' : 'exporter'} ${selectedEmails.length} abonnés ?`)) {
      return;
    }
    
    try {
      if (selectedEmailsAction === 'delete') {
        // Ici, vous devriez implémenter la suppression par lot des abonnés sélectionnés
        const subscribersToDelete = subscribers.filter(sub => selectedEmails.includes(sub.email_address));
        for (const sub of subscribersToDelete) {
          await newsletterService.deleteSubscriber(sub.id);
        }
        setSubscribers(prev => prev.filter(sub => !selectedEmails.includes(sub.email_address)));
        setSuccess(`${selectedEmails.length} abonnés supprimés avec succès`);
        setSelectedEmails([]);
      } else if (selectedEmailsAction === 'export') {
        handleExportSelectedCSV();
      }
    } catch (err) {
      setError("Erreur lors de l'action par lot");
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      [
        "Email",
        "Prénom",
        "Nom",
        "Statut",
        "Date d'inscription",
        "Dernière modification",
      ].join(","),
      ...filteredSubscribers.map((sub) =>
        [
          sub.email_address,
          sub.merge_fields.FNAME || "",
          sub.merge_fields.LNAME || "",
          sub.status,
          new Date(sub.timestamp_signup).toLocaleDateString("fr-BE"),
          new Date(sub.last_changed).toLocaleDateString("fr-BE"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-subscribers-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    
    setSuccess("Fichier CSV exporté avec succès");
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleExportSelectedCSV = () => {
    // Filtrer les abonnés pour n'inclure que ceux qui sont sélectionnés
    const selectedSubscribers = subscribers.filter(sub => 
      selectedEmails.includes(sub.email_address)
    );
    
    const csvContent = [
      [
        "Email",
        "Prénom",
        "Nom",
        "Statut",
        "Date d'inscription",
        "Dernière modification",
      ].join(","),
      ...selectedSubscribers.map((sub) =>
        [
          sub.email_address,
          sub.merge_fields.FNAME || "",
          sub.merge_fields.LNAME || "",
          sub.status,
          new Date(sub.timestamp_signup).toLocaleDateString("fr-BE"),
          new Date(sub.last_changed).toLocaleDateString("fr-BE"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `selected-newsletter-subscribers-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    
    setSuccess(`${selectedSubscribers.length} abonnés exportés avec succès`);
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Filtrage et recherche combinés
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesFilter = 
      filter === "all" ? true : 
      filter === "active" ? sub.status === "subscribed" : 
      sub.status === "unsubscribed";
    
    const matchesSearch = 
      searchTerm === "" ? true :
      sub.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${sub.merge_fields.FNAME} ${sub.merge_fields.LNAME}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getPublicationPreview = () => {
    const publication = publications.find(p => p.id === selectedPublication);
    if (!publication) return null;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100 max-h-96 overflow-y-auto">
        <button 
          onClick={() => setShowPublicationPreview(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XSquare className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-bold mb-2">{publication.title}</h3>
        {publication.imageUrl && (
          <img 
            src={publication.imageUrl} 
            alt={publication.title} 
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        )}
        <div className="prose max-w-none">
          {publication.content}
        </div>
      </div>
    );
  };

  // Affichage du squelette pendant le chargement
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Guide d'utilisation */}
      <NewsletterGuide />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <MailOpen className="h-7 w-7 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion de la Newsletter
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Actualiser la liste des abonnés"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Actualiser
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                title="Exporter tous les abonnés au format CSV"
              >
                <Download className="h-5 w-5 mr-2" />
                Exporter CSV
              </button>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNewsletterForm(!showNewsletterForm);
                    setShowTestEmailForm(false);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] transition-colors"
                  title="Envoyer une newsletter à tous les abonnés actifs"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Envoyer Newsletter
                </button>

                {showNewsletterForm && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Bell className="h-5 w-5 text-purple-600 mr-2" />
                      Envoyer une newsletter
                    </h3>
                    <form onSubmit={handleSendNewsletter}>
                      <div className="mb-4">
                        <label
                          htmlFor="publication"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Sélectionner une publication
                        </label>
                        <select
                          id="publication"
                          value={selectedPublication}
                          onChange={(e) => {
                            setSelectedPublication(e.target.value);
                            setShowPublicationPreview(false);
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                          required
                        >
                          <option value="">Sélectionner une publication</option>
                          {publications.map((pub) => (
                            <option key={pub.id} value={pub.id}>
                              {pub.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {selectedPublication && (
                        <div className="mb-4">
                          <button
                            type="button"
                            onClick={() => setShowPublicationPreview(!showPublicationPreview)}
                            className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {showPublicationPreview ? "Masquer l'aperçu" : "Voir l'aperçu"}
                          </button>
                          
                          {showPublicationPreview && (
                            <div className="mt-2 relative">
                              {getPublicationPreview()}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowNewsletterForm(false)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={isSendingNewsletter || !selectedPublication}
                          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] transition-colors disabled:opacity-50"
                        >
                          {isSendingNewsletter ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-2" />
                              Envoyer
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowTestEmailForm(!showTestEmailForm);
                    setShowNewsletterForm(false);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  title="Envoyer un email de test"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Tester
                </button>

                {showTestEmailForm && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Mail className="h-5 w-5 text-purple-600 mr-2" />
                      Envoyer un email de test
                    </h3>
                    <form onSubmit={handleSendTestEmail}>
                      <div className="mb-4">
                        <label
                          htmlFor="publication"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Sélectionner une publication
                        </label>
                        <select
                          id="publication"
                          value={selectedPublication}
                          onChange={(e) => setSelectedPublication(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#6A0DAD] focus:ring-[#6A0DAD] mb-3"
                          required
                        >
                          <option value="">Sélectionner une publication</option>
                          {publications.map((pub) => (
                            <option key={pub.id} value={pub.id}>
                              {pub.title}
                            </option>
                          ))}
                        </select>
                        
                        <label
                          htmlFor="testEmail"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email de test
                        </label>
                        <input
                          type="email"
                          id="testEmail"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowTestEmailForm(false)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={isSendingTest || !testEmail || !selectedPublication}
                          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] transition-colors disabled:opacity-50"
                        >
                          {isSendingTest ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-2" />
                              Tester
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2 w-full">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Rechercher un abonné..."
                  className="border-none focus:ring-0 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#6A0DAD] focus:ring-[#6A0DAD] sm:text-sm"
              >
                <option value="all">Tous les abonnés</option>
                <option value="active">Abonnés actifs</option>
                <option value="unsubscribed">Désabonnés</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-1" /> 
                  {filteredSubscribers.length} abonné{filteredSubscribers.length !== 1 ? "s" : ""}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <CheckSquare className="h-4 w-4 mr-1" /> 
                  {subscribers.filter(s => s.status === "subscribed").length} actifs
                </span>
              </div>
              
              {selectedEmails.length > 0 && (
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedEmailsAction}
                    onChange={(e) => setSelectedEmailsAction(e.target.value)}
                    className="block rounded-md border-gray-300 text-sm shadow-sm focus:border-[#6A0DAD] focus:ring-[#6A0DAD]"
                  >
                    <option value="">Action groupée...</option>
                    <option value="delete">Supprimer</option>
                    <option value="export">Exporter</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!selectedEmailsAction}
                    className="inline-flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Appliquer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 flex items-center border-l-4 border-red-500">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 flex items-center border-l-4 border-green-500">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Statistiques et informations */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 border-b border-gray-200">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Total abonnés</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <CheckSquare className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Abonnés actifs</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {subscribers.filter(s => s.status === "subscribed").length}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <XSquare className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Désabonnés</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {subscribers.filter(s => s.status === "unsubscribed").length}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Publications disponibles</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{publications.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedEmails.length === filteredSubscribers.length &&
                      filteredSubscribers.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD] border-gray-300 rounded"
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nom
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date d'inscription
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Dernière modification
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <MailOpen className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">Aucun abonné trouvé</p>
                      <p className="text-sm">{searchTerm ? "Essayez de modifier votre recherche" : "Aucun abonné ne correspond au filtre sélectionné"}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(
                          subscriber.email_address
                        )}
                        onChange={() =>
                          handleSelectSubscriber(subscriber.email_address)
                        }
                        className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD] border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {subscriber.email_address}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscriber.merge_fields.FNAME ||
                      subscriber.merge_fields.LNAME ? (
                        `${subscriber.merge_fields.FNAME || ""} ${
                          subscriber.merge_fields.LNAME || ""
                        }`
                      ) : (
                        <span className="text-gray-400 italic">
                          Non renseigné
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subscriber.status === "subscribed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {subscriber.status === "subscribed"
                          ? "Abonné"
                          : "Désabonné"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {subscriber.timestamp_signup
                          ? new Date(
                              subscriber.timestamp_signup
                            ).toLocaleDateString("fr-BE")
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        {subscriber.last_changed
                          ? new Date(subscriber.last_changed).toLocaleDateString(
                              "fr-BE"
                            )
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Supprimer cet abonné"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination ou chargement par lots à implémenter ici si nécessaire */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Affichage de <span className="font-medium">{filteredSubscribers.length}</span> abonnés
              {selectedEmails.length > 0 && (
                <> (<span className="font-medium">{selectedEmails.length}</span> sélectionnés)</>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-BE')} à {new Date().toLocaleTimeString('fr-BE')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
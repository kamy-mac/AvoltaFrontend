import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Image as ImageIcon,
  Save,
  Type,
  Bold,
  Italic,
  Underline,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import publicationService from "../../services/publication.service";
import { useTranslation } from "react-i18next";
import { Post } from "../../types";

export default function EditPublication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [publication, setPublication] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Charger la publication à partir de l'ID
  useEffect(() => {
    const loadPublication = async () => {
      if (!id) {
        navigate("/admin/publications");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const pub = await publicationService.getPublicationById(id);
        
        // Assurez-vous que les dates sont des objets Date
        const formattedPub = {
          ...pub,
          validFrom: pub.validFrom instanceof Date ? pub.validFrom : new Date(pub.validFrom),
          validTo: pub.validTo instanceof Date ? pub.validTo : new Date(pub.validTo)
        };
        
        setPublication(formattedPub);
        
        // Définir l'aperçu de l'image si disponible
        if (formattedPub.imageUrl) {
          setImagePreview(formattedPub.imageUrl);
        }
      } catch (error: any) {
        console.error("Error loading publication:", error);
        
        // Gestion améliorée des erreurs
        if (error.response) {
          const status = error.response.status;
          if (status === 404) {
            setError("Publication non trouvée.");
          } else {
            setError(error.response?.data?.message || `Erreur ${status}: Impossible de charger la publication`);
          }
        } else if (error.request) {
          setError("Pas de réponse du serveur. Vérifiez votre connexion internet.");
        } else {
          setError("Une erreur s'est produite lors du chargement de la publication.");
        }
        
        setTimeout(() => navigate("/admin/publications"), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadPublication();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publication || !id) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Formatage des dates pour le backend
      const validFromDate = publication.validFrom instanceof Date ? 
        publication.validFrom : new Date(publication.validFrom);
      const validToDate = publication.validTo instanceof Date ? 
        publication.validTo : new Date(publication.validTo);
      
      // Format ISO pour le backend
      const formattedValidFrom = validFromDate.toISOString();
      const formattedValidTo = validToDate.toISOString();
      
      await publicationService.updatePublication(id, {
        title: publication.title,
        content: publication.content,
        imageUrl: publication.imageUrl,
        validFrom: formattedValidFrom,
        validTo: formattedValidTo,
        category: publication.category,
      });
      
      setSuccess("Publication mise à jour avec succès!");
      
      // Rediriger après un court délai
      setTimeout(() => {
        navigate("/admin/publications");
      }, 2000);
    } catch (error: any) {
      console.error("Error updating publication:", error);
      
      // Gestion améliorée des erreurs
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
          setTimeout(() => window.location.href = "/login", 2000);
        } else if (status === 403) {
          setError("Vous n'avez pas les permissions nécessaires pour effectuer cette action.");
        } else {
          setError(error.response?.data?.message || `Erreur ${status}: Impossible de mettre à jour la publication`);
        }
      } else if (error.request) {
        setError("Pas de réponse du serveur. Vérifiez votre connexion internet.");
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      setPublication((prev) => {
        if (!prev) return null;
        
        // Si c'est l'URL de l'image, mettre à jour l'aperçu
        if (name === "imageUrl") {
          setImagePreview(value);
        }
        
        return { ...prev, [name]: value };
      });
    },
    []
  );

  const handleFormat = useCallback((format: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea || !publication) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = "";

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `_${selectedText}_`;
        break;
      default:
        return;
    }

    const newContent =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(end);
    
    setPublication((prev) => {
      if (!prev) return null;
      return { ...prev, content: newContent };
    });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, end + 2);
    }, 0);
  }, [publication]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <p className="text-red-700">Publication non trouvée ou erreur de chargement</p>
          </div>
          <p className="mt-2">Redirection vers la liste des publications...</p>
        </div>
      </div>
    );
  }

  // Le reste du composant reste inchangé
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/admin/publications")}
          className="mr-4 text-gray-600 hover:text-[#6A0DAD]"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Modifier la publication
        </h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-lg shadow-lg p-6"
      >
        {/* Le reste du formulaire reste inchangé */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Titre
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <Type className="h-5 w-5" />
            </span>
            <input
              type="text"
              id="title"
              name="title"
              value={publication.title}
              onChange={handleInputChange}
              className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            value={publication.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
          >
            <option value="news">{t("news.category.news")}</option>
            <option value="events">{t("news.category.events")}</option>
            <option value="press">{t("news.category.press")}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contenu
          </label>
          <div className="mb-2 flex space-x-2">
            <button
              type="button"
              onClick={() => handleFormat("bold")}
              className="p-2 rounded hover:bg-gray-100"
              title="Gras"
            >
              <Bold className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleFormat("italic")}
              className="p-2 rounded hover:bg-gray-100"
              title="Italique"
            >
              <Italic className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleFormat("underline")}
              className="p-2 rounded hover:bg-gray-100"
              title="Souligné"
            >
              <Underline className="w-5 h-5" />
            </button>
          </div>
          <textarea
            id="content"
            name="content"
            rows={6}
            value={publication.content}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            required
          />
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL de l'image
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              <ImageIcon className="h-5 w-5" />
            </span>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={publication.imageUrl}
              onChange={handleInputChange}
              className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
          </div>
          {imagePreview && (
            <div className="mt-2 relative h-40 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="validFrom"
              className="block text-sm font-medium text-gray-700"
            >
              Date de début
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <Calendar className="h-5 w-5" />
              </span>
              <input
                type="date"
                id="validFrom"
                name="validFrom"
                value={
                  publication.validFrom instanceof Date
                    ? publication.validFrom.toISOString().split("T")[0]
                    : new Date(publication.validFrom).toISOString().split("T")[0]
                }
                onChange={handleInputChange}
                className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="validTo"
              className="block text-sm font-medium text-gray-700"
            >
              Date de fin
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <Calendar className="h-5 w-5" />
              </span>
              <input
                type="date"
                id="validTo"
                name="validTo"
                value={
                  publication.validTo instanceof Date
                    ? publication.validTo.toISOString().split("T")[0]
                    : new Date(publication.validTo).toISOString().split("T")[0]
                }
                onChange={handleInputChange}
                className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A0DAD] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
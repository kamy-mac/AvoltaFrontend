import React, { useState, useEffect } from 'react';
import { X, Mail, Send, CheckCircle, AlertCircle, User, UserCircle } from 'lucide-react';
import newsletterService from '../../services/newsletter.service';

interface NewsletterFormProps {
  buttonText?: string;
  placeholder?: string;
  onSuccess?: () => void;
}

function NewsletterForm({ 
  buttonText = "Je m'abonne", 
  placeholder = "Votre email professionnel",
  onSuccess 
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await newsletterService.subscribe({ email, firstName, lastName });
      setSuccess("Merci de vous être abonné à notre newsletter !");
      setEmail("");
      setFirstName("");
      setLastName("");
      
      // Appel de la fonction onSuccess si fournie
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Erreur d'inscription à la newsletter :", err);
      setError(
        err.response?.data?.message || 
        "Échec de l'inscription. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start text-red-600 text-sm bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="flex items-start text-green-600 text-sm bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD] shadow-sm transition-colors"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD] shadow-sm transition-colors"
          />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserCircle className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom de famille"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD] shadow-sm transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A0DAD] disabled:opacity-50 transition-colors"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Inscription en cours...
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            {buttonText}
          </>
        )}
      </button>
    </form>
  );
}

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setIsSubscribed] = useState(false);
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé la popup ou s'est abonné
    const hasClosedPopup = localStorage.getItem('newsletterPopupClosed');
    const hasSubscribed = localStorage.getItem('newsletterSubscribed');
    
    if (!hasClosedPopup && !hasSubscribed) {
      // Afficher la popup après 10 secondes
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Ajouter un petit délai avant l'animation pour permettre au DOM de s'initialiser
        setTimeout(() => setAnimated(true), 10);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleClose = () => {
    setAnimated(false);
    // Attendre la fin de l'animation avant de fermer
    setTimeout(() => {
      setIsOpen(false);
      // Mémoriser que l'utilisateur a fermé la popup
      localStorage.setItem('newsletterPopupClosed', 'true');
    }, 300);
  };
  
  const handleSuccess = () => {
    // Fermer la popup après un abonnement réussi
    setTimeout(() => {
      setAnimated(false);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubscribed(true);
        // Mémoriser que l'utilisateur s'est abonné
        localStorage.setItem('newsletterSubscribed', 'true');
      }, 300);
    }, 3000);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
         style={{ opacity: animated ? 1 : 0 }}>
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-transform duration-300 ease-out ${
          animated ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors duration-200"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-32 h-auto mx-auto mb-6">
            <img
              src="/public/images/LOGO_AVOLTA_FL_CORE_RGB.jpg"
              alt="Logo Avolta"
              className="w-full h-auto object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Restez informé
          </h3>
          <p className="text-gray-600">
            Abonnez-vous à notre newsletter pour recevoir les dernières actualités d'Avolta Belgique.
          </p>
        </div>
        
        <div className="bg-gray-50 p-5 rounded-xl mb-6">
          <NewsletterForm 
            buttonText="Je m'abonne"
            placeholder="Votre email professionnel"
            onSuccess={handleSuccess}
          />
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          En vous inscrivant, vous acceptez de recevoir nos communications par email.
          <br />Vous pourrez vous désabonner à tout moment.
        </div>
      </div>
    </div>
  );
}
// Code pour le formulaire de feedback dans le footer qui n'est pas encore fonctionnel:

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import TeamGrid from '../../home/TeamGrid';


interface FeedbackFormState {
  name: string;
  email: string;
  message: string;
}

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState<FeedbackFormState>({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // Option 1 : Envoi via service backend
      // await contactService.sendFeedback(feedback);

      // Option 2 : Envoi via email client
      const subject = encodeURIComponent('Feedback from Avolta Website');
      const body = encodeURIComponent(
        `Name: ${feedback.name}\nEmail: ${feedback.email}\n\nMessage:\n${feedback.message}`
      );
      window.location.href = `mailto:contact@avolta.be?subject=${subject}&body=${body}`;

      // Réinitialisation du formulaire
      setFeedback({
        name: '',
        email: '',
        message: ''
      });

      setStatus({
        type: 'success', 
        message: 'Merci pour votre message. Nous vous répondrons bientôt !'
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire :', error);
      setStatus({
        type: 'error', 
        message: 'Une erreur est survenue. Veuillez réessayer.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof FeedbackFormState
  ) => {
    setFeedback(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <h3 className="text-white text-lg font-semibold mb-4">Donnez votre avis</h3>
      
      {status.type && (
        <div 
          className={`p-3 rounded-md ${
            status.type === 'success' 
              ? 'bg-green-600/20 text-green-400' 
              : 'bg-red-600/20 text-red-400'
          }`}
        >
          {status.message}
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Votre nom"
          value={feedback.name}
          onChange={(e) => handleInputChange(e, 'name')}
          className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Votre email"
          value={feedback.email}
          onChange={(e) => handleInputChange(e, 'email')}
          className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <textarea
          placeholder="Votre message"
          value={feedback.message}
          onChange={(e) => handleInputChange(e, 'message')}
          className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6A0DAD] min-h-[100px]"
          required
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#6A0DAD] text-white py-2 px-4 rounded-md hover:bg-[#5a0b91] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {isLoading ? (
          <svg 
            className="animate-spin h-5 w-5 text-white" 
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
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Envoyer</span>
          </>
        )}
      </button>

      <div>
      <TeamGrid/>
      </div>
    </form>
    
  );
}
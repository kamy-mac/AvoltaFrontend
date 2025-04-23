import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';
import newsletterService from '../../services/newsletter.service';

// Importation dynamique du logo
import logoAvolta from '/public/images/LOGO_AVOLTA_FL_CORE_RGB.jpg';
import logoAutogrillByAvolta from '/public/images/Autogrill.png';


function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
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
      await newsletterService.subscribe({ 
        email, 
        firstName 
      });

      setStatus({
        type: 'success', 
        message: 'Merci de vous être abonné à notre newsletter !'
      });
      
      // Réinitialisation du formulaire
      setEmail('');
      setFirstName('');
    } catch (error: any) {
      console.error('Erreur d\'inscription à la newsletter :', error);
      setStatus({
        type: 'error', 
        message: error.response?.data?.message || 'Échec de l\'inscription. Veuillez réessayer.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {status.type && (
        <div 
          className={`p-3 rounded-md text-sm ${
            status.type === 'success' 
              ? 'bg-green-600/20 text-green-400' 
              : 'bg-red-600/20 text-red-400'
          }`}
        >
          {status.message}
        </div>
      )}
      
      <div className="flex space-x-2">
        <input 
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Prénom (optionnel)" 
          className="w-1/3 px-3 py-2 bg-gray-800 text-white rounded-md"
        />
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email" 
          className="w-2/3 px-3 py-2 bg-gray-800 text-white rounded-md"
          required 
        />
      </div>
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Inscription en cours...' : 'S\'abonner'}
      </button>
    </form>
  );
}

export default function Footer() {
  const socialLinks = [
    { 
      icon: Facebook, 
      href: 'https://www.facebook.com/avolta', 
      label: 'Facebook' 
    },
    { 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/company/avolta', 
      label: 'LinkedIn' 
    },
    { 
      icon: Twitter, 
      href: 'https://www.twitter.com/avolta', 
      label: 'Twitter' 
    }
  ];

  const navigationLinks = {
    about: [
      { label: 'Notre histoire', href: 'https://www.avoltaworld.com/en/meet-avolta' },
      { label: 'Notre équipe', href: '/contact' },
      { label: 'Carrières', href: 'https://www.avoltaworld.com/en/careers' },
      { label: 'Partenaires', href: 'https://www.avoltaworld.com/en/travelers/brand-portfolio' }

    ],
    legal: [
      { label: ' Service Client', href: 'https://www.avoltaworld.com/en/travelers/customer-service' },
      { label: 'Conditions', href: 'https://www.avoltaworld.com/en/terms' },
      { label: 'Confidentialité , RGPD Cookies', href: 'https://www.avoltaworld.com/en/privacy-cookie' }
    ]
  };

  return (
    <footer className="bg-night text-day/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Contact */}
          <div>
            <h3 className="text-day text-lg font-display font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary" />
                <a 
                  href="mailto:contact@avolta.be" 
                  className="hover:text-day transition-colors"
                >
                  contact@avolta.be
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary" />
                <a 
                  href="tel:+32123456789" 
                  className="hover:text-day transition-colors"
                >
                  +32 123 456 789
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                <span>Brussels Airport, Belgium</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-day text-lg font-display font-semibold mb-4">Newsletter</h3>
            <p className="text-day/60 mb-4">
              Restez informé des dernières actualités et événements d'Avolta Belgique.
            </p>
            <NewsletterForm />
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-day text-lg font-display font-semibold mb-4">À propos</h3>
                <ul className="space-y-2">
                  {navigationLinks.about.map((link) => (
                    <li key={link.label}>
                      <a 
                        href={link.href} 
                        className="hover:text-day transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-day text-lg font-display font-semibold mb-4">Légal</h3>
                <ul className="space-y-2">
                  {navigationLinks.legal.map((link) => (
                    <li key={link.label}>
                      <a 
                        href={link.href} 
                        className="hover:text-day transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-night-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <a href="/" className="flex items-center">
                <img
                  src={logoAvolta}
                  alt="Logo Avolta"
                  className="w-40 h-10"
                />
              </a>

              <a href="/" className="flex items-center">
                <img
                  src={logoAutogrillByAvolta}
                  alt="LogoAutogrill By Avolta"
                  className="w-40 h-10"
                />
              </a>
            </div>

            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-day/60 hover:text-day transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-day/40">
            © {new Date().getFullYear()} Avolta Belgique. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}
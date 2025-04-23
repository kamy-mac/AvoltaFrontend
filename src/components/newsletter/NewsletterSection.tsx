import React, { useState, useEffect, useRef } from "react";
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowRight, Bell, Shield, Star, Gift } from "lucide-react";
import newsletterService from "../../services/newsletter.service";

// Animation pour afficher progressivement les éléments au défilement
const useIntersectionObserver = (options = {}): [React.MutableRefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formRef, isFormVisible] = useIntersectionObserver();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await newsletterService.subscribe({
        email,
        firstName,
        lastName,
      });

      setSuccess("Merci de vous être abonné à notre newsletter !");
      setEmail("");
      setFirstName("");
      setLastName("");
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
    <form
      ref={formRef as React.RefObject<HTMLFormElement>}
      onSubmit={handleSubmit}
      className={`space-y-5 ${className} ${isFormVisible ? 'animate-slideUp' : 'opacity-0'}`}
      aria-labelledby="newsletter-form-title"
    >
      {error && (
        <div
          className="flex items-center p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md text-red-600 text-sm transform transition-all duration-300 hover:translate-x-1"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div
          className="flex items-center p-4 bg-green-50 border-l-4 border-green-500 rounded-r-md text-green-600 text-sm transform transition-all duration-300 hover:translate-x-1"
          role="alert"
        >
          <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-night/80 flex items-center">
          Email professionnel <span className="text-primary ml-1">*</span>
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm"
            required
            aria-required="true"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary">
            <Mail className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-night/80"
          >
            Prénom
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-night/80"
          >
            Nom
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 px-6 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-lg hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            Inscription en cours...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            Je m'abonne
            <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </button>

      <p className="text-xs text-night/50 mt-3 italic">
        <span className="text-primary">*</span> Champ obligatoire. En vous inscrivant, vous acceptez notre{" "}
        <a href="#" className="text-primary hover:underline">politique de confidentialité</a>.
      </p>
    </form>
  );
}

export default function NewsletterSection() {
  const [titleRef, isTitleVisible] = useIntersectionObserver();
  const [strategyRef, isStrategyVisible] = useIntersectionObserver();
  const [cardRef, isCardVisible] = useIntersectionObserver();
  const [decorRef, isDecorVisible] = useIntersectionObserver();

  // Icons pour les avantages
  const benefitIcons = [
    <Star className="w-5 h-5 text-primary" />,
    <Bell className="w-5 h-5 text-primary" />,
    <Gift className="w-5 h-5 text-primary" />,
    <Shield className="w-5 h-5 text-primary" />
  ];

  return (
    <section className="pt-8 bg-gradient-to-br from-sand to-sand/70 relative overflow-hidden">
      {/* Decorative Elements avec animation */}
      <div
        ref={decorRef}
        className={`absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${isDecorVisible ? 'opacity-100' : 'opacity-0 translate-x-[-30%]'}`}
        aria-hidden="true"
      />
      <div
        className={`absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 transition-all duration-1000 delay-200 ${isDecorVisible ? 'opacity-100' : 'opacity-0 translate-x-[30%]'}`}
        aria-hidden="true"
      />
      <div className="absolute top-1/3 right-10 w-24 h-24 bg-primary/10 rounded-full blur-xl" aria-hidden="true"></div>
      <div className="absolute bottom-1/4 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl" aria-hidden="true"></div>

      {/* Container Avolta Stratégie avec animations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 mb-20">
        <div 
          ref={strategyRef}
          className={`flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl transition-all duration-1000 ${isStrategyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Côté gauche - Fond violet avec dégradé deux tons */}
          <div className="w-full md:w-2/5 relative flex items-center">
            {/* Premier ton de violet (plus foncé) */}
            <div className="absolute inset-0 bg-primary"></div>
            
            {/* Deuxième ton de violet (plus clair) */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-100"></div>
            
            {/* Effet de vagues ou courbes subtiles */}
            <div className="absolute right-0 h-full w-2/4 bg-gradient-to-l from-[#F5F3ED] to-transparent rounded-l-[60px]"></div>
            
            {/* Pattern design pour plus de style */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" className="absolute inset-0">
                <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                  <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
              </svg>
            </div>
            
            {/* Contenu texte */}
            <div className="p-8 md:p-10 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Notre stratégie :<br />
                <span className="relative">
                  Destination 2027
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-white/30 rounded-full"></span>
                </span>
              </h2>
              <p className="text-white/90 mt-4 text-sm md:text-base">
                Découvrez comment Avolta transforme l'expérience de voyage à travers sa vision stratégique pour les années à venir.
              </p>
              <a 
                href="https://www.avoltaworld.com/en/meet-avolta/our-strategy" 
                className="inline-flex items-center text-white mt-6 hover:underline group"
              >
                En savoir plus
                <svg className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Côté droit - Image avec overlay et effet */}
          <div className="w-full md:w-3/5 h-72 md:h-96 relative overflow-hidden group">
            <img
              src="public/images/Destination 2027_composant .jpeg"
              alt="Personne au sommet d'une montagne contemplant le paysage"
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60"></div>
            
            {/* Badge flottant */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full shadow-lg font-medium text-sm">
              Vision 2027
            </div>
          </div>
        </div>
      </div>

      <section className="pt-10 pb-10 bg-primary">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div 
          ref={cardRef} 
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-1000 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] ${isCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="p-8 lg:p-12 lg:col-span-7">
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-1 bg-primary rounded-full mr-4"
                  aria-hidden="true"
                />
                <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                  Newsletter
                </span>
              </div>

              <h2
                ref={titleRef}
                id="newsletter-section-title"
                className={`style-audacieux text-night text-3xl lg:text-4xl font-bold mb-6 tracking-tight transition-all duration-1000 ${isTitleVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
              >
                Restez connecté avec Avolta
              </h2>

              <p className="text-night/70 mb-8 max-w-md text-lg leading-relaxed">
                Inscrivez-vous à notre newsletter pour recevoir les dernières
                actualités, événements et informations d'Avolta Belgique
                directement dans votre boîte de réception.
              </p>

              <NewsletterForm className="max-w-md" />

              <div className="mt-8 text-sm text-night/60 flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-primary/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m0 0v2m0-2h2m-2 0H9m1-4a1 1 0 100-2 1 1 0 000 2z"
                  />
                </svg>
                Nous respectons votre vie privée. Vous pouvez vous désabonner à
                tout moment.
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-5 relative group">
              <img
                src="/public/images/tyler-nix-sh3LSNbyj7k-unsplash_774x550.jpg"
                alt="Newsletter Avolta"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center group-hover:backdrop-blur-none transition-all duration-500">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-xs shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-4 text-center">
                    Pourquoi s'abonner ?
                  </h3>
                  <ul className="space-y-4 text-night/80">
                    {[
                      "Actualités exclusives du secteur",
                      "Invitations aux événements à venir",
                      "Offres spéciales et promotions",
                      "Contenu premium et analyses",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start group/item">
                        <span className="mr-3 flex-shrink-0 mt-0.5 p-1 bg-primary/10 rounded-full group-hover/item:bg-primary/20 transition-colors duration-300">
                          {benefitIcons[index]}
                        </span>
                        <span className="group-hover/item:text-primary/90 transition-colors duration-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS pour les animations personnalisées */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-slideUp,
          .transition-all,
          .transition-transform,
          .transition-colors {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
     

    </section>
    </section>
  );
}
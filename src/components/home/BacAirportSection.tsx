/**
 * BAC Airport Section Component
 * 
 * This component displays a section on the homepage for BAC Airport personnel
 * with a link to a protected area.
 * 
 * @module components/home/BacAirportSection
 */

import { useState, useEffect, useRef } from 'react';
import { Building2, Lock, ArrowRight, Shield, Bell, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LazyImage } from '../../utils/lazyLoad';

export default function BacAirportSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="pb-24 pt-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 translate-y-1/2" />
      
     
      {/* Airport silhouette */}
      <div className="absolute bottom-0 right-0 w-full h-80 bg-contain bg-right-bottom bg-no-repeat opacity-90 pointer-events-none rounded-3xl overflow-hidden"
           style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1530521954074-e64f6810b32d")' }}>
      </div>

     
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className={`lg:col-span-5 transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center px-4 py-1 bg-primary/10 rounded-full mb-6">
              <Shield className="w-4 h-4 text-primary mr-2" />
              <span className="text-primary text-sm font-medium">Espace Réservé</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-night mb-6 relative">
              BAC Airport <span className="text-primary">Personnel</span>
              <div className="absolute -bottom-3 left-0 w-24 h-1 bg-primary rounded-full"></div>
            </h2>
            
            <p className="text-night/70 mb-8 max-w-lg text-lg">
              Un espace dédié aux employés de Brussels Airport Company avec des actualités, 
              des événements et des informations exclusives pour le personnel de BAC.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-night font-semibold mb-1">Actualités internes</h3>
                  <p className="text-night/60 text-sm">Restez informé des dernières évolutions</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-night font-semibold mb-1">Événements</h3>
                  <p className="text-night/60 text-sm">Calendrier des activités à venir</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-night font-semibold mb-1">Ressources RH</h3>
                  <p className="text-night/60 text-sm">Accès aux documents personnels</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-night font-semibold mb-1">Infrastructures</h3>
                  <p className="text-night/60 text-sm">Informations et plans des bâtiments</p>
                </div>
              </div>
            </div>
            
            <Link
              to="/bac-airport"
              className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-dark text-day font-medium rounded-full transition-colors shadow-lg hover:shadow-xl hover:shadow-primary/20"
            >
              Accéder à l'espace BAC
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className={`lg:col-span-7 lg:ml-8 transition-all duration-1000 delay-300 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              {/* Effet de bordure animée */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-blue-500/30 to-primary/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative rounded-3xl overflow-hidden">
                <LazyImage
                  src="public\images\newslette.jpg"
                  alt="Brussels Airport"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  aspectRatio="16/9"
                />
                
                {/* Overlay gradient avec effet angulaire */}
                <div className="absolute inset-0 bg-gradient-to-tr from-night/90 via-night/50 to-transparent flex items-end">
                  <div className="p-8 w-full">
                    <div className="flex items-center text-day mb-3">
                      <div className="bg-day/20 backdrop-blur-sm p-2 rounded-full mr-3">
                        <Lock className="w-5 h-5 text-day" />
                      </div>
                      <span className="font-semibold text-lg">Accès sécurisé</span>
                    </div>
                    <p className="text-day/90 text-base mb-4 max-w-md">
                      Cet espace est réservé au personnel de Brussels Airport Company.
                      Un code d'accès est requis pour accéder aux fonctionnalités complètes.
                    </p>
                    
                    {/* Badge de sécurité */}
                    <div className="inline-flex items-center px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-day text-sm">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Authentification à double facteur</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indicateurs d'accès */}
            <div className="mt-6 flex justify-end space-x-2">
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Portail en ligne
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Application mobile
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
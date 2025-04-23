/**
 * Beekeeper Connection Section
 *
 * This component displays a section for connecting to Beekeeper with a QR code.
 *
 * @module components/home/GallerySection
 */

import {
  ArrowRight,
  Smartphone,
  Users,
  Bell,
  MessageSquare,
} from "lucide-react";

export default function GallerySection() {
  return (
    <section className="bg-night">

      {/* Decorative Elements  */}
      {/* <!-- Container Avolta Journey avec Tailwind CSS --> */}
      <section className="py-10 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start">
            {/* <!-- Text Content --> */}
            <div className="w-full lg:w-2/5 pr-0 lg:pr-8 mb-8 lg:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                Continuez votre voyage.
              </h2>
              <div className="text-white text-opacity-90 mb-8">
                <p>
                  Chez Avolta, nous plaçons les voyageurs au cœur de notre
                  activité. Réactifs face à l'évolution de leurs besoins, nous
                  offrons une valeur inégalée à chaque étape de leur voyage,
                  avec pour mission ultime de réinventer le voyage ensemble.
                  Nous faisons de chaque voyage une expérience aussi
                  enrichissante que la destination.
                </p>
              </div>
              <a
                href="https://www.avoltaworld.com/en/meet-avolta"
                className="inline-flex items-center px-6 py-2 border border-white rounded-full text-sm font-medium text-white bg-transparent hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
              >
                Découvrez notre histoire
              </a>
            </div>

            {/* <!-- Images Container --> */}
            <div className="w-full lg:w-3/5 grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden h-48 sm:h-64 md:h-72">
                <img
                  src="public\images\image decouvre histoire container.jpg"
                  alt="Femme avec des écouteurs et des lunettes de soleil"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden h-48 sm:h-64 md:h-72">
                <img
                  src="public\images\continuez votre voyage container.jpg"
                  alt="Fenêtre d'avion vue de l'intérieur"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-1 bg-primary rounded-full mr-4" />
              <span className="text-primary font-medium">Restez connecté</span>
            </div>
            <h2 className="text-4xl font-bold text-day">
              Rejoignez-nous sur Beekeeper
            </h2>
          </div>
          <a
            href="https://www.beekeeper.io/de/beekeeper-app/?utm_source=ppc&utm_medium=paid&utm_campaign=7014y000001ov0ZAAQ&utm_source=bing&utm_medium=paid&utm_campaign=1+%7C+Falcon+-+Pure+Brand+-+%28Germany%29&utm_term=beekeeper&utm_ad=falcon_brand_pure_brand&msclkid=72c000e786c514e3d220675bf93c1d9c"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center text-day hover:text-primary transition-colors"
          >
            <span className="mr-2">En savoir plus</span>
            <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-day/80 mb-8 text-lg">
              Beekeeper est notre plateforme de communication interne qui permet
              à tous les employés d'Avolta de rester connectés, de partager des
              informations et de collaborer efficacement, où qu'ils soient.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-night-800 p-6 rounded-xl">
                <Smartphone className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-day font-semibold text-lg mb-2">
                  Application Mobile
                </h3>
                <p className="text-day/70">
                  Accédez à Beekeeper depuis votre smartphone, où que vous
                  soyez.
                </p>
              </div>

              <div className="bg-night-800 p-6 rounded-xl">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-day font-semibold text-lg mb-2">
                  Communauté
                </h3>
                <p className="text-day/70">
                  Rejoignez vos collègues et participez aux discussions de
                  groupe.
                </p>
              </div>

              <div className="bg-night-800 p-6 rounded-xl">
                <Bell className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-day font-semibold text-lg mb-2">
                  Notifications
                </h3>
                <p className="text-day/70">
                  Recevez des alertes pour les annonces importantes et les
                  événements.
                </p>
              </div>

              <div className="bg-night-800 p-6 rounded-xl">
                <MessageSquare className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-day font-semibold text-lg mb-2">
                  Messagerie
                </h3>
                <p className="text-day/70">
                  Communiquez directement avec vos collègues via la messagerie
                  intégrée.
                </p>
              </div>
            </div>

            <a
              href="https://www.beekeeper.io/de/beekeeper-app/?utm_source=ppc&utm_medium=paid&utm_campaign=7014y000001ov0ZAAQ&utm_source=bing&utm_medium=paid&utm_campaign=1+%7C+Falcon+-+Pure+Brand+-+%28Germany%29&utm_term=beekeeper&utm_ad=falcon_brand_pure_brand&msclkid=72c000e786c514e3d220675bf93c1d9c"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-day font-medium rounded-full transition-colors"
            >
              Télécharger l'application
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
            <h3 className="text-2xl font-bold text-night mb-6 text-center">
              Scannez pour rejoindre
            </h3>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <img
                src="/public/images/Avolta-QR.png"
                alt="QR Code Beekeeper"
                className="w-64 h-64 object-contain"
              />
            </div>

            <div className="text-center">
              <p className="text-night/70 mb-2">
                Scannez ce code QR avec votre smartphone pour télécharger
                l'application Beekeeper et rejoindre l'espace Avolta.
              </p>
              <p className="text-primary font-medium">
                Connectez-vous avec vos identifiants d'entreprise
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

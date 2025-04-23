import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Clock, 
  Users, 
  Mail, 
  Settings, 
  Bell, 
  Shield, 
  PlusCircle,
  ChevronRight,
  BarChart2
} from 'lucide-react';
import TeamGrid from '../../components/home/TeamGrid';

export default function AdminDashboard() {
  const location = useLocation();
  const { user, isSuperAdmin } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Afficher l'écran de bienvenue uniquement sur le chemin exact /admin
  useEffect(() => {
    setShowWelcome(location.pathname === '/admin');
  }, [location.pathname]);

  // Fonctionnalités disponibles pour tous les administrateurs
  const adminFeatures = [
    {
      title: "Gestion des publications",
      description: "Créer, éditer et gérer les publications du site",
      icon: <FileText className="w-8 h-8 text-[#6A0DAD]" />,
      path: "/admin/publications",
    },
    {
      title: "Gestion de la newsletter",
      description: "Administrer les abonnés et envoyer des newsletters",
      icon: <Mail className="w-8 h-8 text-[#6A0DAD]" />,
      path: "/admin/newsletter",
    },
    {
      title: "Créer une publication",
      description: "Ajouter une nouvelle publication sur le site",
      icon: <PlusCircle className="w-8 h-8 text-[#6A0DAD]" />,
      path: "/admin/create",
    },
  ];

  // Fonctionnalités supplémentaires pour les super administrateurs
  const superAdminFeatures = [
    {
      title: "Publications en attente",
      description: "Valider ou rejeter les publications en attente",
      icon: <Clock className="w-8 h-8 text-[#6A0DAD]" />,
      path: "/admin/pending",
    },
    {
      title: "Gestion des utilisateurs",
      description: "Gérer les comptes administrateurs",
      icon: <Users className="w-8 h-8 text-[#6A0DAD]" />,
      path: "/admin/users",
    },
  ];

  // Bannière d'accueil
  const WelcomeBanner = () => (
    <div className="bg-gradient-to-r from-[#6A0DAD]/10 to-[#6A0DAD]/5 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex items-center">
        <div className="bg-[#6A0DAD]/20 p-4 rounded-full mr-6">
          <Shield className="w-10 h-10 text-[#6A0DAD]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Bienvenue, {user?.username || user?.email?.split('@')[0] || 'Administrateur'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isSuperAdmin 
              ? "Vous êtes connecté en tant que Super Administrateur avec tous les privilèges." 
              : "Vous êtes connecté en tant qu'Administrateur."}
          </p>
        </div>
      </div>
    </div>
  );

  // Tableau de statistiques simplifié
  const StatisticsDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Publications</h3>
            <p className="text-3xl font-bold text-[#6A0DAD] mt-2">+</p>
          </div>
          <div className="bg-[#6A0DAD]/10 p-3 rounded-full">
            <FileText className="w-6 h-6 text-[#6A0DAD]" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Abonnés</h3>
            <p className="text-3xl font-bold text-[#6A0DAD] mt-2">+</p>
          </div>
          <div className="bg-[#6A0DAD]/10 p-3 rounded-full">
            <Mail className="w-6 h-6 text-[#6A0DAD]" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {isSuperAdmin ? "En attente" : "Visites"}
            </h3>
            <p className="text-3xl font-bold text-[#6A0DAD] mt-2">
              {isSuperAdmin ? "+" : "+"}
            </p>
          </div>
          <div className="bg-[#6A0DAD]/10 p-3 rounded-full">
            {isSuperAdmin 
              ? <Bell className="w-6 h-6 text-[#6A0DAD]" />
              : <BarChart2 className="w-6 h-6 text-[#6A0DAD]" />
            }
          </div>
        </div>
      </div>
    </div>
  );

  // Carte de fonctionnalité
  const FeatureCard = ({ feature }: { feature: typeof adminFeatures[0] }) => (
    <a 
      href={feature.path} 
      className="bg-primary/5 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] flex flex-col h-full"
    >
      <div className="flex items-start">
        <div className="bg-[#6A0DAD]/10 p-3 rounded-xl mr-4">
          {feature.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-[#6A0DAD] opacity-40" />
      </div>
    </a>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="py-10">
        {showWelcome ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <WelcomeBanner />
            <StatisticsDashboard />
            
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Settings className="w-5 h-5 text-[#6A0DAD] mr-2" />
                Fonctionnalités disponibles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 " >
                {adminFeatures.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
                
                {isSuperAdmin && superAdminFeatures.map((feature, index) => (
                  <FeatureCard key={`super-${index}`} feature={feature} />
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 text-[#6A0DAD] mr-2" />
                Notre équipe
              </h2>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <TeamGrid />
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
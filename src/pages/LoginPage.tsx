/**
 * Login Page
 * 
 * This component provides a login form for users to authenticate.
 * 
 * @module pages/LoginPage
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, UserCheck, ShieldCheck, FileText, Bell, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import avoltaLogo from '../../public/images/LOGO_AVOLTA_FL_CORE_RGB.jpg';


/**
 * Login page component
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {/* Logo Avolta remplace l'ancien logo */}
          <img 
            src={avoltaLogo} 
            alt="Avolta Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion Administrateur
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Accédez au tableau de bord d'administration d'Avolta
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                  placeholder="votre@email.com"
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6A0DAD] hover:bg-[#5a0b91] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A0DAD] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>
          
          {/* Guide d'utilisation avec design amélioré */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Guide d'utilisation</h3>
            
            <div className="rounded-lg bg-gray-50 p-4 mb-4 hover:bg-purple-50 transition-colors duration-200">
              <h4 className="flex items-center text-md font-medium text-gray-800 mb-2">
                <UserCheck className="h-5 w-5 mr-2 text-[#6A0DAD]" />
                Administrateur
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 pl-7 list-disc">
                <li>Créer des publications (soumises à validation par un super administrateur)</li>
                <li>Gérer vos propres publications</li>
                <li>Administrer la newsletter et les abonnés</li>
              </ul>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4 hover:bg-purple-50 transition-colors duration-200">
              <h4 className="flex items-center text-md font-medium text-gray-800 mb-2">
                <ShieldCheck className="h-5 w-5 mr-2 text-[#6A0DAD]" />
                Super Administrateur
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 pl-7 list-disc">
                <li>Toutes les fonctionnalités des administrateurs</li>
                <li>Valider ou rejeter les publications en attente</li>
                <li>Gérer les comptes administrateurs</li>
                <li>Publier directement sans validation</li>
              </ul>
            </div>
            

            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                <FileText className="h-6 w-6 text-[#6A0DAD] mr-2" />
                <span className="text-xs text-gray-700">Gestion des publications</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                <Bell className="h-6 w-6 text-[#6A0DAD] mr-2" />
                <span className="text-xs text-gray-700">Administration newsletter</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                <Users className="h-6 w-6 text-[#6A0DAD] mr-2" />
                <span className="text-xs text-gray-700">Gestion des utilisateurs</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                <ShieldCheck className="h-6 w-6 text-[#6A0DAD] mr-2" />
                <span className="text-xs text-gray-700">Validation contenu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
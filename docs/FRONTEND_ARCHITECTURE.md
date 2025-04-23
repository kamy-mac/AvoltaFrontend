# Architecture du Frontend - Avolta Belgique

Ce document décrit l'architecture du frontend React pour l'application Avolta Belgique.

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Structure du projet](#2-structure-du-projet)
3. [Composants](#3-composants)
4. [Gestion d'état](#4-gestion-détat)
5. [Services](#5-services)
6. [Routage](#6-routage)
7. [Internationalisation](#7-internationalisation)
8. [Styles](#8-styles)
9. [Tests](#9-tests)

## 1. Vue d'ensemble

Le frontend de l'application Avolta Belgique est construit avec React 18 et TypeScript. Il utilise une architecture basée sur les composants avec une séparation claire des responsabilités. L'application communique avec le backend via une API REST et utilise des services centralisés pour gérer les appels API.

### 1.1. Technologies principales

- **React 18**: Bibliothèque UI
- **TypeScript**: Typage statique
- **React Router**: Routage
- **Axios**: Client HTTP
- **i18next**: Internationalisation
- **Tailwind CSS**: Framework CSS
- **Lucide React**: Icônes
- **Jest**: Tests unitaires
- **React Testing Library**: Tests de composants

## 2. Structure du projet

```
frontend/
├── public/                  # Ressources statiques
├── src/
│   ├── components/          # Composants React
│   │   ├── admin/           # Composants pour l'interface d'administration
│   │   ├── auth/            # Composants liés à l'authentification
│   │   ├── common/          # Composants réutilisables
│   │   ├── home/            # Composants pour la page d'accueil
│   │   ├── layout/          # Composants de mise en page
│   │   └── newsletter/      # Composants liés à la newsletter
│   ├── context/             # Contextes React
│   ├── hooks/               # Hooks personnalisés
│   ├── pages/               # Pages de l'application
│   │   ├── admin/           # Pages d'administration
│   │   └── ...              # Autres pages
│   ├── services/            # Services pour les appels API
│   ├── tests/               # Tests
│   ├── types/               # Types TypeScript
│   ├── utils/               # Utilitaires
│   ├── App.tsx              # Composant racine
│   ├── index.css            # Styles globaux
│   ├── main.tsx             # Point d'entrée
│   └── ...
├── .env                     # Variables d'environnement
├── package.json             # Dépendances
├── tsconfig.json            # Configuration TypeScript
└── vite.config.ts           # Configuration Vite
```

## 3. Composants

L'application est organisée en composants réutilisables qui suivent le principe de responsabilité unique. Les composants sont regroupés par fonctionnalité ou par domaine.

### 3.1. Composants de page

Les composants de page représentent des vues complètes de l'application et sont directement liés aux routes. Ils orchestrent les composants plus petits pour former une interface utilisateur cohérente.

Exemple de composant de page:

```tsx
/**
 * News Page
 * 
 * This component displays a list of news articles.
 * 
 * @module pages/NewsPage
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import publicationService from '../services/publication.service';
import NewsCard from '../components/news/NewsCard';
import { Post } from '../types';
import { Calendar, AlertCircle } from 'lucide-react';

export default function NewsPage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState<'news' | 'events'>('news');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await publicationService.getActivePublications();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // ... reste du composant
}
```

### 3.2. Composants réutilisables

Les composants réutilisables sont des éléments d'interface utilisateur plus petits qui peuvent être utilisés dans plusieurs pages ou contextes.

Exemple de composant réutilisable:

```tsx
/**
 * News Card Component
 * 
 * This component displays a card for a news article.
 * 
 * @module components/news/NewsCard
 */

import React from 'react';
import { Calendar, Heart, MessageCircle, Share2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post } from '../../types';

interface NewsCardProps {
  post: Post;
}

export default function NewsCard({ post }: NewsCardProps) {
  return (
    <Link 
      to={`/news/${post.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Contenu de la carte */}
    </Link>
  );
}
```

### 3.3. Composants de mise en page

Les composants de mise en page définissent la structure globale de l'application, comme l'en-tête, le pied de page et la navigation.

Exemple de composant de mise en page:

```tsx
/**
 * Header Component
 * 
 * This component displays the main navigation header of the application.
 * 
 * @module components/layout/Header
 */

import React from 'react';
import { Menu, Search, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // ... reste du composant
}
```

## 4. Gestion d'état

### 4.1. Contexte React

L'application utilise le Context API de React pour gérer l'état global, comme l'authentification et les préférences utilisateur.

Exemple de contexte d'authentification:

```tsx
/**
 * Authentication Context
 * 
 * This module provides a React context for managing authentication state.
 * 
 * @module context/AuthContext
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import authService from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... implémentation du contexte

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated, 
      isSuperAdmin,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 4.2. État local

Pour l'état spécifique aux composants, l'application utilise le hook `useState` de React.

```tsx
function NewsFilter() {
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ... reste du composant
}
```

### 4.3. Effets secondaires

Les effets secondaires, comme les appels API, sont gérés avec le hook `useEffect` de React.

```tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await publicationService.getActivePublications();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);
```

## 5. Services

Les services encapsulent la logique d'accès aux données et les appels API. Ils fournissent une interface claire pour interagir avec le backend.

### 5.1. Service API

Le service API est un wrapper autour d'Axios qui gère les requêtes HTTP, l'authentification et la gestion des erreurs.

```typescript
/**
 * API Service
 * 
 * This module provides a centralized API client for making HTTP requests.
 * 
 * @module services/api
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // ... configuration du client
  }

  // ... méthodes pour les requêtes HTTP
}

// Create and export a singleton instance
const api = new ApiClient();
export default api;
```

### 5.2. Services métier

Les services métier utilisent le service API pour effectuer des opérations spécifiques au domaine.

```typescript
/**
 * Publication Service
 * 
 * This module provides functionality for managing publications.
 * 
 * @module services/publication
 */

import api from './api';
import { Post } from '../types';

class PublicationService {
  /**
   * Get active publications (public)
   * @returns List of active publications
   */
  public async getActivePublications(): Promise<Post[]> {
    try {
      const response = await api.get<ApiResponse<Post[]>>('/publications/public/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active publications:', error);
      throw error;
    }
  }

  // ... autres méthodes
}

const publicationService = new PublicationService();
export default publicationService;
```

## 6. Routage

L'application utilise React Router pour gérer la navigation entre les différentes pages.

### 6.1. Configuration des routes

```tsx
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route path="create" element={<CreatePublication />} />
            <Route path="publications" element={<Publications />} />
            <Route path="publications/edit/:id" element={<EditPublication />} />
            <Route path="pending" element={
              <SuperAdminRoute>
                <PendingPublications />
              </SuperAdminRoute>
            } />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="users" element={
              <SuperAdminRoute>
                <UserManagement />
              </SuperAdminRoute>
            } />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
```

### 6.2. Routes protégées

Les routes protégées sont des composants qui vérifient l'authentification et les autorisations avant de rendre leurs enfants.

```tsx
/**
 * Protected Route Component
 * 
 * This component restricts access to routes based on authentication status.
 * 
 * @module components/auth/ProtectedRoute
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

## 7. Internationalisation

L'application utilise i18next pour gérer l'internationalisation et la traduction.

### 7.1. Configuration i18next

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';
import translationNL from './locales/nl.json';

const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  },
  nl: {
    translation: translationNL
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### 7.2. Utilisation des traductions

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('header.news')}</h1>
      <p>{t('news.readMore')}</p>
    </div>
  );
}
```

## 8. Styles

L'application utilise Tailwind CSS pour le styling.

### 8.1. Configuration Tailwind

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8F53F0',
          dark: '#7B3FDC'
        },
        sand: '#F5F3ED',
        day: '#FFFFFF',
        night: '#373737'
      },
      fontFamily: {
        sans: ['Saans', 'sans-serif'],
        display: ['Avolta Display', 'serif']
      },
      // ... autres extensions
    },
  },
  plugins: [],
}
```

### 8.2. Utilisation des classes Tailwind

```tsx
<button
  className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-day font-medium rounded-full transition-colors"
>
  Contactez-nous
  <ArrowRight className="ml-2 w-5 h-5" />
</button>
```

### 8.3. Polices personnalisées

```css
/* Avolta Display Font */
@font-face {
  font-family: 'Avolta Display';
  src: url('./fonts/AvoltaDisplay-SemiBold.otf') format('opentype'),
       url('./fonts/AvoltaDisplay-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* Saans Font */
@font-face {
  font-family: 'Saans';
  src: url('./fonts/Saans-Light.otf') format('opentype'),
       url('./fonts/Saans-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

/* ... autres déclarations de police */
```

## 9. Tests

L'application utilise Jest et React Testing Library pour les tests.

### 9.1. Tests de composants

```tsx
/**
 * Tests for ProtectedRoute component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';

// Mock the auth context
jest.mock('../../../context/AuthContext');

describe('ProtectedRoute', () => {
  test('renders children when user is authenticated', () => {
    // Mock the auth context to return authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Check if the protected content is rendered
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  // ... autres tests
});
```

### 9.2. Tests de services

```typescript
/**
 * Tests for auth service
 */

import authService from '../../services/auth.service';
import api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login should call API and set token', async () => {
    // Mock API response
    const mockResponse = {
      token: 'test-token',
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'admin',
        createdAt: new Date(),
        status: 'active'
      }
    };
    
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    // Call login
    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123'
    });

    // Check if API was called correctly
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });

    // ... autres assertions
  });

  // ... autres tests
});
```

### 9.3. Configuration Jest

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    
    // Handle CSS imports (without CSS modules)
    '\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // ... autres configurations
};
```

---

Ce document fournit une vue d'ensemble de l'architecture du frontend de l'application Avolta Belgique. Pour plus de détails sur des composants spécifiques, veuillez consulter la documentation du code source.
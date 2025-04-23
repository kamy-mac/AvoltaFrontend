# Guide d'Optimisation des Performances - Avolta Belgique

Ce document détaille les techniques d'optimisation mises en œuvre pour améliorer les performances de l'application Avolta Belgique.

## Table des matières

1. [Optimisation du chargement initial](#1-optimisation-du-chargement-initial)
2. [Optimisation des images](#2-optimisation-des-images)
3. [Code splitting et lazy loading](#3-code-splitting-et-lazy-loading)
4. [Optimisation des polices](#4-optimisation-des-polices)
5. [Mise en cache et Service Worker](#5-mise-en-cache-et-service-worker)
6. [Optimisation du build](#6-optimisation-du-build)
7. [Optimisation SEO](#7-optimisation-seo)
8. [Mesures et surveillance](#8-mesures-et-surveillance)

## 1. Optimisation du chargement initial

### 1.1. CSS critique

Nous avons extrait le CSS critique nécessaire au rendu initial de la page et l'avons intégré directement dans le HTML pour éviter un rendu sans style (FOUC - Flash of Unstyled Content).

```html
<style>
  /* CSS critique pour le contenu visible immédiatement */
  :root {
    --primary: #8F53F0;
    --primary-dark: #7B3FDC;
    --sand: #F5F3ED;
    --day: #FFFFFF;
    --night: #373737;
  }
  
  body {
    margin: 0;
    font-family: 'Saans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Indicateur de chargement */
  .initial-loader {
    /* ... */
  }
</style>
```

### 1.2. Indicateur de chargement initial

Nous avons ajouté un indicateur de chargement initial dans le HTML pour améliorer l'expérience utilisateur pendant le chargement de l'application.

```html
<div id="root">
  <!-- État de chargement initial -->
  <div class="initial-loader">
    <div class="initial-loader__spinner"></div>
  </div>
</div>
```

### 1.3. Préconnexion aux domaines externes

Nous utilisons `<link rel="preconnect">` pour établir des connexions anticipées aux domaines externes, réduisant ainsi le temps nécessaire pour charger les ressources de ces domaines.

```html
<link rel="preconnect" href="https://images.unsplash.com" />
```

## 2. Optimisation des images

### 2.1. Lazy loading des images

Nous avons implémenté un composant `LazyImage` qui utilise l'Intersection Observer API pour charger les images uniquement lorsqu'elles entrent dans le viewport.

```tsx
export const LazyImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { 
  placeholderSrc?: string;
  aspectRatio?: string;
}> = ({ 
  src, 
  alt, 
  className, 
  placeholderSrc = 'data:image/svg+xml,...',
  aspectRatio = '16/9',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (!imgRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    
    observer.observe(imgRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // ... reste du composant
};
```

### 2.2. Optimisation des formats d'image

Nous utilisons des formats d'image modernes comme WebP pour réduire la taille des fichiers tout en maintenant une bonne qualité.

```ts
export function getOptimizedImageUrl(url: string, width: number = 800, format: 'webp' | 'avif' | 'auto' = 'webp'): string {
  // Pour les images Unsplash, utiliser leur API d'optimisation intégrée
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&q=80&fm=${format === 'auto' ? 'webp' : format}&fit=crop`;
  }
  
  // Pour les autres images, retourner l'URL d'origine
  return url;
}
```

### 2.3. Images responsives

Nous générons des srcsets pour charger des images de tailles différentes selon la taille de l'écran.

```ts
export function generateSrcSet(url: string, sizes: number[] = [320, 640, 960, 1280], format: 'webp' | 'avif' | 'auto' = 'webp'): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(url, size, format)} ${size}w`)
    .join(', ');
}
```

### 2.4. Placeholders de basse qualité

Nous utilisons des placeholders de basse qualité pour améliorer l'expérience de chargement perçue.

```ts
export function getLowQualityPlaceholder(url: string): string {
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=20&q=10&blur=10`;
  }
  
  return url;
}
```

## 3. Code splitting et lazy loading

### 3.1. Lazy loading des composants

Nous utilisons `React.lazy` et `Suspense` pour charger les composants à la demande, réduisant ainsi la taille du bundle initial.

```tsx
// Lazy load des pages
const HomePage = lazyLoad(() => import('./pages/HomePage'));
const LoginPage = lazyLoad(() => import('./pages/LoginPage'));
// ... autres pages

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* ... autres routes */}
        </Routes>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <NewsletterPopup />
      </Suspense>
    </div>
  );
}
```

### 3.2. Utilitaire de lazy loading

Nous avons créé un utilitaire pour simplifier le lazy loading des composants.

```tsx
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): LazyExoticComponent<T> {
  const LazyComponent = lazy(importFunc);
  const { fallback = <DefaultLoading /> } = options;

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  ) as unknown as LazyExoticComponent<T>;
}
```

### 3.3. Chunking des dépendances

Nous avons configuré Vite pour diviser les dépendances en chunks logiques, permettant un meilleur caching et des temps de chargement réduits.

```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-vendor': ['lucide-react'],
        'i18n-vendor': ['i18next', 'react-i18next'],
      }
    }
  }
}
```

## 4. Optimisation des polices

### 4.1. Préchargement des polices critiques

Nous préchargeons les polices critiques pour éviter le FOUT (Flash of Unstyled Text).

```html
<link rel="preload" href="/src/fonts/AvoltaDisplay-SemiBold.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/src/fonts/Saans-Regular.woff2" as="font" type="font/woff2" crossorigin />
```

### 4.2. Utilisation du format WOFF2

Nous utilisons le format WOFF2 qui offre une meilleure compression que les autres formats de police.

```css
@font-face {
  font-family: 'Avolta Display';
  src: url('./fonts/AvoltaDisplay-SemiBold.woff2') format('woff2'),
       url('./fonts/AvoltaDisplay-SemiBold.otf') format('opentype'),
       url('./fonts/AvoltaDisplay-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

### 4.3. Stratégie de chargement des polices

Nous utilisons `font-display: swap` pour afficher le texte immédiatement avec une police de substitution, puis le remplacer par la police personnalisée une fois qu'elle est chargée.

## 5. Mise en cache et Service Worker

### 5.1. Service Worker

Nous avons implémenté un Service Worker pour mettre en cache les ressources statiques et permettre une expérience hors ligne.

```js
// Service Worker pour Avolta Belgique
const CACHE_NAME = 'avolta-cache-v1';

// Ressources à mettre en cache lors de l'installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/vite.svg',
  '/manifest.json'
];

// Événement d'installation - mise en cache des ressources statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ... autres gestionnaires d'événements
```

### 5.2. Stratégies de mise en cache

Nous utilisons différentes stratégies de mise en cache selon le type de ressource :

- **Network-first** pour les pages HTML
- **Cache-first** pour les ress ources statiques (JS, CSS, images)

```js
// Pour les pages HTML, utiliser la stratégie network-first
if (event.request.headers.get('accept').includes('text/html')) {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Mettre en cache la dernière version
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback vers le cache si le réseau échoue
        return caches.match(event.request);
      })
  );
  return;
}

// Pour les autres ressources, utiliser la stratégie cache-first
event.respondWith(
  caches.match(event.request)
    .then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request)
        .then(response => {
          // Mettre en cache la nouvelle ressource
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
    })
);
```

### 5.3. Manifest pour PWA

Nous avons ajouté un manifest pour permettre l'installation de l'application comme une PWA (Progressive Web App).

```json
{
  "name": "Avolta Belgique",
  "short_name": "Avolta",
  "description": "Solutions aéroportuaires innovantes pour les voyageurs",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#373737",
  "theme_color": "#8F53F0",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    // ... autres tailles d'icônes
  ]
}
```

## 6. Optimisation du build

### 6.1. Minification et compression

Nous utilisons Terser pour minifier le JavaScript et des plugins de compression pour générer des versions gzip et brotli des fichiers.

```js
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true
    }
  }
}
```

```js
plugins: [
  compression({
    algorithm: 'gzip',
    ext: '.gz',
  }),
  compression({
    algorithm: 'brotliCompress',
    ext: '.br',
  }),
]
```

### 6.2. Séparation du code CSS

Nous avons activé la séparation du code CSS pour générer des fichiers CSS distincts pour chaque chunk, permettant un chargement plus efficace.

```js
build: {
  cssCodeSplit: true,
}
```

### 6.3. Analyse de la taille du bundle

Nous avons ajouté un script pour analyser la taille du bundle et identifier les opportunités d'optimisation.

```json
"scripts": {
  "analyze": "vite build --mode analyze"
}
```

## 7. Optimisation SEO

### 7.1. Métadonnées

Nous avons ajouté des métadonnées appropriées pour améliorer le référencement.

```html
<meta name="description" content="Avolta Belgique - Solutions aéroportuaires innovantes pour les voyageurs" />
```

### 7.2. Sitemap

Nous avons créé un sitemap pour aider les moteurs de recherche à indexer le site.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://avolta.be/</loc>
    <lastmod>2025-03-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... autres URLs -->
</urlset>
```

### 7.3. Robots.txt

Nous avons ajouté un fichier robots.txt pour guider les robots des moteurs de recherche.

```
# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://avolta.be/sitemap.xml
```

## 8. Mesures et surveillance

### 8.1. Métriques Web Vitals

Nous recommandons de surveiller les métriques Web Vitals suivantes :

- **LCP (Largest Contentful Paint)** : mesure le temps de chargement du plus grand élément visible
- **FID (First Input Delay)** : mesure le temps de réponse à la première interaction utilisateur
- **CLS (Cumulative Layout Shift)** : mesure la stabilité visuelle

### 8.2. Outils de surveillance

Nous recommandons d'utiliser les outils suivants pour surveiller les performances :

- **Lighthouse** : pour des audits de performance réguliers
- **Google Analytics** : pour suivre les métriques de performance réelles
- **Google Search Console** : pour surveiller les performances SEO
- **WebPageTest** : pour des tests de performance détaillés

### 8.3. Stratégie d'amélioration continue

1. **Mesurer** : collecter régulièrement des données de performance
2. **Analyser** : identifier les goulots d'étranglement et les opportunités d'amélioration
3. **Optimiser** : mettre en œuvre des améliorations ciblées
4. **Répéter** : continuer le cycle pour maintenir et améliorer les performances

## Conclusion

L'optimisation des performances est un processus continu. Les techniques décrites dans ce document fournissent une base solide pour une application performante, mais il est important de continuer à surveiller et à optimiser en fonction des besoins spécifiques et de l'évolution de l'application.

Pour toute question ou suggestion concernant l'optimisation des performances, veuillez contacter l'équipe technique à support@avolta.be.
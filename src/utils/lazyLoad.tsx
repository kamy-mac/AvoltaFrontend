/**
 * Lazy Loading Utility
 * 
 * This module provides utilities for lazy loading components and images.
 * 
 * @module utils/lazyLoad
 */

import React, { lazy, Suspense, ComponentType, LazyExoticComponent } from 'react';

/**
 * Lazy loading options
 */
interface LazyLoadOptions {
  fallback?: React.ReactNode;
}

/**
 * Default loading component
 */
const DefaultLoading = () => (
  <div className="flex items-center justify-center p-4 h-full min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

/**
 * Lazy load a component with a suspense fallback
 * 
 * @param importFunc - Dynamic import function
 * @param options - Lazy loading options
 * @returns Lazy loaded component
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): LazyExoticComponent<T> {
  const LazyComponent = lazy(importFunc);
  const { fallback = <DefaultLoading /> } = options;

  const WrappedComponent: React.FC<React.ComponentProps<T>> = (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  return WrappedComponent as unknown as LazyExoticComponent<T>;
}

/**
 * Lazy image component that uses Intersection Observer to load images
 * only when they enter the viewport
 */
export const LazyImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { 
  placeholderSrc?: string;
  aspectRatio?: string;
}> = ({ 
  src, 
  alt, 
  className, 
  placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
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

  return (
    <div 
      className={`relative overflow-hidden ${className || ''}`} 
      style={{ aspectRatio }}
      ref={imgRef}
    >
      {/* Placeholder */}
      <img
        src={placeholderSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: isLoaded ? 0 : 1 }}
      />
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          {...props}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};
/**
 * Image Optimization Utility
 * 
 * This module provides utilities for optimizing images.
 * 
 * @module utils/imageOptimizer
 */

/**
 * Generate a responsive image URL with appropriate size and format
 * 
 * @param url - Original image URL
 * @param width - Desired width
 * @param format - Desired format (webp, avif, etc.)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(url: string, width: number = 800, format: 'webp' | 'avif' | 'auto' = 'webp'): string {
  // For Unsplash images, use their built-in optimization API
  if (url.includes('unsplash.com')) {
    // Extract the photo ID and add optimization parameters
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&q=80&fm=${format === 'auto' ? 'webp' : format}&fit=crop`;
  }
  
  // For other images, return the original URL
  // In a real application, you might want to use a CDN or image optimization service
  return url;
}

/**
 * Generate a responsive srcset for different screen sizes
 * 
 * @param url - Original image URL
 * @param sizes - Array of widths to generate
 * @param format - Image format
 * @returns srcset string
 */
export function generateSrcSet(url: string, sizes: number[] = [320, 640, 960, 1280], format: 'webp' | 'avif' | 'auto' = 'webp'): string {
  return sizes
    .map(size => `${getOptimizedImageUrl(url, size, format)} ${size}w`)
    .join(', ');
}

/**
 * Generate a low-quality image placeholder
 * 
 * @param url - Original image URL
 * @returns Low quality placeholder URL
 */
export function getLowQualityPlaceholder(url: string): string {
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=20&q=10&blur=10`;
  }
  
  return url;
}
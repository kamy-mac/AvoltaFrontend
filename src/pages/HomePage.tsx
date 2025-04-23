import Hero from '../components/home/Hero';
import NewsSection from '../components/home/NewsSection';
import VideoSection from '../components/home/VideoSection';
import GallerySection from '../components/home/GallerySection';
import TeamGrid from '../components/home/TeamGrid';
import NewsletterSection from '../components/newsletter/NewsletterSection';
import BacAirportSection from '../components/home/BacAirportSection';
import BrandCarousel from '../components/home/BrandCarousel';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
/*************  ✨ Codeium Command ⭐  *************/
/**
 * HomePage Component
 *
 * This is the main entry point for the application. It renders all the top-level
 * sections of the homepage, including the hero, news, brand carousel, BAC airport
 * section, video section, team grid, newsletter section, and gallery section.
 *
 * @module pages/HomePage
 */
/******  34057e7f-37a6-48b3-b1bd-34c1f5a84101  *******/
export default function HomePage() {
  const location = useLocation();

  // Handle navigation to specific sections via hash in the URL
  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash) {
      // Remove the # character
      const id = location.hash.substring(1);
      
      // Find the element with the matching ID
      const element = document.getElementById(id);
      
      // If found, scroll to it with offset for the fixed header
      if (element) {
        setTimeout(() => {
          const yOffset = -200; // Adjust based on your header height
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 300); // Small delay to ensure all elements are rendered
      }
    }
  }, [location.hash]);

  return (
    <div className="bg-day">
      <Hero />
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-night to-transparent" />
        <NewsSection />
        <BrandCarousel />
        <BacAirportSection />
        
        {/* Add IDs to each section for navigation */}
        <div id="video-section">
          <VideoSection />
        </div>
        
        <div id="team-section">
          <TeamGrid />
        </div>
        
        <div id="newsletter-section">
          <NewsletterSection />
        </div>
        
        <div id="gallery-section">
          <GallerySection />
        </div>
      </div>
    </div>
  );
}
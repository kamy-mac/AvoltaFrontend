import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Liste des marques/logos

  const brands = [
    {
      name: "Java Coffee",
      logo: "/images/logo_Java.jpg",
      alt: "Java Coffee Brussels Airport",
    },
    {
      name: "Starbucks",
      logo: "/images/logo_Starbucks.jpeg",
      alt: "Starbucks at Brussels Airport",
    },
    {
      name: "Quick",
      logo: "/images/logo_Quick.jpeg",
      alt: "Quick Brussels Airport",
    },
    {
      name: "Belle&Belge",
      logo: "/images/Logo_belle_and_belge.jpg",
      alt: "Belle&Belge at Brussels Airport",
    },
    {
      name: "HI Brussels",
      logo: "/images/Logo_HI_Brussels.jpg",
      alt: "HI Brussels Italian Food",
    },
    {
      name: "Burger King",
      logo: "/images/Logo_burger_king.jpeg",
      alt: "Burger King at Brussels Airport",
    },
    {
      name: "Panos",
      logo: "/images/logo_Panos.jpeg",
      alt: "Panos at Brussels Airport",
    },
    {
      name: "Exki",
      logo: "/images/Logo_Exki.jpeg",
      alt: "Exkki at Brussels Airport",
    },
    {
      name: "Grab and Fly",
      logo: "/images/Logo_grabandfly.jpg",
      alt: "Grab and Fly at Brussels Airport",
    },
  ];

const BrandCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollCarousel = useCallback((direction: "next" | "prev") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  // Automatic scrolling effect
  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      scrollCarousel("next");
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(intervalId);
  }, [scrollCarousel, isPaused]);

  // Scroll tracking
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollPosition = carousel.scrollLeft;
      const itemWidth = carousel.children[0].clientWidth;
      const newIndex = Math.round(scrollPosition / itemWidth);
      setCurrentIndex(newIndex);
    };

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="pb-4 pt-0 bg-gradient-to-br from-[#F5F3ED] to-[#F5F3ED]/70"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <div
            className="w-12 h-1 bg-[#8F53F0] rounded-full mr-4"
            aria-hidden="true"
          />
          <h2 className="text-3xl font-display font-semibold text-primary">
            Nos partenaires
          </h2>
        </div>

        <div className="relative group">
          {/* Bouton précédent */}
          <button
            onClick={() => scrollCarousel("prev")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
              bg-white shadow-lg rounded-full p-3 
              opacity-0 group-hover:opacity-100 transition-all duration-300
              hover:bg-[#8F53F0]/10 
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex === 0}
            aria-label="Voir les marques précédentes"
          >
            <ChevronLeft className="h-6 w-6 text-[#8F53F0]" />
          </button>

          {/* Carrousel de marques */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto space-x-6 pb-5 pt-0 px-2 scroll-smooth custom-scrollbar"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex-shrink-0 w-36 h-36 flex items-center justify-center 
        bg-white rounded-xl shadow-md p-4 
        transition-all duration-300 
        hover:shadow-xl hover:scale-105"
                style={{ scrollSnapAlign: "center" }}
              >
                <img
                  src={brand.logo}
                  alt={brand.alt}
                  className="max-w-full max-h-full transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Bouton suivant */}
          <button
            onClick={() => scrollCarousel("next")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
              bg-white shadow-lg rounded-full p-3 
              opacity-0 group-hover:opacity-100 transition-all duration-300
              hover:bg-[#8F53F0]/10
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex >= brands.length - 3}
            aria-label="Voir les marques suivantes"
          >
            <ChevronRight className="h-6 w-6 text-[#8F53F0]" />
          </button>
        </div>

        {/* Indicateur de progression */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {brands.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 
                  ${
                    index === currentIndex
                      ? "bg-[#8F53F0] w-8"
                      : "bg-gray-300 w-2 hover:bg-[#8F53F0]/50"
                  }`}
                onClick={() => {
                  if (carouselRef.current) {
                    const itemWidth =
                      carouselRef.current.children[0].clientWidth;
                    carouselRef.current.scrollTo({
                      left: index * itemWidth,
                      behavior: "smooth",
                    });
                  }
                }}
                aria-label={`Aller à la marque ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;

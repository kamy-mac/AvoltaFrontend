import { useState, useEffect } from "react";

import publicationService from "../services/publication.service";
import NewsCard from "../components/news/NewsCard";
import { Post } from "../types";
import { Calendar, AlertCircle, Search, Bookmark, TrendingUp } from "lucide-react";

export default function NewsPage() {
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState<"news" | "events">("news");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await publicationService.getActivePublications();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) => 
      post.category === activeCategory && 
      (searchTerm === "" || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Trier les posts par date (les plus récents d'abord)
  filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-full w-1/4 mb-8"></div>
            <div className="h-10 bg-gray-200 rounded-full w-2/3 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow-sm h-96">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec animation subtile */}
        <div className="relative mb-12 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#6A0DAD]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#6A0DAD]/5 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {activeCategory === "news" ? "Actualités" : "Événements"}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Découvrez toutes les {activeCategory === "news" ? "actualités" : "événements"} d'Avolta, 
              restez informé des dernières nouvelles et développements.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-500">
              <span className="flex items-center px-3 py-1.5 bg-white rounded-full shadow-sm">
                <Calendar className="w-4 h-4 mr-2 text-[#6A0DAD]" />
                <span>
                  {new Date().toLocaleDateString("fr-BE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </span>
              
              <span className="flex items-center px-3 py-1.5 bg-white rounded-full shadow-sm">
                <TrendingUp className="w-4 h-4 mr-2 text-[#6A0DAD]" />
                <span>{filteredPosts.length} publication{filteredPosts.length > 1 ? "s" : ""}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveCategory("news")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === "news"
                  ? "bg-[#6A0DAD] text-white shadow-md hover:shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Actualités
            </button>
            <button
              onClick={() => setActiveCategory("events")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === "events"
                  ? "bg-[#6A0DAD] text-white shadow-md hover:shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Événements
            </button>
          </div>
          
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]/30 transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-[#6A0DAD]/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-[#6A0DAD]" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Aucune {activeCategory === "news" ? "actualité" : "événement"} disponible
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Il n'y a actuellement aucune publication dans cette catégorie.
              Revenez plus tard pour découvrir nos {activeCategory === "news" ? "actualités" : "événements"}.
            </p>
            
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-6 px-6 py-2 bg-gray-100 rounded-full text-[#6A0DAD] hover:bg-gray-200 transition-colors"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div key={post.id} className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <NewsCard post={post} />
                </div>
              ))}
            </div>
            
            {filteredPosts.length > 6 && (
              <div className="mt-16 text-center">
                <button className="px-8 py-3 bg-white border border-[#6A0DAD] text-[#6A0DAD] rounded-full hover:bg-[#6A0DAD]/5 transition-colors duration-200 shadow-sm">
                  Charger plus d'articles
                </button>
              </div>
            )}
          </>
        )}
        
        {/* Section d'archives - optionnel */}
        <div className="mt-24 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-1 bg-[#6A0DAD] rounded-full"></div>
            <h2 className="text-2xl font-semibold text-gray-900">Archives</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'].map((month) => (
                <a 
                  key={month} 
                  href="#" 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-xl hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD] transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{month} 2024</span>
                </a>
              ))}
            </div>
          </div>
        </div>

      {/* <!-- Container Avolta Stratégie avec dégradé deux tons sur fond violet --> */}
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-md ">
          {/* <!-- Côté gauche - Fond violet avec dégradé deux tons --> */}
          <div className="w-full md:w-2/5 relative flex items-center">
            {/* <!-- Premier ton de violet (plus foncé) --> */}
            <div className="absolute inset-0 bg-primary"></div>
            
            {/* <!-- Deuxième ton de violet (plus clair) --> */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-100 "></div>
            
            {/* <!-- Effet de vagues ou courbes subtiles --> */}
            <div className="absolute right-0 h-full w-2/4 bg-gradient-to-l from-[#373737] to-transparent rounded-l-[80px] "></div>
            
            {/* <!-- Contenu texte --> */}
            <div className="p-8 md:p-10 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Notre stratégie :<br />
                Destination 2027
              </h2>
              <a 
                href="https://www.avoltaworld.com/en/meet-avolta/our-strategy" 
                className="inline-flex items-center text-white mt-6 hover:underline"
              >
                En savoir plus
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
    
          {/* <!-- Côté droit - Image --> */}
          <div className="w-full md:w-2/6 h-72 md:h-96 relative">
            <img
              src="public\images\nos valeurs2.png"
              alt="Personne au sommet d'une montagne contemplant le paysage"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-2/6 h-72 md:h-96 relative">
            <img
              src="public\images\nosvaleur3.png"
              alt="Personne au sommet d'une montagne contemplant le paysage"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>




      </div>
    </div>
  );
}
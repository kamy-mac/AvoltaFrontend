import { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  Mail,
  Linkedin,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Phone,
  MapPin,
  Filter,
} from "lucide-react";

// Importation dynamique des images
import jouyImage from "/public/images/Jouy.jpg";
import stevenImage from "/public/images/Steven.jpg";
import wendyImage from "/public/images/Wendy.jpg";
import pepijnImage from "/public/images/Pepijn.jpg";
import magalieImage from "/public/images/Magalie.jpg";
import robImage from "/public/images/rob.jpg";
import eddyImage from "/public/images/Eddy.jpg";
import marleeImage from "/public/images/Marlee.jpg";
import peggyImage from "/public/images/Peggy.jpg";

// Types
interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string; // Ajouté pour le filtrage
  email: string;
  phone?: string;
  location?: string;
  imageUrl: string;
  linkedinUrl?: string;
  bio?: string;
  expertise?: string[];
}

interface TeamCardProps {
  member: TeamMember;
  index: number;
  animateCards: boolean;
  hoverIndex: number | null;
  onClick: (member: TeamMember) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// Données de l'équipe avec département ajouté pour le filtrage
// Noté que le filtre se fait sur le département et non sur le nom donc tout dependra de la valeur de ce champ entrer dans département pour chaque membre
// ##### Vous pouvez ajuster les valeurs de département selon vos besoins

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Thibault JOUY",
    position: "Directeur Général",
    department: "direction", // Ajouté pour le filtrage
    email: "thibault.jouy@avolta.be",
    phone: "+32 2 753 XX XX",
    location: "Bruxelles",
    imageUrl: jouyImage,
    linkedinUrl: "#",
    bio: "Fort de plus de 15 ans d'expérience dans le retail aéroportuaire, Thibault dirige l'ensemble des opérations d'Avolta à l'aéroport de Bruxelles avec une vision stratégique axée sur l'innovation et l'expérience client.",
    expertise: ["Stratégie d'entreprise", "Retail aéroportuaire", "Management"],
  },
  {
    id: "2",
    name: "Steven CORNEILLIE",
    position: "Directeur Marketing",
    department: "direction", // Ajouté pour le filtrage
    email: "steven.corneillie@autogrill.net",
    phone: "+32 2 753 XX XX",
    location: "Bruxelles",
    imageUrl: stevenImage,
    linkedinUrl: "#",
    bio: "Steven supervise toutes les initiatives marketing et développe des stratégies innovantes pour accroître la visibilité des marques Avolta et optimiser l'expérience client dans nos points de vente.",
    expertise: ["Marketing stratégique", "Expérience client", "Retail"],
  },

  {
    id: "3",
    name: "Wendy SWINNEN",
    position: "Responsable Production",
    department: "operations", // Ajouté pour le filtrage
    email: "wendy.swinnen@avolta.be",
    phone: "+32 2 753 XX XX",
    location: "Bruxelles",
    imageUrl: wendyImage,
    linkedinUrl: "#",
    bio: "Spécialiste des opérations et de la chaîne d'approvisionnement, Wendy veille à l'efficacité des processus de production tout en maintenant les standards de qualité élevés qui font la réputation d'Avolta.",
    expertise: ["Gestion de production", "Supply chain", "Contrôle qualité"],
  },
  {
    id: "4",
    name: "Pepijn VERTOGHEN",
    position: "Responsable Développement",
    department: "operations", // Ajouté pour le filtrage
    email: "pepijn.vertoghen@avolta.be",
    phone: "+32 2 753 XX XX",
    location: "Bruxelles",
    imageUrl: pepijnImage,
    linkedinUrl: "#",
    bio: "Pepijn pilote les projets de développement et d'expansion d'Avolta, en identifiant de nouvelles opportunités et en veillant à l'alignement des initiatives avec la vision stratégique de l'entreprise.",
    expertise: ["Développement commercial", "Gestion de projets", "Expansion"],
  },
  {
    id: "5",
    name: "Magalie VERTOGHEN",
    position: "Responsable Communication",
    department: "operations", // Ajouté pour le filtrage
    email: "magalie@avolta.be",
    phone: "+32 2 753 XX XX",
    location: "Bruxelles",
    imageUrl: magalieImage,
    linkedinUrl: "#",
    bio: "Experte en communication corporate et relations médias, Magalie façonne l'image de marque d'Avolta et veille à sa cohérence à travers tous les canaux de communication internes et externes.",
    expertise: [
      "Communication corporate",
      "Relations presse",
      "Gestion de crise",
    ],
  },
  {
    id: "6",
    name: "Rob KRUGER",
    position: "Financial Director",
    department: "direction", // Ajouté pour le filtrage
    email: "rob@avolta.be",
    phone: "+32 2 753 XX XX",
    location: "Bruxelles",
    imageUrl: robImage, // Remplacez par l'image appropriée
    linkedinUrl: "#",
    bio: "Spécialiste des opérations et de la chaîne d'approvisionnement, Wendy veille à l'efficacité des processus de production tout en maintenant les standards de qualité élevés qui font la réputation d'Avolta.",
    expertise: ["Gestion de production", "Supply chain", "Contrôle qualité"],
  },
  {
    id: "7",
    name: "Eddy GRYMONPREZ",
    position: "Head of operations",
    department: "direction", // Ajouté pour le filtrage
    email: "ddy@avolta.be",
    phone: "+32 2 753 XX XX",
    location: "Bruxelles",
    imageUrl: eddyImage, // Remplacez par l'image appropriée
    linkedinUrl: "#",
    bio: "Spécialiste des opérations et de la chaîne d'approvisionnement, Wendy veille à l'efficacité des processus de production tout en maintenant les standards de qualité élevés qui font la réputation d'Avolta.",
    expertise: ["Gestion de production", "Supply chain", "Contrôle qualité"],
  },
  {
    id: "8",
    name: "Marlee JACOBS",
    position: "HR & Quality Director",
    department: "direction", // Ajouté pour le filtrage
    email: "marleen@avolta.be",
    phone: "+32 2 753 XX XX",
    location: "Bruxelles",
    imageUrl: marleeImage, // Remplacez par l'image appropriée
    linkedinUrl: "#",
    bio: "Spécialiste des opérations et de la chaîne d'approvisionnement, Wendy veille à l'efficacité des processus de production tout en maintenant les standards de qualité élevés qui font la réputation d'Avolta.",
    expertise: ["Gestion de production", "Supply chain", "Contrôle qualité"],
  },
  {
    id: "9",
    name: "Peggy LIEVENS",
    position: "Procurement & Data Mgt Director",
    department: "direction", // Ajouté pour le filtrage
    email: "peggyb@avolta.be",
    phone: "+32 2 753 XX XX",
    location: "Bruxelles",
    imageUrl: peggyImage, // Remplacez par l'image appropriée
    linkedinUrl: "#",
    bio: "Spécialiste des opérations et de la chaîne d'approvisionnement, Wendy veille à l'efficacité des processus de production tout en maintenant les standards de qualité élevés qui font la réputation d'Avolta.",
    expertise: ["Gestion de production", "Supply chain", "Contrôle qualité"],
  },
];

// Composant mémorisé pour la carte de membre d'équipe
const TeamCard = memo(
  ({
    member,
    index,
    animateCards,
    hoverIndex,
    onClick,
    onMouseEnter,
    onMouseLeave,
  }: TeamCardProps) => (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform ${
        animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${hoverIndex === index ? "ring-2 ring-primary" : ""}`}
      style={{
        transitionDelay: `${Math.min(index * 100, 500)}ms`, // Limite à 500ms max pour de grandes listes
        boxShadow:
          hoverIndex === index
            ? "0 20px 25px -5px rgba(106, 13, 173, 0.1), 0 10px 10px -5px rgba(106, 13, 173, 0.04)"
            : "",
      }}
      onClick={() => onClick(member)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(member);
        }
      }}
      role="button"
      aria-label={`Voir le profil de ${member.name}, ${member.position}`}
    >
      <div className="aspect-w-3 aspect-h-4 overflow-hidden">
        <img
          src={member.imageUrl}
          alt={`${member.name}, ${member.position}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy" // Charge les images quand elles entrent dans le viewport
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "public/images/LOGO_AVOLTA_FL_CORE_RGB.jpg";
            target.alt = "Image par défaut";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/40 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
      </div>

      {/* Badge de position - redesigné */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
        {member.position.split(" ")[0]}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/10 backdrop-blur-sm translate-y-0 transition-transform duration-300">
        <h3 className="text-xl font-bold text-day mb-1">{member.name}</h3>
        <p className="text-primary font-medium text-sm mb-4">
          {member.position}
        </p>

        <div className="w-8 h-0.5 bg-primary/50 mb-4 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

        <p className="text-sm text-day/90 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 line-clamp-2 mb-4">
          {member.bio?.substring(0, 100)}...
        </p>

        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <div className="flex items-center space-x-3">
            <a
              href={`mailto:${member.email}`}
              className="flex items-center justify-center p-2 bg-white/10 hover:bg-primary hover:text-day rounded-full transition-colors duration-300"
              aria-label={`Envoyer un email à ${member.name}`}
              onClick={(e) => e.stopPropagation()}
              tabIndex={0}
            >
              <Mail className="w-4 h-4 text-day" />
            </a>
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-2 bg-white/10 hover:bg-primary hover:text-day rounded-full transition-colors duration-300"
                aria-label={`Profil LinkedIn de ${member.name}`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={0}
              >
                <Linkedin className="w-4 h-4 text-day" />
              </a>
            )}
          </div>

          <button
            className="flex items-center space-x-1 text-sm text-day/90 hover:text-primary group"
            aria-label={`En savoir plus sur ${member.name}`}
            tabIndex={-1} // Pas besoin de tabindex car la carte est déjà accessible
          >
            <span>Profil</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
);

// Modal mémorisé pour les détails du membre
const MemberModal = memo(
  ({
    isOpen,
    selectedMember,
    teamMembers,
    modalRef,
    closeModal,
    navigateMember,
  }: {
    isOpen: boolean;
    selectedMember: TeamMember | null;
    teamMembers: TeamMember[];
    modalRef: React.RefObject<HTMLDivElement>;
    closeModal: () => void;
    navigateMember: (direction: "prev" | "next") => void;
  }) => {
    if (!isOpen || !selectedMember) return null;

    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-night/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="absolute inset-0 bg-transparent"
          onClick={closeModal}
        ></div>

        <div
          ref={modalRef}
          className="relative bg-white rounded-2xl overflow-hidden max-w-5xl w-full mx-auto shadow-2xl"
          role="document"
        >
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 z-10 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Partie gauche avec photo et overlay graphique */}
            <div className="relative h-full min-h-[350px] md:min-h-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/30 to-transparent mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-night/40 to-night/80"></div>

              {/* Motif géométrique */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
              </div>

              <img
                src={selectedMember.imageUrl}
                alt={`Portrait de ${selectedMember.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "public/images/LOGO_AVOLTA_FL_CORE_RGB.jpg";
                  target.alt = "Image par défaut";
                }}
              />

              {/* Overlay avec informations de base */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white bg-gradient-to-t from-night/80 to-transparent">
                <div className="mb-2 inline-block px-3 py-1 bg-primary/80 backdrop-blur-sm rounded-full text-xs font-semibold">
                  {selectedMember.id}/{teamMembers.length}
                </div>
                <h3 id="modal-title" className="text-3xl font-bold mb-2">
                  {selectedMember.name}
                </h3>
                <p className="text-primary-light font-medium text-xl">
                  {selectedMember.position}
                </p>
              </div>
            </div>

            {/* Partie droite avec infos détaillées */}
            <div className="p-8 md:p-10 flex flex-col bg-white">
              <div className="mb-8">
                <h4 className="text-sm uppercase tracking-wider text-night/50 font-semibold mb-4">
                  À propos
                </h4>

                <p className="text-night/80 text-base leading-relaxed mb-8">
                  {selectedMember.bio || "Aucune biographie disponible."}
                </p>

                {selectedMember.expertise &&
                  selectedMember.expertise.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm uppercase tracking-wider text-night/50 font-semibold mb-3">
                        Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.expertise.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="mt-auto">
                <h4 className="text-sm uppercase tracking-wider text-night/50 font-semibold mb-4">
                  Contact
                </h4>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-primary mr-3" />
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="text-night hover:text-primary transition-colors"
                    >
                      {selectedMember.email}
                    </a>
                  </div>

                  {selectedMember.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-primary mr-3" />
                      <span className="text-night">{selectedMember.phone}</span>
                    </div>
                  )}

                  {selectedMember.location && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-primary mr-3" />
                      <span className="text-night">
                        {selectedMember.location}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-6">
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="flex items-center justify-center h-12 px-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    aria-label={`Contacter ${selectedMember.name}`}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    <span>Contacter</span>
                  </a>

                  {selectedMember.linkedinUrl && (
                    <a
                      href={selectedMember.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-lg text-night/70 hover:border-primary hover:text-primary transition-colors"
                      aria-label={`Profil LinkedIn de ${selectedMember.name}`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Boutons de navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateMember("prev");
            }}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-primary text-white rounded-full shadow-lg transition-colors"
            aria-label="Membre précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateMember("next");
            }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-primary text-white rounded-full shadow-lg transition-colors"
            aria-label="Membre suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
);

// Fonction de filtrage de membres
const filterMembers = (members: TeamMember[], filter: string): TeamMember[] => {
  if (filter === "all") return members;
  return members.filter((member) => member.department === filter);
};

export default function TeamGrid() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [animateCards, setAnimateCards] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Animation à l'entrée
  useEffect(() => {
    // Utilisation d'un timeout pour assurer que l'animation se déclenche après le rendu initial
    const timer = setTimeout(() => {
      setAnimateCards(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Ouvrir le modal avec mémorisation
  const openModal = useCallback((member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Empêcher le défilement de la page
  }, []);

  // Fermer le modal avec animation
  const closeModal = useCallback(() => {
    if (modalRef.current) {
      modalRef.current.classList.add("animate-fadeOut");
      setTimeout(() => {
        setIsModalOpen(false);
        document.body.style.overflow = "auto"; // Réactiver le défilement
      }, 300);
    } else {
      setIsModalOpen(false);
      document.body.style.overflow = "auto";
    }
  }, []);

  // Navigation entre membres avec mémorisation
  const navigateMember = useCallback(
    (direction: "prev" | "next") => {
      if (!selectedMember) return;

      const currentIndex = teamMembers.findIndex(
        (member) => member.id === selectedMember.id
      );
      let newIndex;

      if (direction === "prev") {
        newIndex =
          currentIndex === 0 ? teamMembers.length - 1 : currentIndex - 1;
      } else {
        newIndex =
          currentIndex === teamMembers.length - 1 ? 0 : currentIndex + 1;
      }

      // Animation de transition
      if (modalRef.current) {
        modalRef.current.classList.add("animate-slideOut");
        setTimeout(() => {
          setSelectedMember(teamMembers[newIndex]);
          modalRef.current?.classList.remove("animate-slideOut");
          modalRef.current?.classList.add("animate-slideIn");
          setTimeout(() => {
            modalRef.current?.classList.remove("animate-slideIn");
          }, 300);
        }, 200);
      } else {
        setSelectedMember(teamMembers[newIndex]);
      }
    },
    [selectedMember]
  );

  // Gestion des touches de clavier pour le modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        navigateMember("prev");
      } else if (e.key === "ArrowRight") {
        navigateMember("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeModal, navigateMember]);

  // Membres filtrés selon le critère actif
  const filteredMembers = filterMembers(teamMembers, activeFilter);

  // Gestionnaires d'événements pour les cartes
  const handleMouseEnter = useCallback((index: number) => {
    setHoverIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  return (
    <section className="py-8 bg-gradient-to-b from-day to-gray-50 relative">
      {/* Élément décoratif supérieur */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-1 left-0 w-full text-primary opacity-5"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,192L48,181.3C96,171,192,149,288,149.3C384,149,480,171,576,186.7C672,203,768,213,864,208C960,203,1056,181,1152,176C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      {/* <div className="absolute top-0 left-1 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" aria-hidden="true" /> */}
      {/* <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2" aria-hidden="true" /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center px-4 py-1 mb-6 bg-primary/10 rounded-full">
            <span className="text-primary font-medium text-sm">
              L'expertise au service de votre expérience
            </span>
          </div>
          <div></div>

          <h2 className="text-4xl md:text-5xl font-bold text-night mb-6 relative inline-block">
            Notre direction
            <div
              className="absolute -bottom-6 left-1 transform -translate-x-1 w-60 h-1 bg-primary rounded-full"
              aria-hidden="true"
            ></div>
          </h2>

          <p className="text-night/60 max-w-2xl mx-auto text-lg mt-8">
            Une équipe passionnée qui façonne l'avenir d'Avolta et de l'Aéroport
            de Bruxelles en combinant expertise, innovation et excellence
            opérationnelle.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          <button
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === "all"
                ? "bg-primary text-day shadow-md"
                : "bg-gray-100 text-night/70 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("all")}
            aria-pressed={activeFilter === "all"}
            aria-label="Afficher tous les membres"
            title="Afficher tous les membres"
          >
            <span className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Tous
            </span>
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === "direction"
                ? "bg-primary text-day shadow-md"
                : "bg-gray-100 text-night/70 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("direction")}
            aria-pressed={activeFilter === "direction"}
            aria-label="Filtrer par direction"
            title="Voir uniquement l'équipe de direction"
          >
            Direction
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === "operations"
                ? "bg-primary text-day shadow-md"
                : "bg-gray-100 text-night/70 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("operations")}
            aria-pressed={activeFilter === "operations"}
            aria-label="Filtrer par opérations"
            title="Voir uniquement l'équipe opérationnelle"
          >
            Opérations
          </button>
        </div>

        {/* Grille des membres */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              Aucun membre correspondant au filtre actuel.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
            role="list"
            aria-label="Membres de l'équipe"
          >
            {filteredMembers.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                index={index}
                animateCards={animateCards}
                hoverIndex={hoverIndex}
                onClick={openModal}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal détaillé */}
      <MemberModal
        isOpen={isModalOpen}
        selectedMember={selectedMember}
        teamMembers={teamMembers}
        modalRef={modalRef}
        closeModal={closeModal}
        navigateMember={navigateMember}
      />

      {/* Élément décoratif inférieur
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-full text-day transform rotate-180"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,64L80,96C160,128,320,192,480,192C640,192,800,128,960,122.7C1120,117,1280,171,1360,197.3L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div> */}

      {/* Styles pour les animations */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-30px); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .animate-fadeOut {
          animation: fadeOut 0.3s ease-in forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }

        .animate-slideOut {
          animation: slideOut 0.2s ease-in forwards;
        }
      `}
      </style>
    </section>
  );
}

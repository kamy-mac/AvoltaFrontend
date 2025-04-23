import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  Search,
  User,
  LogOut,
  Home,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  BookOpen,
  Users,
  ExternalLink,
  Mail,
  HandPlatter,
  Megaphone,
  Handshake,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

// Memoized navigation link component for better performance
const NavLink = memo(
  ({
    to,
    icon: Icon,
    label,
    isActive,
    isMobile = false,
    isHashLink = false,
    onClick,
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    isMobile?: boolean;
    isHashLink?: boolean;
    onClick?: () => void;
  }) => {
    // For hash links (section navigation), we use regular anchors with smooth scroll behavior
    if (isHashLink) {
      return isMobile ? (
        <a
          href={to}
          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200
          text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]`}
          onClick={onClick}
        >
          <div className="bg-[#6A0DAD]/10 rounded-full p-2 mr-4">
            <Icon className="w-5 h-5 text-[#6A0DAD]" />
          </div>
          <span className="font-medium">{label}</span>
        </a>
      ) : (
        <a
          href={to}
          className="flex items-center font-medium relative group py-2 text-gray-700 hover:text-[#6A0DAD]"
          onClick={onClick}
        >
          <Icon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110 text-[#6A0DAD] opacity-80" />
          <span>{label}</span>
          <span className="absolute bottom-0 left-0 h-0.5 bg-[#6A0DAD] transition-all duration-300 w-0 group-hover:w-full"></span>
        </a>
      );
    }

    if (isMobile) {
      return (
        <Link
          to={to}
          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-[#6A0DAD]/10 text-[#6A0DAD]"
              : "text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
          }`}
        >
          <div
            className={`rounded-full p-2 mr-4 ${
              isActive ? "bg-[#6A0DAD]/20" : "bg-[#6A0DAD]/10"
            }`}
          >
            <Icon className="w-5 h-5 text-[#6A0DAD]" />
          </div>
          <span className="font-medium">{label}</span>
        </Link>
      );
    }

    return (
      <Link
        to={to}
        className={`flex items-center font-medium relative group py-2 ${
          isActive ? "text-[#6A0DAD]" : "text-gray-700 hover:text-[#6A0DAD]"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon
          className={`w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110 ${
            isActive ? "text-[#6A0DAD]" : "text-[#6A0DAD] opacity-80"
          }`}
        />
        <span>{label}</span>
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-[#6A0DAD] transition-all duration-300 ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </Link>
    );
  }
);

// Memoized user menu item component for better performance
const UserMenuItem = memo(
  ({
    to,
    icon: Icon,
    label,
    onClick,
    danger = false,
  }: {
    to?: string;
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    danger?: boolean;
  }) => {
    const className = `flex items-center px-4 py-2 text-sm ${
      danger
        ? "text-red-600 hover:bg-red-50 w-full"
        : "text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
    }`;

    if (to) {
      return (
        <Link to={to} className={className} onClick={onClick}>
          <Icon
            className={`w-4 h-4 mr-3 ${
              danger ? "text-red-500" : "text-gray-500"
            }`}
          />
          {label}
        </Link>
      );
    }

    return (
      <button className={className} onClick={onClick}>
        <Icon
          className={`w-4 h-4 mr-3 ${
            danger ? "text-red-500" : "text-gray-500"
          }`}
        />
        {label}
      </button>
    );
  }
);

/**
 * Enhanced Header component
 */
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNotificationAvailable, setIsNotificationAvailable] = useState(false);

  // Refs for click outside detection
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle scroll event to add shadow to header
   */
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  /**
   * Check for notifications (example implementation)
   */
  useEffect(() => {
    // This would typically be an API call to check for new notifications
    if (isAuthenticated && user?.role === "superadmin") {
      const checkForNotifications = async () => {
        try {
          // Example: API call to check for pending publications
          // const response = await publicationService.getPendingPublicationsCount();
          // setIsNotificationAvailable(response > 0);

          // For demo purposes:
          setIsNotificationAvailable(true);
        } catch (error) {
          console.error("Error checking notifications:", error);
        }
      };

      checkForNotifications();
    }
  }, [isAuthenticated, user]);

  /**
   * Close menus when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close user menu when clicking outside
      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }

      // Close search when clicking outside
      if (
        searchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen, searchOpen]);

  /**
   * Close mobile menu when route changes
   */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /**
   * Focus search input when search opens
   */
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  /**
   * Check if a navigation link is active
   */
  const isActive = useCallback(
    (path: string) => {
      return (
        location.pathname === path || location.pathname.startsWith(`${path}/`)
      );
    },
    [location.pathname]
  );

  /**
   * Handle user icon click
   */
  const handleUserClick = useCallback(() => {
    if (isAuthenticated) {
      setUserMenuOpen(!userMenuOpen);
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, userMenuOpen, navigate]);

  /**
   * Handle logout with confirmation
   */
  const handleLogout = useCallback(() => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      setUserMenuOpen(false);
      logout();
      navigate("/");
    }
  }, [logout, navigate]);

  /**
   * Handle search submission
   */
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        setSearchOpen(false);
        setSearchTerm("");
      }
    },
    [searchTerm, navigate]
  );

  /**
   * Handle key press events for accessibility
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Close search on escape
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }

      // Close user menu on escape
      if (e.key === "Escape" && userMenuOpen) {
        setUserMenuOpen(false);
      }
    },
    [searchOpen, userMenuOpen]
  );

  /**
   * Handle smooth scroll to section
   */
  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    // Check if we're on the home page
    if (location.pathname !== "/") {
      // If not, navigate to home page with hash
      navigate(`/#${sectionId}`);
      return;
    }

    // If we're already on the home page, scroll to the section
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 200, // Adjust offset for header height
        behavior: "smooth",
      });
    }

    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  /**
   * Main navigation links for desktop and mobile
   */
  const navigationLinks = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/news", icon: Calendar, label: t("header.news") },
    // { path: '/bac-airport', icon: Building2, label: 'BAC Airport' },
    { path: "/contact", icon: Mail, label: t("header.contact") },
  ];

  /**
   * Section navigation links for the homepage
   */
  const sectionLinks = [
    {
      path: "/#video-section",
      icon: Handshake,
      label: "Partenaires",
      sectionId: "video-section",
    },
    {
      path: "/#newsletter-section",
      icon: HandPlatter,
      label: "Reservation",
      sectionId: "newsletter-section",
    },
    {
      path: "/#gallery-section",
      icon: Megaphone,
      label: "Strategies",
      sectionId: "gallery-section",
    },
  ];

  return (
    <header
      className={`bg-white border-b border-gray-50 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : "shadow-sm"
      }`}
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with hover effect */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center group transition-transform duration-300 hover:scale-105"
              aria-label="Accueil Avolta"
            >
              <img
                src="/public/images/LOGO_AVOLTA_FL_CORE_RGB.jpg"
                alt="Logo Avolta"
                className="w-auto h-11 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-6"
            aria-label="Navigation principale"
          >
            {/* Primary navigation links */}
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                icon={link.icon}
                label={link.label}
                isActive={isActive(link.path)}
              />
            ))}

            {/* Section navigation links - only visible when on home page */}
            {location.pathname === "/" && (
              <div className="flex items-center space-x-6 ml-4 pl-4 border-l border-gray-200">
                {sectionLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    icon={link.icon}
                    label={link.label}
                    isActive={false}
                    isHashLink={true}
                    onClick={() =>
                      handleSectionClick(
                        event as unknown as React.MouseEvent<HTMLAnchorElement>,
                        link.sectionId
                      )
                    }
                  />
                ))}
              </div>
            )}
          </nav>

          {/* Actions with hover effects */}
          <div className="flex items-center space-x-3">
            <LanguageSelector />

            {/* Search button and expandable search bar */}
            <div className="relative" ref={searchRef}>
              <button
                className={`p-2.5 rounded-full transition-colors duration-300 ${
                  searchOpen
                    ? "bg-[#6A0DAD]/20 text-[#6A0DAD]"
                    : "hover:bg-[#6A0DAD]/10 text-[#6A0DAD]"
                }`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Rechercher"
                aria-expanded={searchOpen}
                aria-controls="search-panel"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Expandable search form */}
              <div
                id="search-panel"
                className={`absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top-right ${
                  searchOpen
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
                aria-hidden={!searchOpen}
              >
                <form onSubmit={handleSearchSubmit} className="p-2">
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-[#6A0DAD] focus:ring focus:ring-[#6A0DAD]/20 rounded-md transition-all duration-200"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bg-[#6A0DAD] text-white p-1 rounded"
                      disabled={!searchTerm.trim()}
                      aria-label="Lancer la recherche"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleUserClick}
                className={`p-2.5 rounded-full transition-colors duration-300 ${
                  userMenuOpen
                    ? "bg-[#6A0DAD]/20 text-[#6A0DAD]"
                    : "hover:bg-[#6A0DAD]/10 text-[#6A0DAD]"
                } relative`}
                aria-label={
                  isAuthenticated ? "Menu utilisateur" : "Se connecter"
                }
                aria-expanded={userMenuOpen}
                aria-controls="user-menu"
              >
                <User className="w-5 h-5" />
                {isAuthenticated && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>

              {/* User dropdown menu for authenticated users */}
              {isAuthenticated && (
                <div
                  id="user-menu"
                  className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 origin-top-right transform z-50 ${
                    userMenuOpen
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0 pointer-events-none"
                  }`}
                  aria-hidden={!userMenuOpen}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#6A0DAD]/10 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-[#6A0DAD]" />
                      </div>
                      <div>
                        <a
                          href="/admin"
                          className="text-xs text-gray-500 truncate"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {user?.username ||
                              user?.email?.split("@")[0] ||
                              "Utilisateur"}
                          </p>
                        </a>
                        <a
                          href="/admin"
                          className="text-xs text-gray-500 truncate"
                        >
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || ""}{" "}
                          </p>
                        </a>
                        <a
                          href="/admin"
                          className="text-xs text-gray-500 truncate"
                        >
                          <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-[#6A0DAD]/10 text-[#6A0DAD]">
                            {user?.role === "superadmin"
                              ? "Super Admin"
                              : " Admin"}
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <UserMenuItem
                      to="/admin"
                      icon={Settings}
                      label="Tableau de bord"
                      onClick={() => setUserMenuOpen(false)}
                    />

                    <UserMenuItem
                      to="/admin/publications"
                      icon={BookOpen}
                      label="Publications"
                      onClick={() => setUserMenuOpen(false)}
                    />

                    {user?.role === "superadmin" && (
                      <>
                        <UserMenuItem
                          to="/admin/pending"
                          icon={Bell}
                          label="Publications en attente"
                          onClick={() => setUserMenuOpen(false)}
                        />

                        <UserMenuItem
                          to="/admin/users"
                          icon={Users}
                          label="Gestion utilisateurs"
                          onClick={() => setUserMenuOpen(false)}
                        />
                      </>
                    )}

                    <UserMenuItem
                      to="/admin/newsletter"
                      icon={Mail}
                      label="Newsletter"
                      onClick={() => setUserMenuOpen(false)}
                    />
                  </div>

                  <div className="py-1 border-t border-gray-100">
                    <UserMenuItem
                      icon={HelpCircle}
                      label="Aide et support"
                      onClick={() => {
                        setUserMenuOpen(false);
                        window.open(
                          "https://www.avoltaworld.com/en/contact",
                          "_blank"
                        );
                      }}
                    />

                    <UserMenuItem
                      icon={LogOut}
                      label="Se déconnecter"
                      onClick={handleLogout}
                      danger
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Logout button for authenticated users (desktop) */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden md:flex p-2.5 rounded-full hover:bg-[#6A0DAD]/10 transition-colors duration-300 text-[#6A0DAD]"
                title="Se déconnecter"
                aria-label="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            {/* Notifications indicator for superadmin (desktop) */}
            {isAuthenticated &&
              user?.role === "superadmin" &&
              isNotificationAvailable && (
                <Link
                  to="/admin/pending"
                  className="hidden md:flex relative p-2.5 rounded-full bg-[#6A0DAD]/10 text-[#6A0DAD] transition-colors duration-300 hover:bg-[#6A0DAD]/20"
                  title="Publications en attente"
                  aria-label="Publications en attente"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 transform translate-x-1/2 -translate-y-1/2"></span>
                </Link>
              )}

            {/* Mobile menu button with animated hamburger */}
            <button
              className="md:hidden p-2.5 rounded-full hover:bg-[#6A0DAD]/10 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <span
                  className={`absolute block h-0.5 w-5 bg-[#6A0DAD] transform transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 bg-[#6A0DAD] transform transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0 w-0" : "opacity-100 w-5"
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-5 bg-[#6A0DAD] transform transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with enhanced animation */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col space-y-1">
            {/* Mobile search form */}
            <form onSubmit={handleSearchSubmit} className="mb-4 mt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 focus:border-[#6A0DAD] focus:ring focus:ring-[#6A0DAD]/20 rounded-lg"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-[#6A0DAD] text-white p-1.5 rounded-md"
                  disabled={!searchTerm.trim()}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Navigation links */}
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                icon={link.icon}
                label={link.label}
                isActive={isActive(link.path)}
                isMobile
              />
            ))}

            {/* Section navigation links for mobile */}
            <div className="my-2 pt-2 border-t border-gray-100">
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Sections de la page d'accueil
              </div>

              {sectionLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
                  onClick={(e) => handleSectionClick(e, link.sectionId)}
                >
                  <div className="rounded-full p-2 mr-4 bg-[#6A0DAD]/10">
                    <link.icon className="w-5 h-5 text-[#6A0DAD]" />
                  </div>
                  <span className="font-medium">{link.label}</span>
                </a>
              ))}
            </div>

            {/* Admin links for authenticated users */}
            {isAuthenticated && (
              <>
                <div className="border-t border-gray-100 my-2 pt-2">
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Administration
                  </div>

                  <Link
                    to="/admin"
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive("/admin") &&
                      !location.pathname.includes("/admin/")
                        ? "bg-[#6A0DAD]/10 text-[#6A0DAD]"
                        : "text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 mr-4 ${
                        isActive("/admin") &&
                        !location.pathname.includes("/admin/")
                          ? "bg-[#6A0DAD]/20"
                          : "bg-[#6A0DAD]/10"
                      }`}
                    >
                      <Settings className="w-5 h-5 text-[#6A0DAD]" />
                    </div>
                    <span className="font-medium">Tableau de bord</span>
                  </Link>

                  <Link
                    to="/admin/publications"
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive("/admin/publications")
                        ? "bg-[#6A0DAD]/10 text-[#6A0DAD]"
                        : "text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 mr-4 ${
                        isActive("/admin/publications")
                          ? "bg-[#6A0DAD]/20"
                          : "bg-[#6A0DAD]/10"
                      }`}
                    >
                      <BookOpen className="w-5 h-5 text-[#6A0DAD]" />
                    </div>
                    <span className="font-medium">Publications</span>
                  </Link>

                  {user?.role === "superadmin" && (
                    <>
                      <Link
                        to="/admin/pending"
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive("/admin/pending")
                            ? "bg-[#6A0DAD]/10 text-[#6A0DAD]"
                            : "text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
                        }`}
                      >
                        <div
                          className={`rounded-full p-2 mr-4 ${
                            isActive("/admin/pending")
                              ? "bg-[#6A0DAD]/20"
                              : "bg-[#6A0DAD]/10"
                          }`}
                        >
                          <Bell className="w-5 h-5 text-[#6A0DAD]" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">
                            Publications en attente
                          </span>
                          {isNotificationAvailable && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </Link>

                      <Link
                        to="/admin/users"
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive("/admin/users")
                            ? "bg-[#6A0DAD]/10 text-[#6A0DAD]"
                            : "text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
                        }`}
                      >
                        <div
                          className={`rounded-full p-2 mr-4 ${
                            isActive("/admin/users")
                              ? "bg-[#6A0DAD]/20"
                              : "bg-[#6A0DAD]/10"
                          }`}
                        >
                          <Users className="w-5 h-5 text-[#6A0DAD]" />
                        </div>
                        <span className="font-medium">
                          Gestion utilisateurs
                        </span>
                      </Link>
                    </>
                  )}

                  <Link
                    to="/admin/newsletter"
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive("/admin/newsletter")
                        ? "bg-[#6A0DAD]/10 text-[#6A0DAD]"
                        : "text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD]"
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 mr-4 ${
                        isActive("/admin/newsletter")
                          ? "bg-[#6A0DAD]/20"
                          : "bg-[#6A0DAD]/10"
                      }`}
                    >
                      <Mail className="w-5 h-5 text-[#6A0DAD]" />
                    </div>
                    <span className="font-medium">Newsletter</span>
                  </Link>
                </div>

                {/* External links */}
                <a
                  href="https://www.avoltaworld.com/en/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-[#6A0DAD]/5 hover:text-[#6A0DAD] transition-all duration-200"
                >
                  <div className="bg-[#6A0DAD]/10 rounded-full p-2 mr-4">
                    <HelpCircle className="w-5 h-5 text-[#6A0DAD]" />
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">Aide et support</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </a>

                {/* Logout button for mobile */}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
                >
                  <div className="bg-red-100 rounded-full p-2 mr-4">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="font-medium">Se déconnecter</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Accessibility features */}
      <div className="sr-only">
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <nav>
          <ul>
            {navigationLinks.map((link) => (
              <li key={link.path}>
                <a href={link.path}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

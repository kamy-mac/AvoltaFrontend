import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  Mail,
  Bell,
  Settings,
  Clock,
  Home,
  Users,
  LogOut,
  ChevronDown,
  Menu,
  FileText,
  User,
  X,
  Activity,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import avoltaLogo1 from "../../../public/images/FA_AVOLTA_NAV_CORE_RGB.jpg";

export default function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [helpPopupOpen, setHelpPopupOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Nouvelle publication en attente de validation",
      time: "Il y a 5 minutes",
      read: false,
    },
    {
      id: 2,
      message: "2 nouveaux abonnés à la newsletter",
      time: "Il y a 2 heures",
      read: false,
    },
    {
      id: 3,
      message: "Mise à jour système complétée",
      time: "Hier",
      read: true,
    },
  ]);

  // Close menus when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
    setHelpPopupOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        notificationsOpen &&
        target &&
        !target.closest(".notifications-menu")
      ) {
        setNotificationsOpen(false);
      }
      if (profileMenuOpen && target && !target.closest(".profile-menu")) {
        setProfileMenuOpen(false);
      }
      if (helpPopupOpen && target && !target.closest(".help-menu")) {
        setHelpPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen, profileMenuOpen, helpPopupOpen]);

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") {
      return true;
    }
    return path !== "/admin" && location.pathname.includes(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10  rounded-lg flex items-center justify-center shadow-sm transition-transform duration-300 hover:scale-105">
                  <img
                    src={avoltaLogo1}
                    alt="Avolta Logo"
                    className="h-16 w-auto object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#6A0DAD] text-lg leading-none">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {user?.username ||
                        user?.email?.split("@")[0] ||
                        "Administrateur"}
                    </h1>
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-[#6A0DAD] hover:bg-gray-100 focus:outline-none transition duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-3">
            <Link
              to="/"
              className="inline-flex items-center px-3 py-2 border border-transparent text-gray-600 hover:text-[#6A0DAD] text-sm font-medium rounded-md transition-colors duration-200 hover:bg-gray-50"
            >
              <Home className="h-5 w-5 mr-1.5" />
            </Link>

            <Link
              to="/admin"
              className={`inline-flex items-center px-3 py-2 border ${
                location.pathname === "/admin"
                  ? "border-[#6A0DAD]/20 text-[#6A0DAD] bg-[#6A0DAD]/5"
                  : "border-transparent text-gray-600 hover:text-[#6A0DAD] hover:bg-gray-50"
              } text-sm font-medium rounded-md transition-colors duration-200`}
            >
              <LayoutDashboard className="h-5 w-5 mr-1.5" />
              Dashboard
            </Link>

            <Link
              to="/admin/create"
              className={`inline-flex items-center px-3 py-2 border ${
                isActive("/admin/create")
                  ? "border-[#6A0DAD]/20 text-[#6A0DAD] bg-[#6A0DAD]/5"
                  : "border-transparent text-gray-600 hover:text-[#6A0DAD] hover:bg-gray-50"
              } text-sm font-medium rounded-md transition-colors duration-200`}
            >
              <Plus className=" h-5 w-5 mr-1.5" />
              Nouvelle publication
            </Link>

            <Link
              to="/admin/publications"
              className={`inline-flex items-center px-3 py-2 border ${
                isActive("/admin/publications")
                  ? "border-[#6A0DAD]/20 text-[#6A0DAD] bg-[#6A0DAD]/5"
                  : "border-transparent text-gray-600 hover:text-[#6A0DAD] hover:bg-gray-50"
              } text-sm font-medium rounded-md transition-colors duration-200`}
            >
              <FileText className="h-5 w-5 mr-1.5" />
              Publications
            </Link>

            {isSuperAdmin && (
              <>
                <Link
                  to="/admin/pending"
                  className={`inline-flex items-center px-3 py-2 border ${
                    isActive("/admin/pending")
                      ? "border-[#6A0DAD]/20 text-[#6A0DAD] bg-[#6A0DAD]/5"
                      : "border-transparent text-gray-600 hover:text-[#6A0DAD] hover:bg-gray-50"
                  } text-sm font-medium rounded-md transition-colors duration-200`}
                >
                  <Clock className="h-5 w-5 mr-1.5" />
                  En attente
                </Link>

                <Link
                  to="/admin/users"
                  className={`inline-flex items-center px-3 py-2 border ${
                    isActive("/admin/users")
                      ? "border-[#6A0DAD]/20 text-[#6A0DAD] bg-[#6A0DAD]/5"
                      : "border-transparent text-gray-600 hover:text-[#6A0DAD] hover:bg-gray-50"
                  } text-sm font-medium rounded-md transition-colors duration-200`}
                >
                  <Users className="h-5 w-5 mr-1.5" />
                  Administrateurs
                </Link>
              </>
            )}

            <Link
              to="/admin/newsletter"
              className={`inline-flex items-center px-3 py-2 border ${
                isActive("/admin/newsletter")
                  ? "border-[#6A0DAD]/20 text-[#6A0DAD] bg-[#6A0DAD]/5"
                  : "border-transparent text-gray-600 hover:text-[#6A0DAD] hover:bg-gray-50"
              } text-sm font-medium rounded-md transition-colors duration-200`}
            >
              <Mail className="h-5 w-5 mr-1.5" />
              Newsletter
            </Link>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Notifications dropdown */}
            <div className="relative notifications-menu">
              <button
                className={`p-2 rounded-full ${
                  notificationsOpen
                    ? "bg-[#6A0DAD]/10 text-[#6A0DAD]"
                    : "text-gray-500 hover:text-[#6A0DAD] hover:bg-gray-100"
                } transition duration-200 relative`}
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileMenuOpen(false);
                }}
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications panel */}
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 overflow-hidden z-50">
                  <div className="p-3 flex justify-between items-center bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#6A0DAD] hover:text-[#5a0b91] transition-colors"
                      >
                        Marquer comme lues
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Aucune notification
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 hover:bg-gray-50 transition-colors ${
                              notification.read ? "" : "bg-[#6A0DAD]/5"
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-gray-50">
                    <Link
                      to="/admin/notifications"
                      className="block text-center text-xs text-[#6A0DAD] hover:text-[#5a0b91] py-1"
                    >
                      Voir toutes les notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Stats/Analytics */}
            <Link
              to="/admin/analytics"
              className="hidden md:block p-2 rounded-full text-gray-500 hover:text-[#6A0DAD] hover:bg-gray-100 transition duration-200"
            >
              <Activity className="h-6 w-6" />
            </Link>

            {/* Settings */}
            <Link
              to="/admin/settings"
              className="hidden md:block p-2 rounded-full text-gray-500 hover:text-[#6A0DAD] hover:bg-gray-100 transition duration-200"
            >
              <Settings className="h-6 w-6" />
            </Link>

            {/* Help */}
            <div className="relative help-menu hidden md:block">
              <button
                className="p-2 rounded-full text-gray-500 hover:text-[#6A0DAD] hover:bg-[#6A0DAD]/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6A0DAD]/20"
                onClick={(e) => {
                  e.preventDefault();
                  setHelpPopupOpen(!helpPopupOpen);
                }}
                aria-label="Help and support"
                aria-expanded={helpPopupOpen}
              >
                <HelpCircle className="h-6 w-6" />
              </button>

              {helpPopupOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 border border-gray-100 animate-fadeIn">
                  <div className="bg-[#6A0DAD]/5 px-4 py-3 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <HelpCircle className="h-5 w-5 text-[#6A0DAD] mr-2" />
                        Contact Support
                      </h3>
                      <button
                        onClick={() => setHelpPopupOpen(false)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-[#6A0DAD]/10 p-2 rounded-full mr-3">
                          <User className="h-5 w-5 text-[#6A0DAD]" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            Mac Wendly Kamy
                          </p>
                          <p className="text-gray-500 text-sm">
                            Support Administrator
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-[#6A0DAD]/10 p-2 rounded-full mr-3">
                          <Mail className="h-5 w-5 text-[#6A0DAD]" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">Email</p>
                          <a
                            href="mailto:mac-wendly.kamy-teukam@aconnect.net"
                            className="text-[#6A0DAD] hover:underline text-sm break-all"
                          >
                            mac-wendly.kamy-teukam@aconnect.net
                          </a>
                        </div>
                      </div>

                      <button
                        className="w-full mt-2 px-4 py-2 bg-[#6A0DAD] text-white rounded-md hover:bg-[#5a0b91] transition-colors flex items-center justify-center"
                        onClick={() => {
                          window.location.href =
                            "mailto:mac-wendly.kamy-teukam@aconnect.net";
                          setHelpPopupOpen(false);
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
                    Support hours: Monday-Friday, 9AM-5PM CET
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative profile-menu">
              <button
                className={`flex items-center space-x-2 p-1.5 rounded-full ${
                  profileMenuOpen ? "bg-[#6A0DAD]/10" : "hover:bg-gray-100"
                } transition duration-200`}
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen);
                  setNotificationsOpen(false);
                }}
              >
                <div className="relative flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-[#6A0DAD] flex items-center justify-center text-white font-medium text-sm">
                    {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-white"></div>
                </div>
                <div className="hidden md:block">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </button>

              {/* Profile dropdown panel */}
              {profileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 overflow-hidden z-50">
                  <div className="py-3 px-4">
                    <p className="text-sm font-medium text-gray-900">
                      {" "}
                      Utilisateur
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {user?.email || "utilisateur@example.com"}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      Mon profil
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      Paramètres
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-red-500" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1 bg-gray-50">
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-[#6A0DAD] hover:bg-white"
          >
            <Home className="h-5 w-5 mr-3" />
            Accueil
          </Link>

          <Link
            to="/admin"
            className={`flex items-center px-4 py-2 text-base font-medium ${
              location.pathname === "/admin"
                ? "text-[#6A0DAD] bg-white"
                : "text-gray-600 hover:text-[#6A0DAD] hover:bg-white"
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>

          <Link
            to="/admin/create"
            className={`flex items-center px-4 py-2 text-base font-medium ${
              isActive("/admin/create")
                ? "text-[#6A0DAD] bg-white"
                : "text-gray-600 hover:text-[#6A0DAD] hover:bg-white"
            }`}
          >
            <Plus className="h-5 w-5 mr-3" />
            Nouvelle publication
          </Link>

          <Link
            to="/admin/publications"
            className={`flex items-center px-4 py-2 text-base font-medium ${
              isActive("/admin/publications")
                ? "text-[#6A0DAD] bg-white"
                : "text-gray-600 hover:text-[#6A0DAD] hover:bg-white"
            }`}
          >
            <FileText className="h-5 w-5 mr-3" />
            Publications
          </Link>

          {isSuperAdmin && (
            <>
              <Link
                to="/admin/pending"
                className={`flex items-center px-4 py-2 text-base font-medium ${
                  isActive("/admin/pending")
                    ? "text-[#6A0DAD] bg-white"
                    : "text-gray-600 hover:text-[#6A0DAD] hover:bg-white"
                }`}
              >
                <Clock className="h-5 w-5 mr-3" />
                En attente
              </Link>

              <Link
                to="/admin/users"
                className={`flex items-center px-4 py-2 text-base font-medium ${
                  isActive("/admin/users")
                    ? "text-[#6A0DAD] bg-white"
                    : "text-gray-600 hover:text-[#6A0DAD] hover:bg-white"
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                Administrateurs
              </Link>
            </>
          )}

          <Link
            to="/admin/newsletter"
            className={`flex items-center px-4 py-2 text-base font-medium ${
              isActive("/admin/newsletter")
                ? "text-[#6A0DAD] bg-white"
                : "text-gray-600 hover:text-[#6A0DAD] hover:bg-white"
            }`}
          >
            <Mail className="h-5 w-5 mr-3" />
            Newsletter
          </Link>

          <div className="border-t border-gray-200 pt-2 mt-2">
            <Link
              to="/admin/analytics"
              className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-[#6A0DAD] hover:bg-white"
            >
              <Activity className="h-5 w-5 mr-3" />
              Statistiques
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-[#6A0DAD] hover:bg-white"
            >
              <Settings className="h-5 w-5 mr-3" />
              Paramètres
            </Link>

            <div className="help-menu">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setHelpPopupOpen(!helpPopupOpen);
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-base font-medium text-gray-600 hover:text-[#6A0DAD] hover:bg-white"
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                Contact
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Key,
  Trash2,
  UserCheck,
  UserX,
  Search,
  AlertCircle,
  X,
  Check,
  RefreshCw,
  Shield,
  Eye,
  EyeOff,
  HelpCircle,
  ChevronDown,
  Info,
} from "lucide-react";
import userService from "../../services/user.service";
import authService from "../../services/auth.service";
import { User } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { debounce } from "lodash";

/**
 * Guide d'utilisation pour le Super Administrateur
 */
const UserGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">
            Guide d'utilisation du gestionnaire d'administrateurs
          </h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-purple-600 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-4 pt-0 text-sm text-gray-700 space-y-3">
          <p className="flex items-start">
            <Info className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              En tant que Super Administrateur, vous pouvez gérer tous les
              utilisateurs administrateurs de la plateforme.
            </span>
          </p>

          <div className="pl-6 space-y-2">
            <p className="font-semibold text-purple-800">
              Fonctionnalités disponibles :
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="font-medium">Créer un administrateur</span> :
                Ajoutez de nouveaux administrateurs en utilisant le bouton "Add
                Administrator".
              </li>
              <li>
                <span className="font-medium">Rechercher</span> : Utilisez la
                barre de recherche pour trouver rapidement un administrateur par
                son adresse email.
              </li>
              <li>
                <span className="font-medium">Trier</span> : Cliquez sur les
                en-têtes de colonnes pour trier les administrateurs selon
                différents critères.
              </li>
              <li>
                <span className="font-medium">Activer/Désactiver</span> :
                Modifiez le statut d'un administrateur avec le bouton{" "}
                <UserCheck className="h-4 w-4 inline text-green-600" /> ou{" "}
                <UserX className="h-4 w-4 inline text-red-600" />.
              </li>
              <li>
                <span className="font-medium">Supprimer</span> : Supprimez
                définitivement un administrateur avec le bouton{" "}
                <Trash2 className="h-4 w-4 inline text-red-600" /> (action
                irréversible).
              </li>
              <li>
                <span className="font-medium">Rafraîchir</span> : Mettez à jour
                la liste des administrateurs avec le bouton{" "}
                <RefreshCw className="h-4 w-4 inline text-purple-600" />.
              </li>
            </ul>
          </div>

          <div className="pl-6 mt-3">
            <p className="font-semibold text-purple-800">
              Informations importantes :
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Seuls les comptes "Admin" peuvent être modifiés. Les comptes
                "Super Admin" sont protégés.
              </li>
              <li>
                Un mot de passe sécurisé doit contenir au minimum 8 caractères.
              </li>
              <li>
                Les administrateurs désactivés ne pourront pas se connecter à la
                plateforme.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [sortConfig] = useState<{
    key: keyof User;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    setIsMounted(true);

    // Create abort controller for cleanup
    const abortController = new AbortController();

    const init = async () => {
      // Check if user is superadmin before loading data
      if (!currentUser || currentUser.role.toLowerCase() !== "superadmin") {
        navigate("/admin");
        return;
      }

      if (!abortController.signal.aborted && isMounted) {
        await loadUsers();
      }
    };

    init();

    // Cleanup function to prevent memory leaks
    return () => {
      setIsMounted(false);
      abortController.abort();
    };
  }, [currentUser, navigate]);

  const loadUsers = async () => {
    if (!isMounted) return;

    try {
      setIsLoading(true);
      setError(null);
      setIsRefreshing(true);

      // Implement a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Request timeout after 10 seconds")),
          10000
        );
      });

      // Use the service method with a timeout
      const dataPromise = userService.getAllUsers();
      const data = (await Promise.race([
        dataPromise,
        timeoutPromise,
      ])) as User[];

      // Only update state if component is still mounted
      if (isMounted) {
        setUsers(data);
      }
    } catch (error: any) {
      console.error("Error loading users:", error);
      if (isMounted) {
        setError(error.message || "Error loading users. Please try again.");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Password validation
    if (newUser.password !== newUser.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newUser.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      // Use the register method from authService with uppercase "ADMIN" role
      await authService.register({
        email: newUser.email,
        password: newUser.password,
        role: "ADMIN", // Changé de "admin" à "ADMIN" pour correspondre à l'enum du backend
      });

      setNewUser({ email: "", password: "", confirmPassword: "" });
      setShowCreateForm(false);
      setSuccess("Administrator created successfully");

      // Set a timeout to clear the success message
      setTimeout(() => {
        if (isMounted) setSuccess(null);
      }, 5000);

      loadUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(error.message || "Failed to create user. Please try again.");
    }
  };

  const handleToggleStatus = async (
    userId: string,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      setError(null);
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await userService.updateUserStatus(userId, newStatus);

      // Optimistically update the UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      setSuccess(
        `User status ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully`
      );

      // Set a timeout to clear the success message
      setTimeout(() => {
        if (isMounted) setSuccess(null);
      }, 5000);
    } catch (error: any) {
      console.error("Error updating user status:", error);
      setError(
        error.message || "Failed to update user status. Please try again."
      );

      // Revert the optimistic update on error
      loadUsers();
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the administrator "${userEmail}"?`
      )
    ) {
      return;
    }

    try {
      setError(null);
      await userService.deleteUser(userId);

      // Optimistically update the UI
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      setSuccess("Administrator deleted successfully");

      // Set a timeout to clear the success message
      setTimeout(() => {
        if (isMounted) setSuccess(null);
      }, 5000);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setError(error.message || "Failed to delete user. Please try again.");

      // Revert the optimistic update on error
      loadUsers();
    }
  };

  // Sorting functionality

  const getSortedUsers = () => {
    // First filter users based on search term
    let filteredResults = users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then sort if sortConfig is set
    if (sortConfig !== null) {
      filteredResults.sort(() => {
        return 0;
      });
    }

    return filteredResults;
  };

  // UI for displaying loading skeletons
  const renderSkeletons = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Email",
                "Role",
                "Status",
                "Registration Date",
                "Last Login",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4].map((item) => (
              <tr key={item} className="animate-pulse">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-36 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse mb-6"></div>
          </div>
          {renderSkeletons()}
        </div>
      </div>
    );
  }

  const sortedAndFilteredUsers = getSortedUsers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Guide Component */}
      <UserGuide />
      <div className="bg-gradient-to-b from-white to-purple-50 rounded-lg shadow-lg overflow-hidden border border-purple-100">
        <div className=" p-6 border-b border-purple-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-900">
                User Management
              </h1>
              <button
                onClick={loadUsers}
                disabled={isRefreshing}
                className="ml-3 p-1 rounded-full text-gray-500 hover:text-purple-700 hover:bg-purple-100 transition-colors"
                title="Refresh users"
              >
                <RefreshCw
                  className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
            <button
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {showCreateForm ? (
                <>
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Administrator
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md shadow-sm flex items-center justify-between animate-fadeIn">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                {error}
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md shadow-sm flex items-center justify-between animate-fadeIn">
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                {success}
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {showCreateForm && (
            <form
              onSubmit={handleCreateUser}
              className="mb-6 bg-white p-6 rounded-lg border border-purple-200 shadow-md animate-fadeIn"
            >
              <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center border-b border-purple-100 pb-3">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                Create New Administrator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-purple-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-purple-400" />
                    </div>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="block w-full pl-10 pr-10 rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                      required
                      minLength={8}
                      placeholder="Minimum 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600 focus:outline-none"
                    >
                      {passwordVisible ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-purple-600">
                    * Must be at least 8 characters
                  </p>
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-purple-400" />
                    </div>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="confirmPassword"
                      value={newUser.confirmPassword}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                      required
                      placeholder="Confirm your password"
                    />
                  </div>
                  {newUser.password &&
                    newUser.confirmPassword &&
                    newUser.password !== newUser.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewUser({
                      email: "",
                      password: "",
                      confirmPassword: "",
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Administrator
                </button>
              </div>
            </form>
          )}

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search for an administrator..."
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="bg-gray-50 rounded p-3 mb-3 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total administrators:{" "}
              <span className="font-semibold">{users.length}</span>
            </div>
            <div className="text-sm text-gray-600">
              Showing:{" "}
              <span className="font-semibold">
                {sortedAndFilteredUsers.length}
              </span>{" "}
              result{sortedAndFilteredUsers.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {isRefreshing ? (
                // Show skeleton rows during refresh
                [1, 2, 3, 4].map((item) => (
                  <tr key={item} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                  </tr>
                ))
              ) : sortedAndFilteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <Search className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500 mb-1">
                        No administrators found
                      </p>
                      <p className="text-sm text-gray-400">
                        {searchTerm
                          ? "Try adjusting your search"
                          : "Add a new administrator using the button above"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedAndFilteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "superadmin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role === "superadmin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("fr-BE")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString("fr-BE")
                        : "Never logged in"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.role !== "superadmin" && (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                user.id,
                                user.status as "active" | "inactive"
                              )
                            }
                            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                              user.status === "active"
                                ? "text-green-600 hover:text-green-900"
                                : "text-red-600 hover:text-red-900"
                            }`}
                            title={
                              user.status === "active"
                                ? "Deactivate user"
                                : "Activate user"
                            }
                          >
                            {user.status === "active" ? (
                              <UserCheck className="h-5 w-5" />
                            ) : (
                              <UserX className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(user.id, user.email)
                            }
                            className="p-2 rounded-full text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

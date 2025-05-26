/**
 * Centralized API Service
 * Manages all HTTP requests to the backend
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// Base configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://avoltabackend-production.up.railway.app/api'
  : 'http://localhost:8090/api';
const REQUEST_TIMEOUT = 30000;

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: REQUEST_TIMEOUT,
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`API Response success: ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        console.error(`API Error for ${error.config?.url}:`, error);

        if (error.response?.status === 401) {
          console.log("Unauthorized access, redirecting to login");
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          window.location.href = "/login";
          return Promise.reject(
            new Error("Session expired. Please log in again.")
          );
        }

        let errorMessage = "An unexpected error occurred";

        // Améliorer l'extraction du message d'erreur
        if (error.response?.data) {
          const errorData = error.response.data as any;
          if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.details) {
            errorMessage = errorData.details;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        const enhancedError = new Error(errorMessage);
        return Promise.reject(enhancedError);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async get(endpoint: string): Promise<AxiosResponse> {
    return this.api.get(endpoint);
  }

  public async post(endpoint: string, data?: any, isFormData = false): Promise<AxiosResponse> {
    const config = isFormData ? {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    } : {};
    
    return this.api.post(endpoint, data, config);
  }

  public async put(endpoint: string, data?: any): Promise<AxiosResponse> {
    return this.api.put(endpoint, data);
  }

  public async delete(endpoint: string): Promise<AxiosResponse> {
    return this.api.delete(endpoint);
  }

  // MÉTHODE SPÉCIFIQUE POUR CLOUDINARY - AMÉLIORÉE
  public async uploadToCloudinary(file: File): Promise<AxiosResponse> {
    try {
      console.log("Uploading to Cloudinary via backend");
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const formData = new FormData();
      formData.append("file", file);
      
      // Ajouter des paramètres optionnels pour Cloudinary
      formData.append("upload_preset", ""); // Si vous avez un preset
      formData.append("folder", "publications"); // Optionnel: organiser en dossiers
      
      const response = await this.api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        timeout: 60000, // Timeout plus long pour les uploads
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      });

      console.log("Cloudinary upload response:", response.data);
      
      // Validation de la réponse
      if (!response.data) {
        throw new Error("Réponse vide du serveur");
      }

      return response;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      
      // Améliorer la gestion d'erreur pour Cloudinary
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const errorData = error.response.data as any;
          if (typeof errorData === 'string' && errorData.includes('Invalid extension in transformation')) {
            throw new Error("Erreur de configuration Cloudinary. Veuillez contacter l'administrateur.");
          } else if (errorData.message) {
            throw new Error(`Erreur Cloudinary: ${errorData.message}`);
          }
        } else if (error.response?.status === 413) {
          throw new Error("Le fichier est trop volumineux pour être uploadé");
        } else if (error.response?.status === 415) {
          throw new Error("Type de fichier non supporté");
        }
      }
      
      throw error;
    }
  }

  // GARDER VOTRE MÉTHODE EXISTANTE POUR LA COMPATIBILITÉ
  public async uploadImage(file: File): Promise<AxiosResponse> {
    try {
      console.log("Sending upload file request");
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const formData = new FormData();
      formData.append("file", file);
      
      const response = await this.api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        timeout: 60000, // Timeout plus long pour les uploads
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      });

      console.log("Upload response:", response.data);
      return response;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  }

  // Méthode pour définir le token
  public setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  // Méthode pour supprimer le token
  public clearToken(): void {
    localStorage.removeItem("token");
  }

  // Améliorer getImageUrl pour gérer les URLs Cloudinary
  public getImageUrl(filename: string): string {
    if (!filename) return '';
    
    // Si c'est déjà une URL complète (Cloudinary par exemple)
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // Pour les fichiers locaux
    const baseUrl = import.meta.env.PROD 
      ? 'https://avoltabackend-production.up.railway.app'
      : 'http://localhost:8090';
    
    return `${baseUrl}/api/uploads/${filename}`;
  }

  public async getImage(filename: string): Promise<Blob> {
    try {
      const response = await this.api.get(`/uploads/${filename}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Get image ${filename} failed:`, error);
      throw error;
    }
  }

  // Authentication
  public async login(email: string, password: string): Promise<AxiosResponse> {
    try {
      console.log("Sending login request");
      return await this.api.post("/auth/login", { email, password });
    } catch (error) {
      console.error("Login request failed:", error);
      throw error;
    }
  }

  public async register(userData: any): Promise<AxiosResponse> {
    try {
      console.log("Sending register request");
      return await this.api.post("/auth/register", userData);
    } catch (error) {
      console.error("Register request failed:", error);
      throw error;
    }
  }

  // Publications
  public async getPublications(): Promise<AxiosResponse> {
    try {
      return await this.api.get("/publications");
    } catch (error) {
      console.error("Get publications request failed:", error);
      throw error;
    }
  }

  public async getPublicationById(id: string): Promise<AxiosResponse> {
    try {
      console.log(`API Request: GET /publications/${id}`);
      const response = await this.api.get(`/publications/${id}`);
      console.log("API getPublicationById raw response:", response);
      return response;
    } catch (error) {
      console.error(`Get publication ${id} request failed:`, error);
      throw error;
    }
  }

  public async createPublication(data: any): Promise<AxiosResponse> {
    try {
      return await this.api.post("/publications", data);
    } catch (error) {
      console.error("Create publication request failed:", error);
      throw error;
    }
  }

  public async updatePublication(id: string, data: any): Promise<AxiosResponse> {
    try {
      return await this.api.put(`/publications/${id}`, data);
    } catch (error) {
      console.error(`Update publication ${id} request failed:`, error);
      throw error;
    }
  }

  public async deletePublication(id: string): Promise<AxiosResponse> {
    try {
      return await this.api.delete(`/publications/${id}`);
    } catch (error) {
      console.error(`Delete publication ${id} request failed:`, error);
      throw error;
    }
  }

  public async approvePublication(id: string): Promise<AxiosResponse> {
    try {
      return await this.api.put(`/publications/${id}/approve`);
    } catch (error) {
      console.error(`Approve publication ${id} request failed:`, error);
      throw error;
    }
  }

  public async rejectPublication(id: string): Promise<AxiosResponse> {
    try {
      return await this.api.put(`/publications/${id}/reject`);
    } catch (error) {
      console.error(`Reject publication ${id} request failed:`, error);
      throw error;
    }
  }

  // Comments
  public async getComments(publicationId: string): Promise<AxiosResponse> {
    try {
      return await this.api.get(`/publications/${publicationId}/comments`);
    } catch (error) {
      console.error(
        `Get comments for publication ${publicationId} request failed:`,
        error
      );
      throw error;
    }
  }

  public async addComment(publicationId: string, data: any): Promise<AxiosResponse> {
    try {
      return await this.api.post(`/publications/${publicationId}/comments`, data);
    } catch (error) {
      console.error(
        `Add comment to publication ${publicationId} request failed:`,
        error
      );
      throw error;
    }
  }

  public async deleteComment(publicationId: string, commentId: string): Promise<AxiosResponse> {
    try {
      return await this.api.delete(`/publications/${publicationId}/comments/${commentId}`);
    } catch (error) {
      console.error(`Delete comment ${commentId} request failed:`, error);
      throw error;
    }
  }

  // Newsletter
  public async getSubscribers(): Promise<AxiosResponse> {
    try {
      return await this.api.get("/newsletter/subscribers");
    } catch (error) {
      console.error("Get newsletter subscribers request failed:", error);
      throw error;
    }
  }

  public async subscribe(data: any): Promise<AxiosResponse> {
    try {
      return await this.api.post("/newsletter/subscribe", data);
    } catch (error) {
      console.error("Newsletter subscribe request failed:", error);
      throw error;
    }
  }

  public async unsubscribe(email: string): Promise<AxiosResponse> {
    try {
      return await this.api.delete(`/newsletter/unsubscribe/${email}`);
    } catch (error) {
      console.error(`Newsletter unsubscribe for ${email} request failed:`, error);
      throw error;
    }
  }

  // Users
  public async getUsers(): Promise<AxiosResponse> {
    try {
      return await this.api.get("/users");
    } catch (error) {
      console.error("Get users request failed:", error);
      throw error;
    }
  }

  public async updateUser(id: string, data: any): Promise<AxiosResponse> {
    try {
      return await this.api.put(`/users/${id}`, data);
    } catch (error) {
      console.error(`Update user ${id} request failed:`, error);
      throw error;
    }
  }

  public async deleteUser(id: string): Promise<AxiosResponse> {
    try {
      return await this.api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Delete user ${id} request failed:`, error);
      throw error;
    }
  }

  public async getPublicPublications(): Promise<AxiosResponse> {
    try {
      return await this.api.get("/publications/public/active");
    } catch (error) {
      console.error("Get public publications request failed:", error);
      throw error;
    }
  }

  public async getPublicationsByCategory(category: string): Promise<AxiosResponse> {
    try {
      return await this.api.get(`/publications/public/category/${category}`);
    } catch (error) {
      console.error(`Get publications by category ${category} request failed:`, error);
      throw error;
    }
  }

  public async getPendingPublications(): Promise<AxiosResponse> {
    try {
      return await this.api.get("/publications/pending");
    } catch (error) {
      console.error("Get pending publications request failed:", error);
      throw error;
    }
  }

  public async likePublication(id: string): Promise<AxiosResponse> {
    try {
      return await this.api.post(`/publications/public/${id}/like`);
    } catch (error) {
      console.error(`Like publication ${id} request failed:`, error);
      throw error;
    }
  }

  public async sendTestEmail(email: string): Promise<AxiosResponse> {
    try {
      return await this.api.post(`/newsletter/test?email=${email}`);
    } catch (error) {
      console.error(`Send test email to ${email} request failed:`, error);
      throw error;
    }
  }

  public async deleteSubscriber(id: string): Promise<AxiosResponse> {
    try {
      return await this.api.delete(`/newsletter/subscribers/${id}`);
    } catch (error) {
      console.error(`Delete subscriber ${id} request failed:`, error);
      throw error;
    }
  }

  public async updateUserStatus(id: string, status: "ACTIVE" | "INACTIVE"): Promise<AxiosResponse> {
    try {
      return await this.api.put(`/users/${id}/status?status=${status}`);
    } catch (error) {
      console.error(`Update user ${id} status to ${status} request failed:`, error);
      throw error;
    }
  }

  public async uploadFile(formData: FormData): Promise<AxiosResponse> {
    try {
      return await this.api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    } catch (error) {
      console.error("File upload request failed:", error);
      throw error;
    }
  }
}

export default ApiService.getInstance();
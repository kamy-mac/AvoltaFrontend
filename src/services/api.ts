/**
 * Centralized API Service
 * Manages all HTTP requests to the backend
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// Base configuration
const API_BASE_URL = "http://localhost:8090/api";
const REQUEST_TIMEOUT = 15000; // 15 seconds timeout

class ApiService {
  
  
  private api: AxiosInstance;
  private static instance: ApiService;
  post: any; // Replace 'Mock<any, any, any>' with 'any' or define/import 'Mock' if needed
  setToken: any;

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

        // Handle authentication errors
        if (error.response?.status === 401) {
          console.log("Unauthorized access, redirecting to login");
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          window.location.href = "/login";
          return Promise.reject(
            new Error("Session expired. Please log in again.")
          );
        }

        // Create a more informative error message
        let errorMessage = "An unexpected error occurred";

        if ((error.response?.data as { message?: string })?.message) {
          // Use server-side error message if available
          errorMessage =
            (error.response?.data as { message?: string })?.message ||
            errorMessage;
        } else if (error.message) {
          // Use axios error message
          errorMessage = error.message;
        }

        // Create a new error with the enhanced message
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

  // Cette fonction utilise la bonne route pour récupérer les détails d'une publication
public async getPublicationById(id: string): Promise<AxiosResponse> {
  try {
    console.log(`API Request: GET /publications/${id}`);
    // Ajouter des logs supplémentaires pour le débogage
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

  public async updatePublication(
    id: string,
    data: any
  ): Promise<AxiosResponse> {
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

  public async addComment(
    publicationId: string,
    data: any
  ): Promise<AxiosResponse> {
    try {
      return await this.api.post(
        `/publications/${publicationId}/comments`,
        data
      );
    } catch (error) {
      console.error(
        `Add comment to publication ${publicationId} request failed:`,
        error
      );
      throw error;
    }
  }

  public async deleteComment(
    publicationId: string,
    commentId: string
  ): Promise<AxiosResponse> {
    try {
      return await this.api.delete(
        `/publications/${publicationId}/comments/${commentId}`
      );
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
      console.error(
        `Newsletter unsubscribe for ${email} request failed:`,
        error
      );
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

  public async getPublicationsByCategory(
    category: string
  ): Promise<AxiosResponse> {
    try {
      return await this.api.get(`/publications/public/category/${category}`);
    } catch (error) {
      console.error(
        `Get publications by category ${category} request failed:`,
        error
      );
      throw error;
    }
  }

  //  User (super admin) spendid Publications
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

  public async updateUserStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE"
  ): Promise<AxiosResponse> {
    try {
      return await this.api.put(`/users/${id}/status?status=${status}`);
    } catch (error) {
      console.error(
        `Update user ${id} status to ${status} request failed:`,
        error
      );
      throw error;
    }
  }

/**
 * Upload an image file
 * @param file Image file to upload
 * @returns Response with the uploaded file URL
 */
public async uploadImage(file: File): Promise<AxiosResponse> {
  try {
    console.log("Sending upload file request");
    const formData = new FormData();
    formData.append("file", file);
    
    return await this.api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}
// Dans src/services/api.ts
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

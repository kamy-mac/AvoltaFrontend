/**
 * Types pour les requêtes et réponses API
 */

// Authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Publication
// Utilisateur
export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "SUPERADMIN";
  createdAt: Date;
  lastLogin?: Date;
  status: "ACTIVE" | "INACTIVE";
  // Ajout optionnel pour le nom d'affichage
  displayName?: string;
}

// Modification de PublicationRequest si nécessaire
export interface PublicationRequest {
  title: string;
  content: string;
  imageUrl?: string;
  validFrom: Date;
  validTo: Date;
  category: string;
  sendNewsletter?: boolean;
  // Ajout du nom d'affichage
  authorDisplayName?: string;
}

// Modification de PublicationResponse
export interface PublicationResponse {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  validFrom: Date;
  validTo: Date;
  createdAt: Date;
  category: string;
  status: "pending" | "published";
  author: User;
  // Ajout du nom d'affichage de l'auteur
  authorDisplayName?: string;
  comments: Comment[];
  likes: number;
}

// Commentaire
export interface CommentRequest {
  content: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  createdAt: Date;
  author: User;
}

// Newsletter
export interface NewsletterSubscriptionRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  confirmed: boolean;
  lastSentAt?: Date;
}

/* Utilisateur
export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "SUPERADMIN";
  createdAt: Date;
  lastLogin?: Date;
  status: "ACTIVE" | "INACTIVE";
}*/

// Réponse API générique
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
// Alias pour utilisation dans les services
export type Post = PublicationResponse;
export type Comment = CommentResponse;

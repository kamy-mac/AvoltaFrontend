/**
 * Newsletter Service
 *
 * This module provides functionality for managing newsletter subscriptions.
 *
 * @module services/newsletter
 */

import api from "./api";

/**
 * Newsletter subscriber interface
 */
export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  confirmed: boolean;
  lastSentAt?: string;
}

/**
 * Newsletter subscription request interface
 */
interface NewsletterSubscriptionRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Newsletter service
 */
class NewsletterService {
  /**
   * Get all newsletter subscribers (requires authentication)
   * @returns List of subscribers
   */
  public async getAllSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const response = await api.getSubscribers();
      return response.data.data;
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      throw error;
    }
  }

  /**
   * Subscribe to newsletter (public)
   * @param data Subscription data
   * @returns Created subscriber
   */
  public async subscribe(
    data: NewsletterSubscriptionRequest
  ): Promise<NewsletterSubscriber> {
    try {
      const response = await api.subscribe(data);
      return response.data.data;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  }

  /**
   * Unsubscribe from newsletter (public)
   * @param email Email address to unsubscribe
   */
  public async unsubscribe(email: string): Promise<void> {
    try {
      await api.unsubscribe(email);
    } catch (error) {
      console.error(`Error unsubscribing email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Delete a subscriber (requires authentication)
   * @param id Subscriber ID
   */
  public async deleteSubscriber(id: string): Promise<void> {
    try {
      await api.deleteSubscriber(id);
    } catch (error) {
      console.error(`Error deleting subscriber ${id}:`, error);
      throw error;
    }
  }

  /**
   * Send test email (requires authentication)
   * @param email Email address to send test to
   */
  public async sendTestEmail(email: string, selectedPublication: string): Promise<void> {
    try {
      console.log(`Sending test email for publication: ${selectedPublication}`);
      await api.sendTestEmail(email);
    } catch (error) {
      console.error(`Error sending test email to ${email}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const newsletterService = new NewsletterService();
export default newsletterService;

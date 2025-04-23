/**
 * User Service
 *
 * This module provides functionality for managing users.
 *
 * @module services/user
 */

import api from "./api";
import { User } from "../types";

/**
 * User service
 */
class UserService {
  /**
   * Get all users (super admin only)
   * @returns List of users
   */
  public async getAllUsers(): Promise<User[]> {
    try {
      console.log("Fetching all users...");
      const response = await api.getUsers();
      console.log("Users API response:", response);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  /**
   * Get user by ID (super admin only)
   * @param id User ID
   * @returns User details
   */
  public async getUserById(id: string): Promise<User> {
    try {
      // Implement a specific API call if available
      const response = await api.getUsers(); // Replace with api.getUserById(id) if available
      const user = response.data.data.find((u: User) => u.id === id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update user status (super admin only)
   * @param id User ID
   * @param status New status
   * @returns Updated user
   */
  public async updateUserStatus(
    id: string,
    status: "active" | "inactive"
  ): Promise<User> {
    try {
      console.log(`Updating status for user ${id} to ${status}...`);
      // Convert status string to enum format expected by the backend
      const apiStatus = status.toUpperCase() as "ACTIVE" | "INACTIVE";

    if (apiStatus !== "ACTIVE" && apiStatus !== "INACTIVE") {
      throw new Error(`Invalid status: ${apiStatus}`);
    }

      const response = await api.updateUserStatus(id, apiStatus);
      console.log("Update user status response:", response);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating status for user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete user (super admin only)
   * @param id User ID
   */
  public async deleteUser(id: string): Promise<void> {
    try {
      console.log(`Deleting user ${id}...`);
      await api.deleteUser(id);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const userService = new UserService();
export default userService;
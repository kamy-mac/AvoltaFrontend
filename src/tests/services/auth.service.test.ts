/**
 * Tests for auth service
 */

import authService from '../../services/auth.service';
import api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login should call API and set token', async () => {
    // Mock API response
    const mockResponse = {
      token: 'test-token',
      user: {
        id: '1',
        email: 'test@example.com',
        role: 'admin',
        createdAt: new Date(),
        status: 'active'
      }
    };
    
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    // Call login
    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123'
    });

    // Check if API was called correctly
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });

    // Check if token was set
    expect(api.setToken).toHaveBeenCalledWith('test-token');

    // Check if result is correct
    expect(result).toEqual(mockResponse);
  });

  test('logout should clear token and redirect', () => {
    // Mock localStorage
    const localStorageMock = {
      removeItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    // Mock window.location
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { href: '/login' },
      writable: true
    });

    // Call logout
    authService.logout();

    // Check if localStorage items were removed
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('currentUser');

    // Check if redirect was performed
    expect(window.location.href).toBe('/login');

    // Restore original window.location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true
    });
  });

  test('getCurrentUser should return user from localStorage', () => {
    // Mock user data in localStorage
    const mockUser = { id: '1', email: 'test@example.com', role: 'admin' };
    const getItemMock = jest.fn().mockReturnValue(JSON.stringify(mockUser));
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: getItemMock },
      writable: true
    });

    // Call getCurrentUser
    const result = authService.getCurrentUser();

    // Check if localStorage was accessed
    expect(getItemMock).toHaveBeenCalledWith('currentUser');

    // Check if user is correctly returned
    expect(result).toEqual(mockUser);
  });

  test('isAuthenticated should return true when token exists', () => {
    // Mock token in localStorage
    const getItemMock = jest.fn().mockReturnValue('test-token');
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: getItemMock },
      writable: true
    });

    // Call isAuthenticated
    const result = authService.isAuthenticated();

    // Check if localStorage was accessed
    expect(getItemMock).toHaveBeenCalledWith('token');

    // Check if result is correct
    expect(result).toBe(true);
  });

  test('isAuthenticated should return false when token does not exist', () => {
    // Mock no token in localStorage
    const getItemMock = jest.fn().mockReturnValue(null);
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: getItemMock },
      writable: true
    });

    // Call isAuthenticated
    const result = authService.isAuthenticated();

    // Check if localStorage was accessed
    expect(getItemMock).toHaveBeenCalledWith('token');

    // Check if result is correct
    expect(result).toBe(false);
  });
});
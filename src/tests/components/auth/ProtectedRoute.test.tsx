/**
 * Tests for ProtectedRoute component
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';

// Mock the auth context
jest.mock('../../../context/AuthContext');

describe('ProtectedRoute', () => {
  test('renders children when user is authenticated', () => {
    // Mock the auth context to return authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Check if the protected content is rendered
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    // Mock the auth context to return not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    // We need to use Routes to test navigation
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute>
              <div data-testid="protected-content">Protected Content</div>
            </ProtectedRoute>
          } />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Check if redirected to login page
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});
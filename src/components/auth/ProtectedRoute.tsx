import React from 'react';
import authService from '../../services/auth.service';

/**
 * Protected route props
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'SUPERADMIN';
  onUnauthorized?: () => void;
}

/**
 * Protected route component
 * 
 * Renders children only if user is authenticated and has required role
 * Calls onUnauthorized callback if not authenticated or lacks required permissions
 */
export default function ProtectedRoute({ 
  children, 
  requiredRole,
  onUnauthorized 
}: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // Check authentication and role
  if (!isAuthenticated) {
    // Call unauthorized callback or handle unauthorized access
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      // Default behavior: redirect to login (simulated)
      window.location.href = "/login";
    }
    return null;
  }

  // If a specific role is required, check user's role
  if (requiredRole && currentUser?.role.toLowerCase() !== requiredRole.toLowerCase()) {
    // Call unauthorized callback or handle insufficient permissions
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      // Default behavior: redirect to unauthorized page (simulated)
      window.location.href = "/unauthorized";
    }
    return null;
  }

  // If authenticated and role check passes, render children
  return <>{children}</>;
}
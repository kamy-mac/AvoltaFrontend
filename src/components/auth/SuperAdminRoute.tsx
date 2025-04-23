import React from 'react';
import authService from '../../services/auth.service';

/**
 * Super admin route props
 */
interface SuperAdminRouteProps {
  children: React.ReactNode;
  onUnauthorized?: () => void;
}

/**
 * Super admin route component
 * 
 * Renders children only if user is a super admin, 
 * otherwise handles unauthorized access
 */
export default function SuperAdminRoute({ 
  children, 
  onUnauthorized 
}: SuperAdminRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const isSuperAdmin = authService.isSuperAdmin();

  // Check if user is authenticated and is a super admin
  if (!isAuthenticated || !isSuperAdmin) {
    // Call unauthorized callback if provided
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      // Default behavior: redirect to admin dashboard
      window.location.href = "/admin";
    }
    return null;
  }

  // If authenticated and is super admin, render children
  return <>{children}</>;
}

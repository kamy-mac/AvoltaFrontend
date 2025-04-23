import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User } from '../types';
import authService from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean; // Included loading state in context
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Use a ref to track if component is still mounted
  const isMounted = useRef(true);

  useEffect(() => {
    // Set up the mounted flag
    isMounted.current = true;
    
    // Initialize auth state with proper async handling
    const initializeAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        
        // Check if user is valid
        if (currentUser && currentUser.id && currentUser.email) {
          // Only set state if component is still mounted
          if (isMounted.current) {
            setUser(currentUser);
            console.log("Current user from localStorage:", currentUser);
          }
        } else {
          console.log("No valid user found in localStorage");
          // Ensure user is null if no valid user was found
          if (isMounted.current) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Ensure user is null in case of error
        if (isMounted.current) {
          setUser(null);
        }
      } finally {
        // Only set state if component is still mounted
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
  
    // Start auth initialization
    initializeAuth();
    
    // Cleanup function to update mounted flag
    return () => {
      isMounted.current = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    // Use a local loading state for login process
    if (isMounted.current) {
      setIsLoading(true);
    }
    
    try {
      // Create login request object
      const credentials = { email, password };
      
      // Call auth service with proper credentials object
      const response = await authService.login(credentials);
      
      if (!response || !response.user) {
        throw new Error("Invalid response format from server");
      }
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      // Only update state if component is still mounted
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const logout = () => {
    // Only update state if component is still mounted
    if (isMounted.current) {
      setIsLoading(true);
    }
    
    authService.logout();
    
    // Only update state if component is still mounted
    if (isMounted.current) {
      setUser(null);
      setIsLoading(false);
    }
  };

  // Safely calculate if user is a super admin
  const isSuperAdmin = !!user && user.role.toLowerCase() === 'superadmin';
  
  // Values to export in the context
  const contextValue: AuthContextType = {
    user,
    setUser,
    isAuthenticated: !!user,
    isSuperAdmin,
    isLoading,
    login,
    logout
  };

  // Logging for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log("Auth context - user:", user);
    console.log("Auth context - isSuperAdmin:", isSuperAdmin);
    console.log("Auth context - isLoading:", isLoading);
  }

  // Return the provider with all children, even during loading
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
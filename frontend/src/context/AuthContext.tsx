import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse } from '../services/authService';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const initializeAuth = () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Tentative de connexion...');
      const response: AuthResponse = await authService.login({ email, password });
      
      console.log('AuthContext: Connexion réussie, réponse:', response);
      
      // Mise à jour immédiate du contexte avec les données de la réponse
      setUser(response.user);
      
      console.log('AuthContext: Utilisateur défini:', response.user);
      
    } catch (error) {
      console.error('AuthContext: Erreur de connexion:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      console.log('AuthContext: Tentative d\'inscription...');
      const response: AuthResponse = await authService.register(data);
      
      console.log('AuthContext: Inscription réussie, réponse:', response);
      
      // Mise à jour immédiate du contexte avec les données de la réponse
      setUser(response.user);
      
      console.log('AuthContext: Utilisateur défini:', response.user);
      
    } catch (error) {
      console.error('AuthContext: Erreur d\'inscription:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Déconnexion...');
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
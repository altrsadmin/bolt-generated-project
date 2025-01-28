
import { useState, useEffect, createContext, ReactNode } from 'react';
import { logger } from '../lib/utils/logger';

type User = {
  id: string;
  email: string;
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const defaultUser: User = {
  id: 'local-user-001',
  email: 'admin@arelis.local',
  created_at: new Date().toISOString()
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = () => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        setUser(parsedData.user);
        setIsAuthenticated(true);
        logger.debug('Sessão local carregada', parsedData);
      } catch (error) {
        logger.error('Erro ao analisar dados de autenticação', error);
        clearAuth();
      }
    } else {
      clearAuth();
    }
    setIsLoading(false);
  };

  const clearAuth = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
  };

  useEffect(() => {

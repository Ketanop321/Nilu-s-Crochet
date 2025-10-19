import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, getErrorMessage } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'customer';
  profile?: {
    full_name?: string;
    phone?: string;
    avatar?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    };
  };
  // Legacy support for direct full_name property
  full_name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on app start
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data } = await authAPI.login({ username, password });

      if (!data?.token) {
        throw new Error('No authentication token received');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const { data } = await authAPI.register(userData);

      if (!data?.token) {
        throw new Error('No authentication token received after registration');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
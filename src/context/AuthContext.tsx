import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('dentalcare_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (username === 'admin' && password === 'admin') {
      const adminUser: User = {
        id: 'U001',
        name: 'Dr. Smith',
        email: 'dr.smith@dentalcare.com',
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('dentalcare_user', JSON.stringify(adminUser));
      return true;
    }
    if (username === 'patient' && password === 'patient') {
      const patientUser: User = {
        id: 'P001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        role: 'patient',
      };
      setUser(patientUser);
      localStorage.setItem('dentalcare_user', JSON.stringify(patientUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dentalcare_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

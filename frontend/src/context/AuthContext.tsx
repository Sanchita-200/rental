import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { authApi, LoginPayload, RegisterPayload } from '../api/auth.api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (arg1: any, arg2?: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  forgotPassword: (email: string) => Promise<{ message: string; reset_url?: string; reset_token?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfigured] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('rentflow_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user session", error);
          localStorage.removeItem('rentflow_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (arg1: any, arg2?: string) => {
    let payload: LoginPayload;
    if (typeof arg1 === 'string') {
      payload = { email: arg1, password: arg2 || '' };
    } else {
      payload = arg1;
    }

    const res = await authApi.login(payload);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('rentflow_token', res.access_token);
  };

  const register = async (payload: any) => {
    let full_name = payload.full_name;
    if (!full_name) {
      const parts = [payload.firstName, payload.lastName].filter(Boolean);
      full_name = parts.length > 0 ? parts.join(' ') : 'User';
    }

    // Admin and Vendor are the same role in the DB
    let role = (payload.role || 'CUSTOMER').toUpperCase();
    if (role === 'VENDOR' || role === 'ADMIN') {
      role = 'ADMIN';
    }

    const cleanPayload: RegisterPayload = {
      email: payload.email,
      password: payload.password,
      full_name,
      phone: payload.phone || undefined,
      role: role,
    };

    const res = await authApi.register(cleanPayload);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('rentflow_token', res.access_token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rentflow_token');
    localStorage.removeItem('rentflow_cart');
    window.location.href = '/login';
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: newRole.toUpperCase() as UserRole });
    }
  };

  const forgotPassword = async (email: string) => {
    return await authApi.forgotPassword(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await authApi.resetPassword({ token, new_password: newPassword });
  };

  const updateUserPassword = async (password: string) => {
    console.warn("Update user password via reset flow");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isConfigured,
        login,
        register,
        logout,
        switchRole,
        forgotPassword,
        resetPassword,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

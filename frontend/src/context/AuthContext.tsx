import React, { createContext, useContext } from 'react';
import { SupabaseAuthProvider, useSupabaseAuth } from './SupabaseAuthContext';
import type { User, UserRole } from '../types';
import type { LoginPayload, RegisterPayload } from '../api/auth.api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SupabaseAuthProvider>
      <AuthContextBridge>{children}</AuthContextBridge>
    </SupabaseAuthProvider>
  );
};

const AuthContextBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseAuth = useSupabaseAuth();

  // Convert Supabase UserProfile to legacy User format
  const mappedUser: User | null = supabaseAuth.user
    ? {
        id: supabaseAuth.user.id,
        email: supabaseAuth.user.email,
        full_name: supabaseAuth.user.full_name,
        phone: supabaseAuth.user.phone,
        role: (supabaseAuth.user.role.toUpperCase() as UserRole) || 'CUSTOMER',
        avatar_url: supabaseAuth.user.avatar_url,
        kyc_status: 'VERIFIED',
      }
    : null;

  const login = async (payload: LoginPayload) => {
    await supabaseAuth.login(payload.email, payload.password);
  };

  const register = async (payload: RegisterPayload) => {
    const nameParts = payload.full_name ? payload.full_name.split(' ') : ['User', ''];
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || '';
    const role = (payload.role ? payload.role.toLowerCase() : 'customer') as any;

    await supabaseAuth.register({
      email: payload.email,
      password: payload.password,
      firstName,
      lastName,
      phone: payload.phone,
      role,
    });
  };

  const logout = () => {
    supabaseAuth.logout();
  };

  const switchRole = (newRole: UserRole) => {
    supabaseAuth.switchRole(newRole.toLowerCase() as any);
  };

  return (
    <AuthContext.Provider
      value={{
        user: mappedUser,
        token: supabaseAuth.session?.access_token || 'supabase_session_active',
        isLoading: supabaseAuth.isLoading,
        isConfigured: supabaseAuth.isConfigured,
        login,
        register,
        logout,
        switchRole,
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

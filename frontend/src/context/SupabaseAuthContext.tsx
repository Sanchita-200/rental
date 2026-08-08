import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { supabaseAuthService } from '../services/supabaseAuth.service';
import { SignUpData, UserProfile, UserRole } from '../types/supabase.types';

interface SupabaseAuthContextType {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session & listen to auth state changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured) {
        // Fallback demo state if Supabase credentials are not added yet
        const savedDemo = localStorage.getItem('rentflow_demo_user');
        if (savedDemo) {
          try {
            setUser(JSON.parse(savedDemo));
          } catch {
            setUser({
              id: 'demo-admin-id',
              email: 'admin@rentflow.com',
              first_name: 'Admin',
              last_name: 'User',
              full_name: 'Admin User',
              role: 'admin',
              created_at: new Date().toISOString(),
            });
          }
        } else {
          setUser({
            id: 'demo-admin-id',
            email: 'admin@rentflow.com',
            first_name: 'Admin',
            last_name: 'User',
            full_name: 'Admin User',
            role: 'admin',
            created_at: new Date().toISOString(),
          });
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(currentSession);
          if (currentSession?.user) {
            await fetchUserProfile(currentSession.user.id, currentSession.user);
          } else {
            setUser(null);
          }
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    // Subscribe to auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id, currentSession.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Helper to fetch profile from database or raw user metadata
  const fetchUserProfile = async (userId: string, authUser: any) => {
    try {
      const dbProfile = await supabaseAuthService.getProfile(userId);
      if (dbProfile) {
        setUser(dbProfile);
      } else {
        const meta = authUser.user_metadata || {};
        const fallbackProfile: UserProfile = {
          id: userId,
          email: authUser.email || '',
          first_name: meta.first_name || 'User',
          last_name: meta.last_name || '',
          full_name: meta.full_name || authUser.email || '',
          phone: meta.phone,
          role: (meta.role as UserRole) || 'customer',
          company_name: meta.company_name,
          gst_number: meta.gst_number,
          product_category: meta.product_category,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(meta.full_name || authUser.email)}`,
          created_at: authUser.created_at || new Date().toISOString(),
        };
        setUser(fallbackProfile);
      }
    } catch (err) {
      console.warn('Profile fetch warning:', err);
    }
  };

  const login = async (email: string, pw: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        // Fallback for offline/unconfigured testing
        const role: UserRole = email.includes('admin') ? 'admin' : email.includes('vendor') ? 'vendor' : 'customer';
        const demoUser: UserProfile = {
          id: 'demo-user-id',
          email,
          first_name: email.split('@')[0],
          last_name: 'User',
          full_name: `${email.split('@')[0]} User`,
          role,
          created_at: new Date().toISOString(),
        };
        setUser(demoUser);
        localStorage.setItem('rentflow_demo_user', JSON.stringify(demoUser));
        setIsLoading(false);
        return;
      }

      const res = await supabaseAuthService.signIn(email, pw);
      if (res.user) {
        await fetchUserProfile(res.user.id, res.user);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: SignUpData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        const fullName = `${data.firstName} ${data.lastName}`.trim();
        const demoUser: UserProfile = {
          id: `demo-${Date.now()}`,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          full_name: fullName,
          phone: data.phone,
          role: data.role,
          company_name: data.companyName,
          gst_number: data.gstNumber,
          product_category: data.productCategory,
          created_at: new Date().toISOString(),
        };
        setUser(demoUser);
        localStorage.setItem('rentflow_demo_user', JSON.stringify(demoUser));
        setIsLoading(false);
        return;
      }

      const res = await supabaseAuthService.signUp(data);
      if (res.user) {
        await fetchUserProfile(res.user.id, res.user);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabaseAuthService.signOut();
      }
      localStorage.removeItem('rentflow_demo_user');
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await supabaseAuthService.resetPasswordForEmail(email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserPassword = async (pw: string) => {
    setError(null);
    try {
      await supabaseAuthService.updatePassword(pw);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('rentflow_demo_user', JSON.stringify(updated));
    }
  };

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        error,
        login,
        register,
        logout,
        resetPassword,
        updateUserPassword,
        switchRole,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

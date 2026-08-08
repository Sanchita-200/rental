import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SignUpData, UserProfile } from '../types/supabase.types';

export const supabaseAuthService = {
  /**
   * Register a new user with Supabase Auth
   */
  async signUp(data: SignUpData) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase project is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env.');
    }

    const fullName = `${data.firstName} ${data.lastName}`.trim();

    // 1. Call Supabase Auth SignUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          full_name: fullName,
          phone: data.phone,
          role: data.role,
          company_name: data.companyName,
          gst_number: data.gstNumber,
          product_category: data.productCategory,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed.');

    // 2. Insert/Upsert into profiles table explicitly as a fallback
    const profilePayload: Partial<UserProfile> = {
      id: authData.user.id,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      full_name: fullName,
      phone: data.phone,
      role: data.role,
      company_name: data.companyName,
      gst_number: data.gstNumber,
      product_category: data.productCategory,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload);

    if (profileError) {
      console.warn('Profile upsert warning:', profileError.message);
    }

    return { user: authData.user, session: authData.session };
  },

  /**
   * Log in user with Email & Password
   */
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase project is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message === 'Invalid login credentials' ? 'Invalid user id and password' : error.message);
    }

    return data;
  },

  /**
   * Log out current user
   */
  async signOut() {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Send Password Reset Email
   */
  async resetPasswordForEmail(email: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase project is not configured.');
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Update User Password (after clicking reset link)
   */
  async updatePassword(newPassword: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase project is not configured.');
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch Profile from `profiles` Table
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Could not fetch user profile:', error.message);
      return null;
    }

    return data as UserProfile;
  },

  /**
   * Update Profile Table
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  },
};

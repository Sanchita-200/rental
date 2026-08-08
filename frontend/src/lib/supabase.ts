import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ilqvrorwfozosigglnuc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlscXZyb3J3Zm96b3NpZ2dsbnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNzM1NTAsImV4cCI6MjEwMTc0OTU1MH0.HecgjMCsQJeAFzQDHFznqHcEFMEEmG5bnLDjbour7nI';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'rentflow_supabase_auth_session',
  },
});

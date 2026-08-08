export type UserRole = 'customer' | 'admin' | 'vendor';

export interface UserProfile {
  id: string; // References auth.users.id
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  company_name?: string;
  gst_number?: string;
  product_category?: string;
  created_at: string;
  updated_at?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  companyName?: string;
  gstNumber?: string;
  productCategory?: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
}

export type UserRole = 'ADMIN' | 'CUSTOMER';
export type KYCStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  kyc_status: KYCStatus;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export type ProductStatus = 'AVAILABLE' | 'MAINTENANCE' | 'DISCONTINUED';
export type ConditionStatus = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_REPAIR';

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  variant_name: string;
  serial_number: string;
  qr_code_identifier: string;
  condition_status: ConditionStatus;
  is_available: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  base_daily_rate: number;
  security_deposit_amount: number;
  images: string[];
  status: ProductStatus;
  category?: Category;
  variants: ProductVariant[];
}

export type RentalStatus = 'RESERVED' | 'PICKED_UP' | 'RETURNED' | 'OVERDUE' | 'CANCELLED';

export interface RentalItem {
  id: string;
  product_variant_id: string;
  daily_rate: number;
  security_deposit: number;
  rental_days: number;
  item_subtotal: number;
  product_variant?: ProductVariant;
}

export type DepositStatus = 'HELD' | 'REFUNDED' | 'PARTIALLY_FORFEITED' | 'FORFEITED';

export interface SecurityDeposit {
  id: string;
  held_amount: number;
  refunded_amount: number;
  forfeited_amount: number;
  status: DepositStatus;
  forfeiture_reason?: string;
}

export interface Rental {
  id: string;
  rental_code: string;
  user_id: string;
  status: RentalStatus;
  start_date: string;
  end_date: string;
  actual_return_date?: string;
  subtotal_rent_amount: number;
  total_deposit_amount: number;
  total_late_fee: number;
  grand_total: number;
  qr_pass_token: string;
  created_at: string;
  user?: User;
  items: RentalItem[];
  deposit?: SecurityDeposit;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CalculateItemSummary {
  product_id: string;
  title: string;
  daily_rate: number;
  security_deposit: number;
  rental_days: number;
  rent_subtotal: number;
  deposit_subtotal: number;
  is_available: boolean;
}

export interface RentalCalculateResponse {
  rental_days: number;
  items_breakdown: CalculateItemSummary[];
  total_rent: number;
  total_deposit: number;
  grand_total: number;
  is_valid: boolean;
  validation_message?: string;
}

export interface OverviewKPIs {
  total_revenue: number;
  active_rentals_count: number;
  overdue_rentals_count: number;
  total_inventory_items: number;
  available_items_count: number;
  utilization_rate: number;
}

export interface RevenuePoint {
  date: string;
  rental_income: number;
  late_fee_income: number;
  total_revenue: number;
}

export interface QRVerificationResponse {
  valid: boolean;
  message: string;
  action_type: 'PICKUP' | 'RETURN' | 'UNKNOWN';
  rental?: Rental;
  calculated_late_fee: number;
  overdue_days: number;
}

export interface AIChatResponse {
  reply: string;
  suggested_actions: string[];
}

export interface AIInsightsResponse {
  executive_summary: string;
  revenue_optimization_tips: string[];
  high_demand_categories: string[];
  overdue_risk_alerts: string[];
}

export interface AIDemandForecastItem {
  category_name: string;
  projected_demand_growth: string;
  pricing_recommendation: string;
}

export interface AIDemandForecastResponse {
  forecast_period: string;
  forecasts: AIDemandForecastItem[];
}

// Types for Medina Oud e-commerce

export interface ProductVariant {
  id: number;
  product_id: number;
  size: string;
  sku: string;
  price: number;
  promo_price?: number;
  stock_qty: number;
  is_in_stock: boolean;
  is_low_stock: boolean;
  is_active: boolean;
  is_default: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  product_count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category?: Category;
  origin: string;
  grade: string;
  intensity: 'low' | 'medium' | 'high';
  profile: string;
  image_url: string;
  additional_images: string[];
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  rating: number;
  review_count: number;
  tags: string[];
  base_price: number;
  base_promo_price?: number;
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface Customer {
  id: number;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_registered: boolean;
  is_active: boolean;
  preferred_language: string;
  marketing_consent: boolean;
  stats?: {
    total_orders: number;
    total_spent: number;
  };
}

export interface OrderItem {
  id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_size: string;
  unit_price: number;
  promo_price?: number;
  quantity: number;
  line_total: number;
  product_image?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer?: Customer;
  shipping: {
    address: string;
    city: string;
    postal_code: string;
    country: string;
  };
  totals: {
    subtotal: number;
    shipping_cost: number;
    discount_amount: number;
    tax_amount: number;
    total_amount: number;
    currency: string;
  };
  status: string;
  payment_status: string;
  payment_method?: string;
  tracking_number?: string;
  notes?: string;
  promo_code?: string;
  promo_discount: number;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

export interface Promotion {
  id: number;
  name: string;
  code?: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  per_customer_limit: number;
  starts_at?: string;
  ends_at?: string;
  is_active: boolean;
  is_auto_apply: boolean;
  is_valid: boolean;
  banner_text?: string;
  banner_color: string;
}

export interface FeatureFlag {
  id: number;
  key: string;
  name: string;
  description?: string;
  value_type: 'boolean' | 'string' | 'number' | 'json';
  value: any;
  section_title?: string;
  section_subtitle?: string;
  display_order: number;
  is_enabled: boolean;
}

export interface HomepageSection {
  id: number;
  key: string;
  name: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  image_url?: string;
  display_order: number;
  is_enabled: boolean;
  background_color?: string;
  text_color?: string;
  section_type: string;
  product_filter?: string;
  product_limit: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  description?: string;
  options: QuizOption[];
  multiple?: boolean;
}

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  profiles?: string[];
  occasions?: string[];
  intensity?: 'low' | 'medium' | 'high';
}

export interface QuizResult {
  profile: string;
  intensity: 'low' | 'medium' | 'high';
  occasion: string;
  recommendedProducts: Product[];
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
}

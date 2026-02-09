// Types pour le site e-commerce Oud Premium

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  intensity: 'low' | 'medium' | 'high';
  profile: OlfactoryProfile;
  occasion: Occasion[];
  formats: ProductFormat[];
  origin: string;
  grade: 'premium' | 'superieure' | 'elite';
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  tags: string[];
  details: ProductDetails;
  usage: UsageInstructions;
  faq: ProductFaq[];
}

export interface ProductFormat {
  size: '10g' | '50g' | '100g' | '200g';
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export type OlfactoryProfile = 
  | 'boise' 
  | 'epice' 
  | 'doux' 
  | 'fume' 
  | 'sucre' 
  | 'floral' 
  | 'resineux';

export type Occasion = 
  | 'quotidien' 
  | 'special' 
  | 'priere' 
  | 'meditation' 
  | 'cadeau' 
  | 'hotes';

export interface ProductDetails {
  origin: string;
  woodType: string;
  aging: string;
  oilContent: string;
  burningTime: string;
  intensity: number; // 1-10
}

export interface UsageInstructions {
  preparation: string;
  burning: string;
  tips: string[];
  safety: string[];
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  products: BundleItem[];
  accessories: Accessory[];
  totalPrice: number;
  bundlePrice: number;
  savings: number;
  isStarterKit?: boolean;
}

export interface BundleItem {
  product: Product;
  format: string;
  quantity: number;
}

export interface Accessory {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'bruleur' | 'charbon' | 'pince' | 'recharge' | 'ensemble';
  inStock: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  format: string;
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
  icon?: string;
  profiles?: OlfactoryProfile[];
  occasions?: Occasion[];
  intensity?: 'low' | 'medium' | 'high';
}

export interface QuizResult {
  profile: OlfactoryProfile;
  intensity: 'low' | 'medium' | 'high';
  occasion: Occasion;
  recommendedProducts: Product[];
  recommendedBundle?: Bundle;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  images?: string[];
  helpful: number;
}

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: number;
  publishedAt: string;
  featured?: boolean;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface ShippingInfo {
  zone: string;
  delay: string;
  price: number;
  freeThreshold: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  shipping: ShippingInfo;
  payment: PaymentMethod;
  status: OrderStatus;
  total: number;
  createdAt: string;
  trackingNumber?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SocialProof {
  type: 'review' | 'purchase' | 'notification';
  content: string;
  author?: string;
  location?: string;
  timeAgo: string;
  product?: string;
}

import type { Product, Category, Order, Customer } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Helper for API requests
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || `HTTP ${response.status}`,
      };
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Products API
export const productsAPI = {
  getAll: (params?: {
    page?: number;
    per_page?: number;
    category?: string;
    intensity?: string;
    profile?: string;
    origin?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
    is_bestseller?: boolean;
    is_new?: boolean;
    search?: string;
  }) => fetchAPI<{ data: Product[]; pagination: any }>(`/products/?${new URLSearchParams(params as any).toString()}`),

  getBySlug: (slug: string) => fetchAPI<{ product: Product; related_products: Product[] }>(`/products/${slug}`),

  getFeatured: (limit = 4) => fetchAPI<Product[]>(`/products/featured?limit=${limit}`),

  getBestsellers: (limit = 4) => fetchAPI<Product[]>(`/products/bestsellers?limit=${limit}`),

  getNew: (limit = 4) => fetchAPI<Product[]>(`/products/new?limit=${limit}`),

  getCategories: () => fetchAPI<Category[]>('/products/categories'),

  getFilters: () => fetchAPI<{ origins: string[]; profiles: string[]; intensities: string[]; price_range: { min: number; max: number } }>('/products/filters'),
};

// Orders API
export const ordersAPI = {
  create: (orderData: {
    items: { variant_id: number; quantity: number }[];
    customer: { full_name: string; email: string; phone: string };
    shipping: { address: string; city: string; postal_code: string; country?: string };
    promo_code?: string;
    payment_method?: string;
    notes?: string;
  }) => fetchAPI<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  getById: (id: number) => fetchAPI<Order>(`/orders/${id}`),

  validatePromo: (code: string, orderAmount: number) => fetchAPI<{
    code: string;
    name: string;
    discount_type: string;
    discount_value: number;
    discount_amount: number;
  }>('/orders/validate-promo', {
    method: 'POST',
    body: JSON.stringify({ code, order_amount: orderAmount }),
  }),
};

// Public API (homepage data, config)
export const publicAPI = {
  getConfig: () => fetchAPI<{
    promotions: any[];
    features: Record<string, any>;
    homepage_sections: any[];
    store_info: any;
  }>('/config'),

  getHomepage: () => fetchAPI<{
    featured_products: Product[];
    bestsellers: Product[];
    new_arrivals: Product[];
    promotions: any[];
    features: Record<string, any>;
    homepage_sections: any[];
  }>('/homepage'),
};

// Customers API
export const customersAPI = {
  create: (customerData: Partial<Customer>) => fetchAPI<Customer>('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),
};

export default {
  products: productsAPI,
  orders: ordersAPI,
  public: publicAPI,
  customers: customersAPI,
};

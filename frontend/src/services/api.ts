import type { Product, Category, Order, Customer } from '@/types';

const RAW_API_BASE_URL = (import.meta.env.VITE_API_URL || '').trim();
const DEFAULT_LOCAL_API = 'http://localhost:5000/api/v1';
const APP_BASE_URL = import.meta.env.BASE_URL || '/';
const IS_LOCALHOST =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE_URL =
  RAW_API_BASE_URL.startsWith('http://') || RAW_API_BASE_URL.startsWith('https://')
    ? RAW_API_BASE_URL
    : IS_LOCALHOST
      ? DEFAULT_LOCAL_API
      : (RAW_API_BASE_URL || DEFAULT_LOCAL_API);

type ApiProductVariant = {
  id?: number;
  size: string;
  price: number;
  promo_price?: number | null;
  is_in_stock?: boolean;
};

type ApiProduct = {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  base_price?: number;
  base_promo_price?: number | null;
  image_url?: string;
  additional_images?: string[];
  category?: { slug?: string } | string | null;
  intensity?: string;
  profile?: string;
  origin?: string;
  grade?: string;
  rating?: number;
  review_count?: number;
  is_bestseller?: boolean;
  is_new?: boolean;
  tags?: string[];
  variants?: ApiProductVariant[];
};

function toMediaUrl(path?: string): string {
  if (!path) return `${APP_BASE_URL}images/placeholder.jpg`;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/images/')) {
    return `${APP_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
  return path;
}

function mapProduct(apiProduct: ApiProduct): Product {
  const variants = (apiProduct.variants || []).map((variant) => ({
    variantId: variant.id,
    size: variant.size,
    price: variant.promo_price ?? variant.price,
    originalPrice: variant.promo_price ? variant.price : undefined,
    inStock: variant.is_in_stock ?? true,
  }));

  const fallbackPrice = apiProduct.base_promo_price ?? apiProduct.base_price ?? 0;
  const formats = variants.length > 0
    ? variants
    : [{
        size: 'Standard',
        price: fallbackPrice,
        originalPrice: apiProduct.base_promo_price ? apiProduct.base_price : undefined,
        inStock: true,
      }];

  const primaryImage = toMediaUrl(apiProduct.image_url);
  const gallery = (apiProduct.additional_images || []).map((img) => toMediaUrl(img));
  const images = Array.from(new Set([primaryImage, ...gallery].filter(Boolean)));

  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description || '',
    shortDescription: apiProduct.short_description || '',
    price: fallbackPrice,
    originalPrice: apiProduct.base_promo_price ? apiProduct.base_price : undefined,
    images: images.length > 0 ? images : [`${APP_BASE_URL}images/placeholder.jpg`],
    category: typeof apiProduct.category === 'string'
      ? apiProduct.category
      : (apiProduct.category?.slug || ''),
    intensity: (apiProduct.intensity as Product['intensity']) || 'medium',
    profile: (apiProduct.profile as Product['profile']) || 'boise',
    occasion: [],
    formats,
    origin: apiProduct.origin || '',
    grade: (apiProduct.grade as Product['grade']) || 'premium',
    rating: apiProduct.rating || 0,
    reviewCount: apiProduct.review_count || 0,
    inStock: formats.some((format) => format.inStock),
    isBestseller: Boolean(apiProduct.is_bestseller),
    isNew: Boolean(apiProduct.is_new),
    tags: apiProduct.tags || [],
    details: {
      origin: apiProduct.origin || '',
      woodType: '',
      aging: '',
      oilContent: '',
      burningTime: '',
      intensity: 0,
    },
    usage: {
      preparation: '',
      burning: '',
      tips: [],
      safety: [],
    },
    faq: [],
  };
}

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

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const result = isJson ? await response.json() : null;
    const textBody = !isJson ? await response.text() : '';

    if (!response.ok) {
      return {
        success: false,
        error: result?.error || textBody || `HTTP ${response.status}`,
      };
    }

    if (!isJson) {
      return {
        success: false,
        error: `Expected JSON response but received ${contentType || 'non-JSON content'}`,
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
  }) => fetchAPI<{ data: ApiProduct[]; pagination: any }>(`/products/?${new URLSearchParams(params as any).toString()}`)
    .then((result) => {
      if (!result.success || !result.data) return result as any;
      if (Array.isArray(result.data)) {
        return {
          ...result,
          data: result.data.map(mapProduct),
        };
      }
      return {
        ...result,
        data: {
          ...result.data,
          data: Array.isArray((result.data as any).data)
            ? (result.data as any).data.map(mapProduct)
            : [],
        },
      };
    }),

  getBySlug: (slug: string) => fetchAPI<{ product: ApiProduct; related_products: ApiProduct[] }>(`/products/${slug}`)
    .then((result) => {
      if (!result.success || !result.data) return result as any;
      return {
        ...result,
        data: {
          product: mapProduct(result.data.product),
          related_products: (result.data.related_products || []).map(mapProduct),
        },
      };
    }),

  getFeatured: (limit = 4) => fetchAPI<ApiProduct[]>(`/products/featured?limit=${limit}`)
    .then((result) => {
      if (!result.success || !result.data) return result as any;
      return { ...result, data: result.data.map(mapProduct) };
    }),

  getBestsellers: (limit = 4) => fetchAPI<ApiProduct[]>(`/products/bestsellers?limit=${limit}`)
    .then((result) => {
      if (!result.success || !result.data) return result as any;
      return { ...result, data: result.data.map(mapProduct) };
    }),

  getNew: (limit = 4) => fetchAPI<ApiProduct[]>(`/products/new?limit=${limit}`)
    .then((result) => {
      if (!result.success || !result.data) return result as any;
      return { ...result, data: result.data.map(mapProduct) };
    }),

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
  }) => fetchAPI<Order>('/orders/', {
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
    featured_products: ApiProduct[];
    bestsellers: ApiProduct[];
    new_arrivals: ApiProduct[];
    promotions: any[];
    features: Record<string, any>;
    homepage_sections: any[];
  }>('/homepage')
    .then((result) => {
      if (!result.success || !result.data) return result as any;
      return {
        ...result,
        data: {
          ...result.data,
          featured_products: (result.data.featured_products || []).map(mapProduct),
          bestsellers: (result.data.bestsellers || []).map(mapProduct),
          new_arrivals: (result.data.new_arrivals || []).map(mapProduct),
        },
      };
    }),
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

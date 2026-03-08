import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '@/services/api';
import type { Product, Category } from '@/types';

interface UseProductsOptions {
  featured?: boolean;
  bestsellers?: boolean;
  new?: boolean;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let result;
        if (options.featured) {
          result = await productsAPI.getFeatured(options.limit);
        } else if (options.bestsellers) {
          result = await productsAPI.getBestsellers(options.limit);
        } else if (options.new) {
          result = await productsAPI.getNew(options.limit);
        } else {
          result = await productsAPI.getAll({ per_page: options.limit || 12 });
        }

        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          setError(result.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options.featured, options.bestsellers, options.new, options.limit]);

  return { products, loading, error };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const result = await productsAPI.getBySlug(slug);

        if (result.success && result.data) {
          setProduct(result.data.product);
          setRelatedProducts(result.data.related_products);
        } else {
          setError(result.error || 'Product not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, relatedProducts, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await productsAPI.getCategories();

        if (result.success && result.data) {
          setCategories(result.data);
        } else {
          setError(result.error || 'Failed to fetch categories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useProductFilters() {
  const [filters, setFilters] = useState<{
    origins: string[];
    profiles: string[];
    intensities: string[];
    price_range: { min: number; max: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await productsAPI.getFilters();

        if (result.success && result.data) {
          setFilters(result.data);
        } else {
          setError(result.error || 'Failed to fetch filters');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { filters, loading, error };
}

import { useQuery } from '@tanstack/react-query';
import { api } from '@/data/api';
import type { Category, Product } from '@/data/types';

const HOUR = 1000 * 60 * 60;

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
    staleTime: HOUR,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
    staleTime: HOUR,
  });
}

/** Products + categories together, with a single `ready` flag.
 *  Every page waits on this before rendering data-driven UI. */
export function useCatalog() {
  const products = useProducts();
  const categories = useCategories();
  return {
    products: products.data ?? [],
    categories: categories.data ?? [],
    ready: products.isSuccess && categories.isSuccess,
    isError: products.isError || categories.isError,
  };
}

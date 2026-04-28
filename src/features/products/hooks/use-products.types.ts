import { Product } from '@/src/features/products/domain/product';

export type ProductsState = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
};

import { Product } from '@/src/features/products/domain/product';

export type ProductState = {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
};

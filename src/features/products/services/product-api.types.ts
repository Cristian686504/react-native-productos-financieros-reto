import { Product } from '@/src/features/products/domain/product';

export type ProductsResponse = {
  data: Product[];
};

export type ProductResponse<T> = {
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  errors?: {
    constraints?: Record<string, string>;
    property?: string;
  }[];
  message?: string;
};

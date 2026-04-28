import {
  Product,
  ProductFormMode,
  ProductFormValues,
} from '@/src/features/products/domain/product';

export type UseProductFormOptions = {
  mode: ProductFormMode;
  initialValues?: ProductFormValues;
  onSubmit: (product: Product) => Promise<void>;
  verifyProductId: (id: string) => Promise<boolean>;
};

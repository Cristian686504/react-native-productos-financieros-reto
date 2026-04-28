import { Product, ProductFormMode, ProductFormValues } from '@/src/features/products/domain/product';

export type ProductFormProps = {
  mode: ProductFormMode;
  initialValues?: ProductFormValues;
  isSubmitting: boolean;
  onSubmit: (product: Product) => Promise<void>;
  verifyProductId: (id: string) => Promise<boolean>;
};

export type ProductFormFieldName = keyof ProductFormValues;

export type ProductFormField = {
  name: ProductFormFieldName;
  label: string;
  helperText?: string;
  multiline?: boolean;
  readOnlyOnEdit?: boolean;
  readOnly?: boolean;
};

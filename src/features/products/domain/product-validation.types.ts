import { ProductFormMode, ProductFormValues } from './product';

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

export type ValidationOptions = {
  mode: ProductFormMode;
  idAlreadyExists?: boolean;
  today?: Date;
};

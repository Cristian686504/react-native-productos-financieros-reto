export type Product = {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
};

export type ProductFormValues = Product;

export type UpdateProductPayload = Omit<Product, 'id'>;

export type ProductFormMode = 'create' | 'edit';

export const emptyProductFormValues: ProductFormValues = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
  date_revision: '',
};

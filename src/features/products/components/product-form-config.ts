import { ProductFormField } from './product-form.types';

export const productFormFields: ProductFormField[] = [
  { name: 'id', label: 'ID', readOnlyOnEdit: true },
  { name: 'name', label: 'Nombre' },
  { name: 'description', label: 'Descripción', multiline: true },
  { name: 'logo', label: 'Logo', helperText: 'URL del logo del producto.' },
  { name: 'date_release', label: 'Fecha de liberación' },
  { name: 'date_revision', label: 'Fecha de revisión', readOnly: true },
];

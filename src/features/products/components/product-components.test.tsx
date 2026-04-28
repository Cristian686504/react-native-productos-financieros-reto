import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { Product } from '@/src/features/products/domain/product';

import { DeleteProductModal } from './delete-product-modal';
import { ProductForm } from './product-form';
import { ProductListItem } from './product-list-item';
import { ProductLogo } from './product-logo';
import { ProductSkeleton } from './product-skeleton';

const product: Product = {
  id: 'trj-crd',
  name: 'Tarjeta Credito',
  description: 'Tarjeta de consumo de credito',
  logo: 'https://example.com/logo.png',
  date_release: '2026-05-01',
  date_revision: '2027-05-01',
};

describe('product components', () => {
  it('calls the list item handler with the selected product', () => {
    const onPress = jest.fn();
    const { getByLabelText, getByText } = render(
      <ProductListItem product={product} onPress={onPress} />,
    );

    fireEvent.press(getByLabelText('Tarjeta Credito, ID trj-crd'));

    expect(getByText('ID: trj-crd')).toBeTruthy();
    expect(onPress).toHaveBeenCalledWith(product);
  });

  it('renders product logo and fallback placeholder', () => {
    const { getByLabelText, getByText, rerender } = render(<ProductLogo uri={product.logo} />);

    expect(getByLabelText('Logo del producto')).toBeTruthy();

    rerender(<ProductLogo size="small" uri="" />);

    expect(getByText('Sin logo')).toBeTruthy();
  });

  it('renders a placeholder when the logo image fails', () => {
    const { getByLabelText, getByText } = render(<ProductLogo uri={product.logo} />);

    fireEvent(getByLabelText('Logo del producto'), 'error');

    expect(getByText('Sin logo')).toBeTruthy();
  });

  it('renders skeleton placeholders', () => {
    const { UNSAFE_getAllByType } = render(<ProductSkeleton />);

    expect(UNSAFE_getAllByType(ProductSkeleton).length).toBe(1);
  });

  it('renders and controls the delete modal', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    const { getByText } = render(
      <DeleteProductModal
        isDeleting={false}
        productName={product.name}
        visible
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.press(getByText('Confirmar'));
    fireEvent.press(getByText('Cancelar'));

    expect(getByText(`¿Estás seguro de eliminar el producto ${product.name}?`)).toBeTruthy();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('validates and submits the create form', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const verifyProductId = jest.fn().mockResolvedValue(false);
    const { getByLabelText, getByText } = render(
      <ProductForm
        isSubmitting={false}
        mode="create"
        verifyProductId={verifyProductId}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.press(getByText('Enviar'));

    expect(getByText('Ingresa el ID.')).toBeTruthy();

    fireEvent.changeText(getByLabelText('ID'), product.id);
    fireEvent.changeText(getByLabelText('Nombre'), product.name);
    fireEvent.changeText(getByLabelText('Descripción'), product.description);
    fireEvent.changeText(getByLabelText('Logo'), product.logo);
    fireEvent.changeText(getByLabelText('Fecha de liberación'), product.date_release);
    fireEvent.press(getByText('Enviar'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(product));
    expect(verifyProductId).toHaveBeenCalledWith(product.id);
  });

  it('shows actionable field errors when an input loses focus', () => {
    const { getByLabelText, getByText } = render(
      <ProductForm
        isSubmitting={false}
        mode="create"
        verifyProductId={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    fireEvent.changeText(getByLabelText('Nombre'), 'abc');
    fireEvent(getByLabelText('Nombre'), 'blur');

    expect(getByText('Nombre debe tener al menos 6 caracteres.')).toBeTruthy();
  });

  it('resets the edit form and keeps read-only fields disabled', () => {
    const onSubmit = jest.fn();
    const { getByDisplayValue, getByLabelText, getByText } = render(
      <ProductForm
        initialValues={product}
        isSubmitting={false}
        mode="edit"
        verifyProductId={jest.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.changeText(getByLabelText('Nombre'), 'Producto Editado');
    fireEvent.press(getByText('Reiniciar'));

    expect(getByDisplayValue(product.name)).toBeTruthy();
    expect(getByLabelText('ID').props.editable).toBe(false);
    expect(getByLabelText('Fecha de revisión').props.editable).toBe(false);
  });
});

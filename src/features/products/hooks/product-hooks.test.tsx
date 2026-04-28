import { act, renderHook, waitFor } from '@testing-library/react-native';

import { Product, UpdateProductPayload } from '@/src/features/products/domain/product';
import { ProductRepository } from '@/src/features/products/domain/product-repository';

import { useProduct } from './use-product';
import { useProductForm } from './use-product-form';
import { useProducts } from './use-products';

const product: Product = {
  id: 'trj-crd',
  name: 'Tarjeta Credito',
  description: 'Tarjeta de consumo de credito',
  logo: 'https://example.com/logo.png',
  date_release: '2026-05-01',
  date_revision: '2027-05-01',
};

const updatedProduct: Product = {
  ...product,
  name: 'Tarjeta Actualizada',
};

function createRepository(overrides: Partial<jest.Mocked<ProductRepository>> = {}) {
  return {
    getAll: jest.fn().mockResolvedValue([product]),
    getById: jest.fn().mockResolvedValue(product),
    create: jest.fn().mockResolvedValue(product),
    update: jest.fn().mockResolvedValue(updatedProduct),
    remove: jest.fn().mockResolvedValue(undefined),
    existsById: jest.fn().mockResolvedValue(false),
    ...overrides,
  } as jest.Mocked<ProductRepository>;
}

describe('product hooks', () => {
  it('loads, creates, updates, deletes and finds products', async () => {
    const repository = createRepository();
    const { result } = renderHook(() => useProducts(repository));

    await act(async () => {
      await result.current.loadProducts();
    });

    expect(result.current.products).toEqual([product]);
    expect(result.current.findProduct(product.id)).toEqual(product);

    await act(async () => {
      await result.current.createProduct(product);
    });

    expect(repository.create).toHaveBeenCalledWith(product);
    expect(result.current.products[0]).toEqual(product);

    const payload: UpdateProductPayload = {
      name: updatedProduct.name,
      description: updatedProduct.description,
      logo: updatedProduct.logo,
      date_release: updatedProduct.date_release,
      date_revision: updatedProduct.date_revision,
    };

    await act(async () => {
      await result.current.updateProduct(product.id, payload);
    });

    expect(result.current.findProduct(product.id)).toEqual(updatedProduct);

    await act(async () => {
      await result.current.deleteProduct(product.id);
    });

    expect(result.current.products).toEqual([]);
  });

  it('stores load errors for the products list', async () => {
    const repository = createRepository({
      getAll: jest.fn().mockRejectedValue(new Error('Sin conexion')),
    });
    const { result } = renderHook(() => useProducts(repository));

    await act(async () => {
      await result.current.loadProducts();
    });

    expect(result.current.error).toBe('Sin conexion');
    expect(result.current.isLoading).toBe(false);
  });

  it('loads one product and exposes update, delete and verification actions', async () => {
    const repository = createRepository();
    const { result } = renderHook(() => useProduct(product.id, repository));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.product).toEqual(product);

    await act(async () => {
      await result.current.updateProduct({
        name: updatedProduct.name,
        description: updatedProduct.description,
        logo: updatedProduct.logo,
        date_release: updatedProduct.date_release,
        date_revision: updatedProduct.date_revision,
      });
    });

    expect(result.current.product).toEqual(updatedProduct);
    await expect(result.current.existsById(product.id)).resolves.toBe(false);

    await act(async () => {
      await result.current.deleteProduct();
    });

    expect(result.current.product).toBeNull();
  });

  it('handles invalid route ids and repository failures', async () => {
    const repository = createRepository({
      getById: jest.fn().mockRejectedValue(new Error('No encontrado')),
      update: jest.fn().mockRejectedValue(new Error('No actualiza')),
      remove: jest.fn().mockRejectedValue(new Error('No elimina')),
    });
    const invalidHook = renderHook(() => useProduct(undefined, repository));

    await waitFor(() => expect(invalidHook.result.current.error).toBe('Producto no válido'));
    await expect(invalidHook.result.current.updateProduct(updatedProduct)).rejects.toThrow(
      'Producto no válido',
    );
    await expect(invalidHook.result.current.deleteProduct()).rejects.toThrow('Producto no válido');

    const failingHook = renderHook(() => useProduct([product.id], repository));

    await waitFor(() => expect(failingHook.result.current.error).toBe('No encontrado'));

    await act(async () => {
      await expect(failingHook.result.current.updateProduct(updatedProduct)).rejects.toThrow(
        'No actualiza',
      );
    });

    expect(failingHook.result.current.error).toBe('No actualiza');

    await act(async () => {
      await expect(failingHook.result.current.deleteProduct()).rejects.toThrow('No elimina');
    });

    expect(failingHook.result.current.error).toBe('No elimina');
  });

  it('updates, resets and submits product form state', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const verifyProductId = jest.fn().mockResolvedValue(false);
    const { result } = renderHook(() =>
      useProductForm({
        initialValues: product,
        mode: 'edit',
        onSubmit,
        verifyProductId,
      }),
    );

    expect(result.current.values.date_release).toBe('01/05/2026');
    expect(result.current.values.date_revision).toBe('01/05/2027');

    act(() => {
      result.current.updateField('name', 'Producto Editado');
      result.current.updateField('date_release', '2026-06-10');
    });

    expect(result.current.values.name).toBe('Producto Editado');
    expect(result.current.values.date_revision).toBe('10/06/2027');

    act(() => {
      result.current.blurField('date_release');
    });

    expect(result.current.values.date_release).toBe('10/06/2026');

    act(() => {
      result.current.updateField('date_release', '07/09/2021');
    });

    expect(result.current.values.date_revision).toBe('');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual({
      ...product,
      date_release: '01/05/2026',
      date_revision: '01/05/2027',
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(onSubmit).toHaveBeenCalledWith(product);
  });

  it('stores submit errors and existing ID errors in create mode', async () => {
    const failingSubmit = jest.fn().mockRejectedValue(new Error('No se guardo'));
    const existingId = renderHook(() =>
      useProductForm({
        initialValues: product,
        mode: 'create',
        onSubmit: failingSubmit,
        verifyProductId: jest.fn().mockResolvedValue(true),
      }),
    );

    await act(async () => {
      await existingId.result.current.submitForm();
    });

    expect(existingId.result.current.errors.id).toBe(
      'Ya existe un producto con este ID. Usa un ID diferente.',
    );
    expect(failingSubmit).not.toHaveBeenCalled();

    const submitFailure = renderHook(() =>
      useProductForm({
        initialValues: product,
        mode: 'create',
        onSubmit: failingSubmit,
        verifyProductId: jest.fn().mockResolvedValue(false),
      }),
    );

    await act(async () => {
      await submitFailure.result.current.submitForm();
    });

    expect(submitFailure.result.current.submitError).toBe('No se guardo');
  });
});

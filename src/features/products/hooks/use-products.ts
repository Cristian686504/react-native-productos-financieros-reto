import { useCallback, useMemo, useState } from 'react';

import { Product, UpdateProductPayload } from '@/src/features/products/domain/product';
import { ProductRepository } from '@/src/features/products/domain/product-repository';
import { productRepository as defaultRepository } from '@/src/features/products/services/product-repository-instance';
import { resolveError } from '@/src/shared/utils/resolve-error';

import { ProductsState } from './use-products.types';

export function useProducts(repository: ProductRepository = defaultRepository) {
  const [state, setState] = useState<ProductsState>({
    products: [],
    isLoading: true,
    error: null,
  });

  const loadProducts = useCallback(async () => {
    setState((currentState) => ({ ...currentState, isLoading: true, error: null }));

    try {
      const products = await repository.getAll();
      setState({ products, isLoading: false, error: null });
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        isLoading: false,
        error: resolveError(error),
      }));
    }
  }, [repository]);

  const createProduct = useCallback(
    async (product: Product) => {
      const createdProduct = await repository.create(product);
      setState((currentState) => ({
        ...currentState,
        products: [createdProduct, ...currentState.products],
      }));

      return createdProduct;
    },
    [repository],
  );

  const updateProduct = useCallback(
    async (id: string, product: UpdateProductPayload) => {
      const updatedProduct = await repository.update(id, product);
      setState((currentState) => ({
        ...currentState,
        products: currentState.products.map((item) => (item.id === id ? updatedProduct : item)),
      }));

      return updatedProduct;
    },
    [repository],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await repository.remove(id);
      setState((currentState) => ({
        ...currentState,
        products: currentState.products.filter((product) => product.id !== id),
      }));
    },
    [repository],
  );

  const findProduct = useCallback(
    (id: string) => state.products.find((product) => product.id === id),
    [state.products],
  );

  const actions = useMemo(
    () => ({
      loadProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      existsById: repository.existsById.bind(repository),
      findProduct,
    }),
    [createProduct, deleteProduct, findProduct, loadProducts, repository, updateProduct],
  );

  return { ...state, ...actions };
}

import { useCallback, useEffect, useMemo, useState } from 'react';

import { UpdateProductPayload } from '@/src/features/products/domain/product';
import { ProductRepository } from '@/src/features/products/domain/product-repository';
import { productRepository as defaultRepository } from '@/src/features/products/services/product-repository-instance';
import { resolveError } from '@/src/shared/utils/resolve-error';

import { ProductState } from './use-product.types';

export function useProduct(
  routeId: string | string[] | undefined,
  repository: ProductRepository = defaultRepository,
) {
  const productId = useMemo(() => normalizeRouteId(routeId), [routeId]);
  const [state, setState] = useState<ProductState>({
    product: null,
    isLoading: true,
    error: null,
  });

  const loadProduct = useCallback(async () => {
    if (!productId) {
      setState({ product: null, isLoading: false, error: 'Producto no válido' });
      return;
    }

    setState((currentState) => ({ ...currentState, isLoading: true, error: null }));

    try {
      const product = await repository.getById(productId);
      setState({ product, isLoading: false, error: null });
    } catch (error) {
      setState({
        product: null,
        isLoading: false,
        error: resolveError(error, 'No se pudo cargar el producto'),
      });
    }
  }, [productId, repository]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const updateProduct = useCallback(
    async (product: UpdateProductPayload) => {
      if (!productId) {
        throw new Error('Producto no válido');
      }

      try {
        const updatedProduct = await repository.update(productId, product);
        setState((currentState) => ({ ...currentState, product: updatedProduct, error: null }));

        return updatedProduct;
      } catch (error) {
        setState((currentState) => ({
          ...currentState,
          error: resolveError(error, 'No se pudo actualizar'),
        }));
        throw error;
      }
    },
    [productId, repository],
  );

  const deleteProduct = useCallback(async () => {
    if (!productId) {
      throw new Error('Producto no válido');
    }

    try {
      await repository.remove(productId);
      setState((currentState) => ({ ...currentState, product: null, error: null }));
    } catch (error) {
      setState((currentState) => ({
        ...currentState,
        error: resolveError(error, 'No se pudo eliminar'),
      }));
      throw error;
    }
  }, [productId, repository]);

  return {
    ...state,
    deleteProduct,
    existsById: repository.existsById.bind(repository),
    loadProduct,
    updateProduct,
  };
}

function normalizeRouteId(routeId: string | string[] | undefined): string | undefined {
  return Array.isArray(routeId) ? routeId[0] : routeId;
}

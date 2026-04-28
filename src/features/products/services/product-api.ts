import { Product, UpdateProductPayload } from '@/src/features/products/domain/product';
import { ProductRepository } from '@/src/features/products/domain/product-repository';
import { normalizeDateInput } from '@/src/features/products/domain/product-validation';

import { ApiErrorResponse, ProductResponse, ProductsResponse } from './product-api.types';

export class ProductApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'ProductApiError';
  }
}

export class ProductApiRepository implements ProductRepository {
  constructor(private readonly baseUrl: string) {}

  async getAll(): Promise<Product[]> {
    const response = await this.request<ProductsResponse>('/bp/products');

    return response.data;
  }

  async getById(id: string): Promise<Product | null> {
    try {
      return await this.request<Product>(`/bp/products/${encodeURIComponent(id)}`);
    } catch (error) {
      if (error instanceof ProductApiError && error.status === 404) {
        return null;
      }

      throw error;
    }
  }

  async create(product: Product): Promise<Product> {
    const payload = serializeProductDates(product);
    const response = await this.request<ProductResponse<Product>>('/bp/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response.data;
  }

  async update(id: string, product: UpdateProductPayload): Promise<Product> {
    const payload = serializeProductDates(product);
    const response = await this.request<ProductResponse<UpdateProductPayload>>(
      `/bp/products/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
    );

    return { id, ...response.data };
  }

  async remove(id: string): Promise<void> {
    await this.request(`/bp/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  async existsById(id: string): Promise<boolean> {
    return this.request<boolean>(`/bp/products/verification/${encodeURIComponent(id)}`);
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const data = await parseJson<T | ApiErrorResponse>(response).catch(() => {
      throw new ProductApiError('Respuesta inválida del servidor', response.status);
    });

    if (!response.ok) {
      throw new ProductApiError(resolveErrorMessage(data), response.status);
    }

    return data as T;
  }
}

function serializeProductDates<T extends Pick<Product, 'date_release' | 'date_revision'>>(
  product: T,
): T {
  return {
    ...product,
    date_release: normalizeDateInput(product.date_release),
    date_revision: normalizeDateInput(product.date_revision),
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}

function resolveErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as ApiErrorResponse).errors)
  ) {
    const fieldErrors = (error as ApiErrorResponse).errors
      ?.flatMap((fieldError) => Object.values(fieldError.constraints ?? {}))
      .filter(Boolean);

    if (fieldErrors?.length) {
      return fieldErrors.join(' ');
    }
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    (error as ApiErrorResponse).message
  ) {
    return String((error as ApiErrorResponse).message);
  }

  return 'No se pudo completar la operación';
}

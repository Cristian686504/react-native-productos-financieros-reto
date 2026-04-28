import { Product } from '@/src/features/products/domain/product';

import { ProductApiError, ProductApiRepository } from './product-api';

const product: Product = {
  id: 'trj-crd',
  name: 'Tarjeta Credito',
  description: 'Tarjeta de consumo con cupo disponible',
  logo: 'https://example.com/logo.png',
  date_release: '2026-05-01',
  date_revision: '2027-05-01',
};

const fetchMock = jest.fn();

describe('ProductApiRepository', () => {
  const repository = new ProductApiRepository('http://localhost:3002');

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  it('loads products from the API response data', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [product] }));

    await expect(repository.getAll()).resolves.toEqual([product]);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3002/bp/products',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    );
  });

  it('loads one product by ID', async () => {
    fetchMock.mockResolvedValue(jsonResponse(product));

    await expect(repository.getById(product.id)).resolves.toEqual(product);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3002/bp/products/trj-crd',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/json' }),
      }),
    );
  });

  it('returns null when one product does not exist', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Not found' }, false, 404));

    await expect(repository.getById(product.id)).resolves.toBeNull();
  });

  it('creates products with a JSON request body', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: product }));

    await expect(
      repository.create({
        ...product,
        date_release: '01/05/2026',
        date_revision: '01/05/2027',
      }),
    ).resolves.toEqual(product);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3002/bp/products',
      expect.objectContaining({
        body: JSON.stringify(product),
        method: 'POST',
      }),
    );
  });

  it('updates products and restores the id omitted by the backend', async () => {
    const payload = {
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release,
      date_revision: product.date_revision,
    };
    fetchMock.mockResolvedValue(jsonResponse({ data: payload }));

    await expect(
      repository.update(product.id, {
        ...payload,
        date_release: '01/05/2026',
        date_revision: '01/05/2027',
      }),
    ).resolves.toEqual(product);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3002/bp/products/trj-crd',
      expect.objectContaining({
        body: JSON.stringify(payload),
        method: 'PUT',
      }),
    );
  });

  it('deletes products and verifies existing IDs', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ message: 'Product removed successfully' }))
      .mockResolvedValueOnce(jsonResponse(true));

    await expect(repository.remove(product.id)).resolves.toBeUndefined();
    await expect(repository.existsById(product.id)).resolves.toBe(true);
  });

  it('throws a typed error when the API returns an error response', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ message: 'Not product found with that identifier' }, false, 404),
    );

    await expect(repository.getAll()).rejects.toEqual(
      new ProductApiError('Not product found with that identifier', 404),
    );
  });

  it('shows backend validation details when an invalid body is rejected', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          errors: [
            {
              constraints: {
                minLength: 'name must be longer than or equal to 6 characters',
              },
              property: 'name',
            },
          ],
          message: "Invalid body, check 'errors' property for more info.",
        },
        false,
        400,
      ),
    );

    await expect(repository.create(product)).rejects.toThrow(
      'name must be longer than or equal to 6 characters',
    );
  });

  it('uses a fallback message for empty error responses', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, false, 500));

    await expect(repository.getAll()).rejects.toThrow('No se pudo completar la operación');
  });

  it('throws a typed error when the API returns invalid JSON', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: jest.fn().mockResolvedValue('<html />'),
    });

    await expect(repository.getAll()).rejects.toEqual(
      new ProductApiError('Respuesta inválida del servidor', 200),
    );
  });
});

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as Response;
}

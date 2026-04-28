import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { Product } from '@/src/features/products/domain/product';
import { useProduct } from '@/src/features/products/hooks/use-product';
import { useProducts } from '@/src/features/products/hooks/use-products';

import EditProductScreen from './edit-product-screen';
import NewProductScreen from './new-product-screen';
import ProductDetailScreen from './product-detail-screen';
import ProductsScreen from './products-screen';

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};
let mockParams: { id?: string | string[] } = {};

jest.mock('expo-router', () => ({
  useFocusEffect: (callback: () => void) => callback(),
  useLocalSearchParams: () => mockParams,
  useRouter: () => mockRouter,
}));

jest.mock('@/src/features/products/hooks/use-products', () => ({
  useProducts: jest.fn(),
}));

jest.mock('@/src/features/products/hooks/use-product', () => ({
  useProduct: jest.fn(),
}));

const product: Product = {
  id: 'trj-crd',
  name: 'Tarjeta Credito',
  description: 'Tarjeta de consumo de credito',
  logo: 'https://example.com/logo.png',
  date_release: '2026-05-01',
  date_revision: '2027-05-01',
};

const secondProduct: Product = {
  id: 'cta-ah',
  name: 'Cuenta Ahorros',
  description: 'Cuenta para ahorrar dinero',
  logo: 'https://example.com/cuenta.png',
  date_release: '2026-07-01',
  date_revision: '2027-07-01',
};

describe('product screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: product.id };
  });

  it('loads, filters and navigates from the product list without rendering a counter', () => {
    const loadProducts = jest.fn();
    (useProducts as jest.Mock).mockReturnValue({
      products: [product, secondProduct],
      isLoading: false,
      error: null,
      loadProducts,
    });

    const { getByLabelText, getByPlaceholderText, getByText, queryByText } = render(
      <ProductsScreen />,
    );

    expect(loadProducts).toHaveBeenCalledTimes(1);
    expect(queryByText(/registros/)).toBeNull();

    fireEvent.changeText(getByPlaceholderText('Buscar por nombre o ID'), 'cuenta');

    expect(getByText('Cuenta Ahorros')).toBeTruthy();
    expect(queryByText('Tarjeta Credito')).toBeNull();

    fireEvent.press(getByLabelText('Cuenta Ahorros, ID cta-ah'));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/products/[id]',
      params: { id: secondProduct.id },
    });

    fireEvent.press(getByText('Agregar'));

    expect(mockRouter.push).toHaveBeenCalledWith('/products/new');
  });

  it('renders loading, empty and error states in the product list', () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: true,
      error: 'No se pudo cargar',
      loadProducts: jest.fn(),
    });

    const loading = render(<ProductsScreen />);

    expect(loading.getByText('No se pudo cargar')).toBeTruthy();

    loading.unmount();

    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: false,
      error: null,
      loadProducts: jest.fn(),
    });

    const empty = render(<ProductsScreen />);

    expect(empty.getByText('No hay productos para mostrar.')).toBeTruthy();
  });

  it('creates a product and returns to the list', async () => {
    const createProduct = jest.fn().mockResolvedValue(product);
    (useProducts as jest.Mock).mockReturnValue({
      createProduct,
      existsById: jest.fn().mockResolvedValue(false),
    });

    const { getByLabelText, getByText } = render(<NewProductScreen />);

    fireEvent.changeText(getByLabelText('ID'), product.id);
    fireEvent.changeText(getByLabelText('Nombre'), product.name);
    fireEvent.changeText(getByLabelText('Descripción'), product.description);
    fireEvent.changeText(getByLabelText('Logo'), product.logo);
    fireEvent.changeText(getByLabelText('Fecha de liberación'), product.date_release);
    fireEvent.press(getByText('Enviar'));

    await waitFor(() => expect(createProduct).toHaveBeenCalledWith(product));
    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(getByText('Producto creado')).toBeTruthy();
    expect(getByText('El producto se creó correctamente.')).toBeTruthy();

    fireEvent.press(getByText('Aceptar'));

    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });

  it('edits a product with an update payload', async () => {
    const updateProduct = jest.fn().mockResolvedValue(product);
    (useProduct as jest.Mock).mockReturnValue({
      product,
      isLoading: false,
      error: null,
      updateProduct,
      existsById: jest.fn(),
    });

    const { getByLabelText, getByText } = render(<EditProductScreen />);

    fireEvent.changeText(getByLabelText('Nombre'), 'Tarjeta Editada');
    fireEvent.press(getByText('Guardar'));

    await waitFor(() =>
      expect(updateProduct).toHaveBeenCalledWith({
        name: 'Tarjeta Editada',
        description: product.description,
        logo: product.logo,
        date_release: product.date_release,
        date_revision: product.date_revision,
      }),
    );
    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(getByText('Producto modificado')).toBeTruthy();
    expect(getByText('El producto se modificó correctamente.')).toBeTruthy();

    fireEvent.press(getByText('Aceptar'));

    expect(mockRouter.replace).toHaveBeenCalledWith({
      pathname: '/products/[id]',
      params: { id: product.id },
    });
  });

  it('renders edit screen loading and missing product states', () => {
    (useProduct as jest.Mock).mockReturnValue({
      product: null,
      isLoading: true,
      error: 'Error de carga',
      updateProduct: jest.fn(),
      existsById: jest.fn(),
    });

    const loading = render(<EditProductScreen />);

    expect(loading.getByText('Cargando formulario...')).toBeTruthy();
    expect(loading.getByText('Error de carga')).toBeTruthy();

    loading.unmount();

    (useProduct as jest.Mock).mockReturnValue({
      product: null,
      isLoading: false,
      error: null,
      updateProduct: jest.fn(),
      existsById: jest.fn(),
    });

    const missing = render(<EditProductScreen />);

    expect(missing.getByText('No se encontró el producto solicitado.')).toBeTruthy();
  });

  it('opens detail actions, edits and deletes a product', async () => {
    const deleteProduct = jest.fn().mockResolvedValue(undefined);
    (useProduct as jest.Mock).mockReturnValue({
      product,
      isLoading: false,
      error: null,
      deleteProduct,
    });

    const { getByText } = render(<ProductDetailScreen />);

    fireEvent.press(getByText('Editar'));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/products/[id]/edit',
      params: { id: product.id },
    });

    fireEvent.press(getByText('Eliminar'));
    fireEvent.press(getByText('Confirmar'));

    await waitFor(() => expect(deleteProduct).toHaveBeenCalledTimes(1));
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });

  it('renders detail loading and missing product states', () => {
    (useProduct as jest.Mock).mockReturnValue({
      product: null,
      isLoading: true,
      error: 'No disponible',
      deleteProduct: jest.fn(),
    });

    const loading = render(<ProductDetailScreen />);

    expect(loading.getByLabelText('Cargando producto')).toBeTruthy();
    expect(loading.getByText('No disponible')).toBeTruthy();

    loading.unmount();

    (useProduct as jest.Mock).mockReturnValue({
      product: null,
      isLoading: false,
      error: null,
      deleteProduct: jest.fn(),
    });

    const missing = render(<ProductDetailScreen />);

    expect(missing.getByText('No se encontró el producto solicitado.')).toBeTruthy();
  });
});

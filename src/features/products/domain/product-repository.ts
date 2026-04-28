import { Product, UpdateProductPayload } from './product';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  update(id: string, product: UpdateProductPayload): Promise<Product>;
  remove(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
}

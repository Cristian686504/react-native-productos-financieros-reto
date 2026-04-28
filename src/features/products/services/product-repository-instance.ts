import { API_BASE_URL } from './api-config';
import { ProductApiRepository } from './product-api';

export const productRepository = new ProductApiRepository(API_BASE_URL);

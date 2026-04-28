import { Product } from '@/src/features/products/domain/product';

export type ProductListItemProps = {
  product: Product;
  onPress: (product: Product) => void;
};

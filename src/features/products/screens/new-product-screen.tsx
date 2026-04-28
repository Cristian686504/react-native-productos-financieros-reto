import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ProductForm } from '@/src/features/products/components/product-form';
import { ProductSuccessModal } from '@/src/features/products/components/product-success-modal';
import { Product } from '@/src/features/products/domain/product';
import { useProducts } from '@/src/features/products/hooks/use-products';
import { Screen } from '@/src/shared/components/layout/screen';

export default function NewProductScreen() {
  const router = useRouter();
  const { createProduct, existsById } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const submitProduct = async (product: Product) => {
    setIsSubmitting(true);

    try {
      await createProduct(product);
      setIsSuccessVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <ProductForm
        isSubmitting={isSubmitting}
        mode="create"
        verifyProductId={existsById}
        onSubmit={submitProduct}
      />
      <ProductSuccessModal
        message="El producto se creó correctamente."
        title="Producto creado"
        visible={isSuccessVisible}
        onClose={() => {
          setIsSuccessVisible(false);
          router.replace('/');
        }}
      />
    </Screen>
  );
}

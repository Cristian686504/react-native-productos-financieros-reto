import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { ProductForm } from '@/src/features/products/components/product-form';
import { ProductSuccessModal } from '@/src/features/products/components/product-success-modal';
import { Product, UpdateProductPayload } from '@/src/features/products/domain/product';
import { useProduct } from '@/src/features/products/hooks/use-product';
import { Screen } from '@/src/shared/components/layout/screen';
import { ErrorMessage } from '@/src/shared/components/ui/error-message';

import { styles } from './edit-product-screen.styles';

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { product, isLoading, error, updateProduct, existsById } = useProduct(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successProductId, setSuccessProductId] = useState<string | null>(null);

  const submitProduct = async (values: Product) => {
    const payload: UpdateProductPayload = {
      name: values.name,
      description: values.description,
      logo: values.logo,
      date_release: values.date_release,
      date_revision: values.date_revision,
    };

    setIsSubmitting(true);

    try {
      await updateProduct(payload);
      setSuccessProductId(values.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      {error ? <ErrorMessage message={error} /> : null}
      {isLoading ? <Text style={styles.message}>Cargando formulario...</Text> : null}
      {!isLoading && !product ? (
        <Text style={styles.message}>No se encontró el producto solicitado.</Text>
      ) : null}
      {product ? (
        <ProductForm
          initialValues={product}
          isSubmitting={isSubmitting}
          mode="edit"
          verifyProductId={existsById}
          onSubmit={submitProduct}
        />
      ) : null}
      <ProductSuccessModal
        message="El producto se modificó correctamente."
        title="Producto modificado"
        visible={Boolean(successProductId)}
        onClose={() => {
          const productId = successProductId;

          setSuccessProductId(null);

          if (productId) {
            router.replace({ pathname: '/products/[id]', params: { id: productId } });
          }
        }}
      />
    </Screen>
  );
}

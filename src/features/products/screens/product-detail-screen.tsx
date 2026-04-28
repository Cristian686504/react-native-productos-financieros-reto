import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { DeleteProductModal } from '@/src/features/products/components/delete-product-modal';
import { ProductLogo } from '@/src/features/products/components/product-logo';
import { useProduct } from '@/src/features/products/hooks/use-product';
import { Screen } from '@/src/shared/components/layout/screen';
import { Button } from '@/src/shared/components/ui/button';
import { ErrorMessage } from '@/src/shared/components/ui/error-message';
import { formatDisplayDate } from '@/src/shared/utils/format-display-date';

import { styles } from './product-detail-screen.styles';
import { DetailRowProps } from './product-detail-screen.types';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { product, isLoading, error, deleteProduct } = useProduct(id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteProduct = async () => {
    if (!product) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteProduct();
      setIsModalVisible(false);
      router.replace('/');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        {error ? <ErrorMessage message={error} /> : null}
        {isLoading ? <ProductDetailSkeleton /> : null}
        {!isLoading && !product ? (
          <Text style={styles.loading}>No se encontró el producto solicitado.</Text>
        ) : null}
        {product ? (
          <>
            <View style={styles.hero}>
              <View style={styles.heroText}>
                <Text style={styles.title}>ID: {product.id}</Text>
                <Text style={styles.subtitle}>Información extra</Text>
              </View>
            </View>
            <View style={styles.details}>
              <DetailRow label="Nombre" value={product.name} />
              <DetailBlock label="Descripción" value={product.description} />
              <View style={styles.logoRow}>
                <Text style={styles.label}>Logo</Text>
                <View style={styles.logoCard}>
                  <ProductLogo uri={product.logo} />
                </View>
              </View>
              <DetailRow
                label="Fecha de liberación"
                value={formatDisplayDate(product.date_release)}
              />
              <DetailRow label="Fecha de revisión" value={formatDisplayDate(product.date_revision)} />
            </View>
          </>
        ) : null}
      </ScrollView>
      {product ? (
        <View style={styles.actions}>
          <Button
            iconName="edit"
            title="Editar"
            variant="secondary"
            onPress={() =>
              router.push({ pathname: '/products/[id]/edit', params: { id: product.id } })
            }
          />
          <Button
            iconName="delete"
            title="Eliminar"
            variant="danger"
            onPress={() => setIsModalVisible(true)}
          />
        </View>
      ) : null}
      <DeleteProductModal
        isDeleting={isDeleting}
        productName={product?.name ?? ''}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={confirmDeleteProduct}
      />
    </Screen>
  );
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function DetailBlock({ label, value }: DetailRowProps) {
  return (
    <View style={styles.blockRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.blockValue}>{value}</Text>
    </View>
  );
}

function ProductDetailSkeleton() {
  return (
    <View accessibilityLabel="Cargando producto" style={styles.skeleton}>
      <View style={styles.skeletonHero}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonSubtitle} />
      </View>
      <View style={styles.skeletonDetails}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={styles.skeletonRow}>
            <View style={styles.skeletonLabel} />
            <View style={styles.skeletonValue} />
          </View>
        ))}
      </View>
    </View>
  );
}

import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';

import { ProductListItem } from '@/src/features/products/components/product-list-item';
import { ProductSkeleton } from '@/src/features/products/components/product-skeleton';
import { Product } from '@/src/features/products/domain/product';
import { useProducts } from '@/src/features/products/hooks/use-products';
import { Screen } from '@/src/shared/components/layout/screen';
import { Button } from '@/src/shared/components/ui/button';
import { ErrorMessage } from '@/src/shared/components/ui/error-message';
import { palette } from '@/src/shared/components/ui/palette';

import { styles } from './products-screen.styles';

export default function ProductsScreen() {
  const router = useRouter();
  const { products, isLoading, error, loadProducts } = useProducts();
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      `${product.name} ${product.id}`.toLowerCase().includes(normalizedSearch),
    );
  }, [products, searchText]);

  const openProduct = (product: Product) => {
    router.push({ pathname: '/products/[id]', params: { id: product.id } });
  };

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={22} color={palette.muted} />
          <TextInput
            autoCapitalize="none"
            placeholder="Buscar por nombre o ID"
            placeholderTextColor={palette.muted}
            selectionColor={palette.navy}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText ? (
            <Pressable
              accessibilityLabel="Limpiar búsqueda"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setSearchText('')}
              style={styles.clearSearch}>
              <MaterialIcons name="close" size={18} color={palette.textSoft} />
            </Pressable>
          ) : null}
        </View>
        {error ? <ErrorMessage message={error} /> : null}
        {isLoading ? (
          <ProductSkeleton />
        ) : (
          <>
            <View style={styles.listCard}>
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Productos</Text>
                <Text style={styles.listMeta}>
                  {filteredProducts.length} de {products.length}
                </Text>
              </View>
              <FlatList
                contentContainerStyle={styles.listContent}
                data={filteredProducts}
                keyExtractor={(product) => product.id}
                ListEmptyComponent={<Text style={styles.empty}>No hay productos para mostrar.</Text>}
                renderItem={({ item }) => <ProductListItem product={item} onPress={openProduct} />}
              />
            </View>
          </>
        )}
      </View>
      <View style={styles.footer}>
        <Button iconName="add" title="Agregar" onPress={() => router.push('/products/new')} />
      </View>
    </Screen>
  );
}

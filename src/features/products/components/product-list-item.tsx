import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';

import { ProductLogo } from '@/src/features/products/components/product-logo';
import { palette } from '@/src/shared/components/ui/palette';

import { styles } from './product-list-item.styles';
import { ProductListItemProps } from './product-list-item.types';

export function ProductListItem({ product, onPress }: ProductListItemProps) {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: false,
    }).start();
  }, [entrance]);

  return (
    <Pressable
      accessibilityLabel={`${product.name}, ID ${product.id}`}
      accessibilityRole="button"
      onPress={() => onPress(product)}
      style={({ pressed }) => [styles.container, pressed ? styles.pressed : null]}>
      <Animated.View
        style={[
          styles.inner,
          {
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 0],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.body}>
          <ProductLogo size="small" uri={product.logo} />
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.name}>
              {product.name}
            </Text>
            <Text numberOfLines={1} style={styles.id}>
              ID: {product.id}
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={palette.borderStrong} />
      </Animated.View>
    </Pressable>
  );
}

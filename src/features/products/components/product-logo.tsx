import { useState } from 'react';
import { Image, Text, View } from 'react-native';

import { styles } from './product-logo.styles';
import { ProductLogoProps } from './product-logo.types';

export function ProductLogo({ uri, size = 'large' }: ProductLogoProps) {
  const [hasError, setHasError] = useState(false);
  const style = size === 'large' ? styles.large : styles.small;

  if (!uri || hasError) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderText}>Sin logo</Text>
      </View>
    );
  }

  return (
    <Image
      accessibilityLabel="Logo del producto"
      resizeMode="contain"
      source={{ uri }}
      style={[styles.image, style]}
      onError={() => setHasError(true)}
    />
  );
}

import { View } from 'react-native';

import { styles } from './product-skeleton.styles';

export function ProductSkeleton() {
  return (
    <View style={styles.card}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.title} />
          <View style={styles.subtitle} />
        </View>
      ))}
    </View>
  );
}

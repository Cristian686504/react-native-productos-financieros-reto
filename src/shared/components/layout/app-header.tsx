import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { palette } from '@/src/shared/components/ui/palette';

import { styles } from './app-header.styles';

export function AppHeader() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="account-balance-wallet" size={20} color={palette.navy} />
      <Text style={styles.title}>BANCO</Text>
    </View>
  );
}

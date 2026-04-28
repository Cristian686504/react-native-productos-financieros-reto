import { Text, View } from 'react-native';

import { styles } from './error-message.styles';
import { ErrorMessageProps } from './error-message.types';

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

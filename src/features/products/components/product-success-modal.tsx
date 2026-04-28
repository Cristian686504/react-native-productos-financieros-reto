import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Text, View } from 'react-native';

import { Button } from '@/src/shared/components/ui/button';
import { palette } from '@/src/shared/components/ui/palette';

import { styles } from './product-success-modal.styles';
import { ProductSuccessModalProps } from './product-success-modal.types';

export function ProductSuccessModal({
  message,
  title,
  visible,
  onClose,
}: ProductSuccessModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="check-circle" size={30} color={palette.success} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button iconName="check" title="Aceptar" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

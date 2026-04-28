import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/src/shared/components/ui/button';
import { palette } from '@/src/shared/components/ui/palette';

import { styles } from './delete-product-modal.styles';
import { DeleteProductModalProps } from './delete-product-modal.types';

export function DeleteProductModal({
  visible,
  productName,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteProductModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="Cerrar"
              accessibilityRole="button"
              disabled={isDeleting}
              onPress={onCancel}
              style={styles.closeButton}>
              <MaterialIcons name="close" size={30} color={palette.muted} />
            </Pressable>
          </View>
          <View style={styles.iconContainer}>
            <MaterialIcons name="warning-amber" size={28} color={palette.danger} />
          </View>
          <Text style={styles.title}>
            ¿Estás seguro de eliminar el producto {productName || 'seleccionado'}?
          </Text>
          <View style={styles.actions}>
            <Button
              disabled={isDeleting}
              iconName="delete"
              title={isDeleting ? 'Eliminando...' : 'Confirmar'}
              variant="danger"
              onPress={onConfirm}
            />
            <Button
              disabled={isDeleting}
              iconName="close"
              title="Cancelar"
              variant="secondary"
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

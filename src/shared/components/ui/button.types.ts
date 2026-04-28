import { MaterialIcons } from '@expo/vector-icons';
import { ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  variant?: ButtonVariant;
  style?: ViewStyle;
};

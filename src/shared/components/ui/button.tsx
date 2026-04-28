import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';

import { palette } from './palette';
import { styles } from './button.styles';
import { ButtonProps } from './button.types';

export function Button({
  title,
  onPress,
  disabled,
  iconName,
  variant = 'primary',
  style,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const labelColor =
    disabled ? palette.muted : variant === 'danger' ? palette.surface : palette.navy;

  useEffect(() => {
    if (disabled) {
      scale.setValue(1);
    }
  }, [disabled, scale]);

  const animateScale = (toValue: number) => {
    Animated.spring(scale, {
      bounciness: 4,
      speed: 18,
      toValue,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: Boolean(disabled) }}
        disabled={disabled}
        hitSlop={6}
        onPress={onPress}
        onPressIn={() => {
          if (!disabled) {
            animateScale(0.98);
          }
        }}
        onPressOut={() => {
          if (!disabled) {
            animateScale(1);
          }
        }}
        style={({ pressed }) => [
          styles.base,
          styles[variant],
          pressed && !disabled ? styles.pressed : null,
          disabled ? styles.disabled : null,
        ]}>
        {iconName ? <MaterialIcons name={iconName} size={18} color={labelColor} /> : null}
        <Text
          style={[
            styles.label,
            variant === 'danger' ? styles.dangerLabel : null,
            disabled ? styles.disabledLabel : null,
          ]}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

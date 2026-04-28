import { StyleSheet } from 'react-native';

import { palette } from '@/src/shared/components/ui/palette';

export const styles = StyleSheet.create({
  image: {
    backgroundColor: palette.surfaceMuted,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
  },
  large: {
    height: 110,
    width: 180,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMuted,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
  },
  placeholderText: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  small: {
    height: 46,
    width: 64,
  },
});

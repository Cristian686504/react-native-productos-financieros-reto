import { StyleSheet } from 'react-native';

import { palette } from './palette';

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 18,
    boxShadow: '0px 6px 14px rgba(21, 51, 95, 0.1)',
    elevation: 2,
  },
  danger: {
    backgroundColor: palette.danger,
  },
  dangerLabel: {
    color: palette.surface,
  },
  disabled: {
    backgroundColor: palette.disabled,
    boxShadow: 'none',
  },
  disabledLabel: {
    color: palette.muted,
  },
  label: {
    color: palette.navy,
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.82,
  },
  primary: {
    backgroundColor: palette.primary,
  },
  secondary: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
  },
});

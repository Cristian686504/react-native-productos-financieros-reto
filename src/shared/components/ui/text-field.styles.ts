import { StyleSheet } from 'react-native';

import { palette } from './palette';

export const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  disabled: {
    backgroundColor: palette.disabled,
    color: palette.muted,
    pointerEvents: 'none',
  },
  error: {
    color: palette.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    backgroundColor: palette.field,
    borderColor: palette.border,
    borderRadius: 6,
    borderWidth: 1,
    color: palette.text,
    fontSize: 15,
    minHeight: 52,
    paddingHorizontal: 15,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  focused: {
    borderColor: palette.focus,
    boxShadow: '0px 0px 8px rgba(242, 201, 76, 0.2)',
    elevation: 1,
  },
  inputError: {
    borderColor: palette.danger,
    borderWidth: 1.4,
  },
  label: {
    color: palette.textSoft,
    fontSize: 14,
    fontWeight: '700',
  },
  labelError: {
    color: palette.danger,
  },
  labelFocused: {
    color: palette.navy,
  },
  helper: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 16,
  },
});

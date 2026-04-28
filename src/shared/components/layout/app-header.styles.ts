import { StyleSheet } from 'react-native';

import { palette } from '@/src/shared/components/ui/palette';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderBottomColor: palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 8,
    height: 60,
    justifyContent: 'center',
    boxShadow: '0px 4px 10px rgba(21, 51, 95, 0.05)',
    elevation: 2,
  },
  title: {
    color: palette.navy,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
});

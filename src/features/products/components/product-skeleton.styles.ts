import { StyleSheet } from 'react-native';

import { palette } from '@/src/shared/components/ui/palette';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    boxShadow: '0px 8px 16px rgba(21, 51, 95, 0.05)',
    elevation: 2,
  },
  item: {
    borderBottomColor: palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
    padding: 16,
  },
  subtitle: {
    backgroundColor: palette.disabled,
    borderRadius: 6,
    height: 12,
    width: '34%',
  },
  title: {
    backgroundColor: palette.disabled,
    borderRadius: 6,
    height: 16,
    width: '58%',
  },
});

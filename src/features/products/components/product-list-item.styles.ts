import { StyleSheet } from 'react-native';

import { palette } from '@/src/shared/components/ui/palette';

export const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 14,
  },
  container: {
    borderBottomColor: palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 82,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  id: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 5,
  },
  inner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  name: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    backgroundColor: palette.surfaceMuted,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
});

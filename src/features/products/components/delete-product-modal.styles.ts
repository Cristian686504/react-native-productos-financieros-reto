import { StyleSheet } from 'react-native';

import { palette } from '@/src/shared/components/ui/palette';

export const styles = StyleSheet.create({
  actions: {
    gap: 14,
    padding: 24,
    paddingTop: 18,
  },
  backdrop: {
    backgroundColor: 'rgba(22, 27, 36, 0.56)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  closeButton: {
    borderRadius: 20,
    padding: 8,
  },
  header: {
    alignItems: 'flex-end',
    borderBottomColor: palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: palette.dangerSoft,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginTop: 24,
    width: 48,
  },
  sheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    boxShadow: '0px -8px 20px rgba(21, 51, 95, 0.12)',
    elevation: 8,
  },
  title: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    paddingHorizontal: 28,
    paddingTop: 16,
    textAlign: 'center',
  },
});

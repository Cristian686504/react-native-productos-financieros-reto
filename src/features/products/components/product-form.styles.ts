import { StyleSheet } from 'react-native';

import { palette } from '@/src/shared/components/ui/palette';

export const styles = StyleSheet.create({
  actions: {
    gap: 12,
    paddingTop: 8,
  },
  content: {
    gap: 24,
    padding: 24,
    paddingBottom: 34,
  },
  fields: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 18,
    boxShadow: '0px 8px 16px rgba(21, 51, 95, 0.05)',
    elevation: 2,
  },
  fieldGroup: {
    gap: 10,
  },
  logoPreview: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  previewLabel: {
    color: palette.textSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    color: palette.text,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
});

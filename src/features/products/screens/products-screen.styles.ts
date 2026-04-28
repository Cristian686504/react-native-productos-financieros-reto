import { StyleSheet } from 'react-native';

import { palette } from '@/src/shared/components/ui/palette';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 18,
    padding: 24,
    paddingTop: 32,
  },
  clearSearch: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMuted,
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  empty: {
    color: palette.muted,
    fontSize: 15,
    padding: 24,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: palette.background,
    padding: 24,
    paddingTop: 10,
  },
  listCard: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden',
    boxShadow: '0px 8px 16px rgba(21, 51, 95, 0.06)',
    elevation: 2,
  },
  listContent: {
    flexGrow: 1,
  },
  listHeader: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMuted,
    borderBottomColor: palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  listMeta: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  listTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 14,
    boxShadow: '0px 4px 10px rgba(21, 51, 95, 0.05)',
    elevation: 1,
  },
  searchInput: {
    color: palette.text,
    flex: 1,
    fontSize: 15,
    minHeight: 50,
    paddingVertical: 10,
  },
});

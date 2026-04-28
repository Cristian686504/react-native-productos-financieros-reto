import { StyleSheet } from 'react-native';

import { palette } from '@/src/shared/components/ui/palette';

export const styles = StyleSheet.create({
  actions: {
    padding: 24,
    paddingTop: 18,
  },
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(22, 27, 36, 0.56)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: palette.successSoft,
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    marginTop: 26,
    width: 52,
  },
  message: {
    color: palette.textSoft,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    paddingHorizontal: 26,
    paddingTop: 10,
    textAlign: 'center',
  },
  sheet: {
    backgroundColor: palette.surface,
    borderRadius: 8,
    boxShadow: '0px 10px 24px rgba(21, 51, 95, 0.14)',
    elevation: 8,
    maxWidth: 420,
    width: '100%',
  },
  title: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    paddingHorizontal: 26,
    paddingTop: 16,
    textAlign: 'center',
  },
});

import { StyleSheet } from 'react-native';

import { palette } from './palette';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.dangerSoft,
    borderColor: palette.danger,
    borderRadius: 4,
    borderWidth: 1,
    padding: 12,
  },
  text: {
    color: palette.danger,
    fontSize: 13,
    fontWeight: '600',
  },
});

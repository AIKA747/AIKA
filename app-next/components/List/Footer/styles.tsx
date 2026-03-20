import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export const footerStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: pxToDp(24),
  },
  text: {
    fontSize: pxToDp(24),
  },
});

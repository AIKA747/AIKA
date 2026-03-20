import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export const styleStyles = StyleSheet.create({
  container: {
    backgroundColor: '#4932FF',
    borderRadius: pxToDp(12),
    padding: pxToDp(16),
  },
  loading: {},

  tips: {
    paddingBottom: pxToDp(10),
  },
  tipsText: {
    fontSize: pxToDp(24),
    color: '#FFF',
    opacity: 0.6,
  },
});

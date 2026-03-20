import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';
export default StyleSheet.create({
  container: {},
});
export const StyleCount = StyleSheet.create({
  container: {
    borderRadius: pxToDp(8),
    minWidth: pxToDp(36),
    width: 'auto',
    height: pxToDp(26),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pxToDp(4),
  },
  containerDot: {
    height: pxToDp(12),
    width: pxToDp(12),
    borderRadius: pxToDp(12),
  },
  absolute: {
    position: 'absolute',
    right: pxToDp(0),
    top: pxToDp(0),
  },
  text: {
    width: '100%',
    fontSize: pxToDp(20),
    lineHeight: pxToDp(24),
  },
});

import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  colors: {
    paddingVertical: pxToDp(24),
    paddingHorizontal: pxToDp(12),
  },
  colorItem: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: pxToDp(1),
    borderColor: 'transparent',
    backgroundColor: '#D9D9D9',
    aspectRatio: 0.75,
    borderRadius: pxToDp(24),
  },
  selectedColor: {
    borderColor: '#D9D9D9',
  },
  checkbox: {
    position: 'absolute',
    borderColor: '#D9D9D9',
    borderWidth: pxToDp(2),
    borderRadius: pxToDp(14),
    padding: pxToDp(2),
    bottom: pxToDp(24),
  },
});

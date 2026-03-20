import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    paddingVertical: pxToDp(30),
  },
  items: {},
  item: {
    marginHorizontal: pxToDp(30),
    borderColor: '#A07BED',
    borderWidth: pxToDp(2),
    borderRadius: pxToDp(32),
    width: pxToDp(240),
    height: pxToDp(240),
    position: 'relative',
    overflow: 'hidden',
  },

  itemImage: {
    width: '100%',
    height: '100%',
  },
  check: {
    position: 'absolute',
    right: pxToDp(16),
    top: pxToDp(16),
  },
  free: {
    position: 'absolute',
    left: pxToDp(16),
    bottom: pxToDp(16),
    borderWidth: pxToDp(2),
    borderRadius: pxToDp(32),
    paddingHorizontal: pxToDp(16),
    paddingVertical: pxToDp(8),
    backgroundColor: '#fff',
  },
  freeText: {
    fontSize: pxToDp(24),
    fontFamily: 'ProductSansBold',
  },
});

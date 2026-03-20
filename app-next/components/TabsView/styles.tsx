import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';
export default StyleSheet.create({
  container: {
    height: pxToDp(80),
    borderRadius: pxToDp(80),
    // paddingHorizontal: pxToDp(10),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDropShadow: {
    flex: 1,
    borderRadius: pxToDp(80),
  },

  item: {
    flex: 1,
    borderRadius: pxToDp(80),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: pxToDp(20),
  },
  itemActive: {},
  itemText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(32),
    textAlign: 'center',
  },
});

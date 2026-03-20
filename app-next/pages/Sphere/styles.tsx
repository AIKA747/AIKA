import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  fixedBtnBox: {
    width: pxToDp(40 * 2),
    height: pxToDp(40 * 2),
    borderRadius: pxToDp(40),
    position: 'absolute',
    top: 0,
    right: pxToDp(16 * 2),
    shadowColor: 'rgba(32, 22, 53, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  fixedPostBtn: {
    width: '100%',
    height: '100%',
    borderRadius: pxToDp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    width: '100%',
    height: '100%',
  },
  blockImage: {
    borderRadius: pxToDp(28),
  },
  blockTitle: {
    paddingTop: pxToDp(30),
    paddingHorizontal: pxToDp(30),
    fontFamily: 'ProductSansBold',
    fontSize: pxToDp(36),
    lineHeight: pxToDp(42),
  },
  blockDesc: {
    paddingTop: pxToDp(10),
    paddingHorizontal: pxToDp(30),
    fontSize: pxToDp(24),
    lineHeight: pxToDp(29),
  },
});

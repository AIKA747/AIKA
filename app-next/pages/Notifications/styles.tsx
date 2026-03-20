import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    // backgroundColor: '#262A32',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  bellDot: {
    backgroundColor: '#A07BED',
    width: pxToDp(8 * 2),
    height: pxToDp(8 * 2),
    borderRadius: pxToDp(4 * 2),
    position: 'absolute',
    left: -pxToDp(4 * 2),
    top: pxToDp(16 * 2),
  },
});

export const RequestStyles = StyleSheet.create({
  gapTitle: {
    paddingTop: pxToDp(32),
    paddingHorizontal: pxToDp(32),
    backgroundColor: '#0B0C0A',
  },
  gapTitleText: {
    fontFamily: 'ProductSansBold',
    fontSize: pxToDp(28),
  },
  container: {
    marginHorizontal: pxToDp(32),
    paddingBottom: pxToDp(16),
    borderBottomColor: '#00000017',
    borderBottomWidth: pxToDp(2),
    paddingTop: pxToDp(32),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {},
  info: {
    paddingLeft: pxToDp(16),
    paddingRight: pxToDp(6),
    flex: 1,
  },
  infoName: {
    fontFamily: 'ProductSansBold',
    fontSize: pxToDp(28),
    marginBottom: pxToDp(8),
  },
  infoDesc: {
    fontSize: pxToDp(24),
    paddingTop: pxToDp(8),
    lineHeight: pxToDp(32),
  },
  button: {
    width: pxToDp(50),
    height: pxToDp(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    width: pxToDp(88),
    height: pxToDp(88),
    backgroundColor: '#ececec',
    borderRadius: pxToDp(8),
  },
});

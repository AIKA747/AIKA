import { StyleSheet } from 'react-native';

import pxToDp, { deviceHeightDp } from '@/utils/pxToDp';

export default StyleSheet.create({
  bg: {
    position: 'relative',
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    zIndex: 999,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    pointerEvents: 'none',
  },
  container: {
    // width: '100%',
    // marginBottom: Platform.OS === 'ios' ? pxToDp(32) : 0,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    paddingLeft: pxToDp(30),
    marginRight: pxToDp(60),

    paddingVertical: pxToDp(20),
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
    fontSize: pxToDp(32),
    fontFamily: 'ProductSansBold',
    paddingVertical: pxToDp(10),
  },
  titleView: {
    flex: 1,
    paddingVertical: pxToDp(10),
  },
  titleClose: {
    position: 'absolute',
    right: pxToDp(30),
    top: pxToDp(30),

    height: pxToDp(60),
    width: pxToDp(60),

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: pxToDp(64),
  },
  titleCloseIcon: {},
  body: {
    // maxHeight: '85%',
    maxHeight: deviceHeightDp * 0.8,
    // backgroundColor: 'red',
  },
  buttons: {
    flex: 1,
    height: pxToDp(140),
    padding: pxToDp(30),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },

  fullWidthContainer: {
    width: '100%',
    borderTopLeftRadius: pxToDp(24),
    borderTopRightRadius: pxToDp(24),
    marginBottom: 0,
  },
});

export const StylePositionCenter = StyleSheet.create({
  container: {
    width: '90%',
    overflow: 'hidden',
    borderRadius: pxToDp(40),
    flexDirection: 'column',
  },
  titleText: {},
  body: {},
});

export const StylePositionBottom = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: pxToDp(40),
    left: pxToDp(15),
    right: pxToDp(15),
    borderRadius: pxToDp(64),
  },
  titleText: {},
  body: {},
});

import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';
export default StyleSheet.create({
  Shadow: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#ccc',
    // borderBottomWidth: pxToDp(2),
    // opacity: 0.5,
    // backgroundColor: 'red',
    // height: pxToDp(60), // navbar 的高度 insets.top + pxToDp(16 * 2 + 60)
    // width: '100%',
  },
  icon: {
    height: pxToDp(80),
    width: pxToDp(80),
    // backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    // backgroundColor: 'blue',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'ProductSansBold',
    textAlign: 'left',
    fontSize: pxToDp(32),
  },
  moreWrap: {
    // marginHorizontal: pxToDp(24),
    minWidth: pxToDp(80),
    // backgroundColor: 'yellow',
  },
});

export const positionStylesNormal = StyleSheet.create({
  container: {},
});

export const positionStylesSticky = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

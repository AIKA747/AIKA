import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(32),
    marginTop: pxToDp(40),
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: pxToDp(36),
    fontFamily: 'ProductSansBold',
  },
  titleButton: {},

  itemGap: {
    width: pxToDp(2),
    height: pxToDp(30),
    marginHorizontal: pxToDp(8),
  },
  itemValue: {
    fontSize: pxToDp(32),
    flex: 1,
  },
});

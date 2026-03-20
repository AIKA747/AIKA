import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  indicatorContainer: {
    borderBottomWidth: pxToDp(2.5 * 2),
    // borderBottomColor: 'rgba(160, 123, 237, 0.1)',
    borderBottomColor: '#3A3B39',
  },
  indicator: {
    height: pxToDp(3 * 2),
    bottom: pxToDp(-3 * 2),
    borderRadius: pxToDp(18 * 2),
    // backgroundColor: '#A07BED',
  },
  normalLabel: {
    fontSize: pxToDp(16 * 2),
    lineHeight: pxToDp(36),
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
  },
  focusedLabel: { fontSize: pxToDp(16 * 2), lineHeight: pxToDp(36), fontWeight: 400 },
});

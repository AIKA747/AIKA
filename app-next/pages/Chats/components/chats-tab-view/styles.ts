import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  tabItem: {
    height: pxToDp(64),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pxToDp(16),
  },
  indicatorContainer: {
    borderBottomColor: '#25212E',
    borderBottomWidth: pxToDp(2),
  },
  indicator: {
    height: pxToDp(2),
    bottom: pxToDp(-1 * 2),
    backgroundColor: '#C60C93',
  },
});

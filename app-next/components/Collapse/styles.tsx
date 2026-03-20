import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(30),
    // borderBottomWidth: pxToDp(2),
  },
  head: {
    justifyContent: 'space-between',
    flexDirection: 'row',

    paddingVertical: pxToDp(20),
  },
  headTitle: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(34),
  },
  headIcon: {},
  content: {
    // paddingVertical: pxToDp(30),
  },
});

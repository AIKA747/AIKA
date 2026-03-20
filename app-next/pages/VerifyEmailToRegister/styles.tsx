import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(16),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: pxToDp(168),
    height: pxToDp(127),
  },
  title: {
    marginTop: pxToDp(30),
    height: pxToDp(60),
    width: pxToDp(600),
  },
  tips: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    marginTop: pxToDp(10),
  },
  buttons: {
    // marginTop: pxToDp(90),
  },
});

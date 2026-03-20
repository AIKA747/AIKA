import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: pxToDp(32),
  },
  title: {
    fontSize: pxToDp(36),
  },
  tips: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    marginTop: pxToDp(90),
  },
  buttons: {
    marginTop: pxToDp(90),
  },
});

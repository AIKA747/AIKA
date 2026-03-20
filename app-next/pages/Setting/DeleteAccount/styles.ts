import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: pxToDp(32),
  },
  content: {
    flex: 1,
  },
  contentTextRow: {},
  contentTextTitle: {
    marginBottom: pxToDp(32),
    fontSize: pxToDp(32),
    color: '#ffffff',
  },
  contentTextP: {
    marginBottom: pxToDp(40),
    fontSize: pxToDp(28),
    color: '#80878E',
    // opacity: 0.6,
  },
});

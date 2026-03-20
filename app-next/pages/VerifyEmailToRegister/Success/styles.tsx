import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
    padding: pxToDp(32),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: pxToDp(193),
    height: pxToDp(192),
    marginBottom: pxToDp(30),
  },
  title: {
    // marginTop: pxToDp(10),
    height: pxToDp(60),
    width: pxToDp(600),
  },
  tips: {
    color: '#000',

    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    marginTop: pxToDp(30),
  },
  buttons: {
    // marginTop: pxToDp(90),
  },
});

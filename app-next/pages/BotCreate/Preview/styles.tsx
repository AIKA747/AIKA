import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    backgroundColor: '#262A32',
    flex: 1,
  },
  container: {
    flex: 1,
  },

  info: {
    marginHorizontal: pxToDp(25),
  },
  infoText1: {
    fontSize: pxToDp(32),
    color: '#FFB64E',
  },
  infoText2: {
    fontSize: pxToDp(28),
    color: '#FFB64E',
  },

  chat: {
    flex: 1,
    marginHorizontal: pxToDp(25),

    borderRadius: pxToDp(40),
    borderColor: '#7B6E9D',
    borderWidth: pxToDp(4),
    marginVertical: pxToDp(30),
    overflow: 'hidden',
  },

  buttons: {
    marginHorizontal: pxToDp(25),
    marginBottom: pxToDp(25),
  },
});

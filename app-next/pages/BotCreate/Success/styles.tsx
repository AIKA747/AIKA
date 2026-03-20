import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    backgroundColor: '#262A32',
    flex: 1,
  },
  container: {
    flex: 1,
    padding: pxToDp(32),

    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  botImage: {
    width: pxToDp(181),
    height: pxToDp(186),
    marginTop: pxToDp(20),
  },

  text1: {
    fontSize: pxToDp(36),
    color: '#ffffff',
    fontFamily: 'ProductSansBold',
    marginTop: pxToDp(20),
  },
  text2: {
    fontSize: pxToDp(32),
    color: '#C4C5C6',
    marginTop: pxToDp(20),
  },

  buttons: {
    flex: 1,
    width: '100%',
    marginTop: pxToDp(60),
  },
});

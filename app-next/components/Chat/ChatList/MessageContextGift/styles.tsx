import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    // backgroundColor: '#352B4D',
    // borderRadius: pxToDp(12),
    // padding: pxToDp(16),
  },
  text: {
    color: '#EBE2FF',
    fontSize: pxToDp(24),
    textAlign: 'right',
    paddingTop: pxToDp(10),
  },
  image: {
    width: pxToDp(300),
    height: pxToDp(150),
    borderRadius: pxToDp(20),
    // TODO 渐变
    // borderColor: '#ECA2FF',
    // borderWidth: pxToDp(4),
  },
});

export const messagesStylesLeft = StyleSheet.create({
  image: {},
});
export const messagesStylesRight = StyleSheet.create({
  image: {
    borderBottomRightRadius: 0,
  },
});

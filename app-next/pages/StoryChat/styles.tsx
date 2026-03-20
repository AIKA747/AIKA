import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    overflow: 'hidden',
  },
  NavBarMore: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: pxToDp(20),
  },
  NavBarMoreIcon: {
    height: pxToDp(60),
    width: pxToDp(60),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: pxToDp(10),
  },
});

export const noticeModalStyles = StyleSheet.create({
  container: {},
  bg: {
    height: pxToDp(460),
    borderTopLeftRadius: pxToDp(10),
    borderTopRightRadius: pxToDp(10),
  },
  title: {
    fontSize: pxToDp(36),
    fontFamily: 'ProductSansBold',
    color: '#fff',
    textAlign: 'center',
    paddingTop: pxToDp(48),
  },
  content: {
    maxHeight: pxToDp(430),
    marginVertical: pxToDp(10),
  },
  text: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    color: '#fff',
    textAlign: 'center',

    paddingHorizontal: pxToDp(20),
  },
});

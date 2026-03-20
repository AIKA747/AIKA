import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    borderRadius: pxToDp(24),
    paddingHorizontal: pxToDp(20),
    paddingVertical: pxToDp(22),
    minWidth: pxToDp(150),
  },
  text: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
  },

  button: {
    width: pxToDp(208),
    height: pxToDp(74),
    borderRadius: pxToDp(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(33),
  },
});

export const messagesStylesLeft = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F6',
    borderBottomLeftRadius: 0,
  },
  text: {
    color: '#000',
    fontSize: pxToDp(28),
  },
});
export const messagesStylesRight = StyleSheet.create({
  container: {
    backgroundColor: '#A07BED',
    borderBottomRightRadius: 0,
  },
  text: {
    color: '#fff',
    fontSize: pxToDp(28),
  },
});

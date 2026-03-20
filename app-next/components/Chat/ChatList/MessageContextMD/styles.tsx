import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    borderRadius: pxToDp(24),
    paddingHorizontal: pxToDp(20),
    paddingVertical: pxToDp(12),
    minWidth: pxToDp(450),
    // width: pxToDp(450),
    maxWidth: '100%',
  },
  text: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
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

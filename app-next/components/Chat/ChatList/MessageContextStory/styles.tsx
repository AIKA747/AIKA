import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export const styleStyles = StyleSheet.create({
  container: {
    backgroundColor: '#352B4D',
    borderRadius: pxToDp(12),
    padding: pxToDp(16),
    width: pxToDp(430),
  },
  text: {
    color: '#FFF',
  },
});

export const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(183,174,255,0.2)',
    marginTop: pxToDp(20),

    borderRadius: pxToDp(12),
    overflow: 'hidden',
  },

  bg: {
    width: '100%',
    height: pxToDp(220),
    backgroundColor: '#000',
  },

  info: {
    padding: pxToDp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: pxToDp(24),
    fontFamily: 'ProductSansBold',
    color: '#FFF',
  },
  button: {
    marginTop: pxToDp(20),
    width: '60%',
  },
});

export const messagesStylesLeft = StyleSheet.create({
  container: {
    backgroundColor: '#4932FF',
    borderBottomLeftRadius: 0,
  },
  text: {
    color: '#FFF',
    fontSize: pxToDp(24),
  },
});
export const messagesStylesRight = StyleSheet.create({
  container: {
    backgroundColor: '#DBD6FF',
    borderBottomRightRadius: 0,
  },
  text: {
    color: '#000',
    fontSize: pxToDp(2248),
  },
});

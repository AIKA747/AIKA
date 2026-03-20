import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export const styleStyles = StyleSheet.create({
  container: {
    borderRadius: pxToDp(24),
    padding: pxToDp(16),
    width: pxToDp(450),
  },
  text: {
    paddingTop: pxToDp(10),
    color: '#FFF',
  },
});

export const cardStyles = StyleSheet.create({
  container: {
    // width: pxToDp(430),
    backgroundColor: 'rgba(183,174,255,0.2)',

    borderRadius: pxToDp(12),
    padding: pxToDp(16),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    height: pxToDp(100),
    width: pxToDp(100),
    borderRadius: pxToDp(100),
    backgroundColor: '#000',
  },
  info: {
    flex: 1,
    paddingHorizontal: pxToDp(10),
  },
  infoName: {
    fontSize: pxToDp(36),
    color: '#fff',
    fontFamily: 'ProductSansBold',
  },
  infoStatistic: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: pxToDp(10),
  },
  infoStatisticIcon: {},
  infoStatisticText: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(24),
    color: '#fff',
    marginLeft: pxToDp(5),
    marginRight: pxToDp(40),
  },
  buttons: {
    flex: 1,
    marginTop: pxToDp(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsItem: {
    width: '48%',
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
    fontSize: pxToDp(24),
  },
});

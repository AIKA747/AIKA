import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(36),
    paddingVertical: pxToDp(40),
    gap: pxToDp(24),
  },
});

export const itemStyle = StyleSheet.create({
  DropShadow: {
    borderRadius: pxToDp(32),
    paddingVertical: pxToDp(25),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: pxToDp(2),
    borderColor: '#fff',

    borderRadius: pxToDp(32),
    paddingVertical: pxToDp(46),
    paddingHorizontal: pxToDp(30),
  },
  info: {
    flex: 1,
    paddingHorizontal: pxToDp(30),
  },
  name: {
    fontSize: pxToDp(28),
    fontFamily: 'ProductSansBold',
    color: '#000',
  },
  period: {
    fontSize: pxToDp(24),
    paddingTop: pxToDp(22),
    color: '#000',
  },
  amount: {
    fontSize: pxToDp(36),
    fontFamily: 'ProductSansBold',
    color: '#000',
  },
  amountSub: {
    // fontSize: pxToDp(24),
    //  fontFamily: 'ProductSansBold',
    // color: '#000',
  },
});

export const itemStyleChecked = StyleSheet.create({
  DropShadow: {
    ...itemStyle.DropShadow,
  },
  container: {
    ...itemStyle.container,
  },
  info: {
    ...itemStyle.info,
  },
  name: {
    ...itemStyle.name,
  },
  period: {
    ...itemStyle.period,
  },
  amount: {
    ...itemStyle.amount,
  },
  amountSub: {
    ...itemStyle.amountSub,
  },
});

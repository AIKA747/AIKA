import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  historyList: {
    flex: 1,
    paddingHorizontal: pxToDp(36),
    paddingTop: pxToDp(36),
  },
  info: {
    flex: 1,
  },
  historyListItem: {
    paddingVertical: pxToDp(30),
    paddingHorizontal: pxToDp(30),
    borderRadius: pxToDp(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: pxToDp(24),
    color: '#000',
  },
  box: {
    borderRadius: pxToDp(24),
    padding: pxToDp(24),
    overflow: 'hidden',
    marginTop: pxToDp(24),
    gap: pxToDp(10),
  },

  text: { textAlign: 'center', fontSize: pxToDp(24), lineHeight: pxToDp(36) },
});

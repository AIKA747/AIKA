import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
  },

  buttonWrapper: {
    padding: pxToDp(32),
  },
  container: {
    flex: 1,
  },
  historyList: {
    flex: 1,
    paddingHorizontal: pxToDp(36),
  },

  DropShadow: {
    borderRadius: pxToDp(32),
    paddingVertical: pxToDp(25),
  },
  historyListItem: {
    paddingVertical: pxToDp(46),
    paddingHorizontal: pxToDp(30),
    borderRadius: pxToDp(32),
    // alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  packageName: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: pxToDp(24),
  },
  name: {
    flex: 1,
    fontSize: pxToDp(32),
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
});

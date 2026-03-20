import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  title: {
    top: pxToDp(12),
    fontSize: pxToDp(32),
    lineHeight: pxToDp(38),
    textAlign: 'left',
    overflow: 'hidden',
    marginBottom: pxToDp(20),
  },
  container: {
    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(32),
    borderTopWidth: pxToDp(1),
    borderTopColor: '#342E3F',
  },
  item: {
    paddingVertical: pxToDp(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: pxToDp(24),
  },
  itemText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(36),
    paddingHorizontal: pxToDp(8),
    textAlign: 'left',
    overflow: 'hidden',
  },
  step: {
    gap: pxToDp(24),
  },
  stepTitle: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(36),
    textAlign: 'left',
    overflow: 'hidden',
  },
  stepContent: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(28),
    lineHeight: pxToDp(36),
    textAlign: 'left',
    overflow: 'hidden',
    marginBottom: pxToDp(34),
  },
});

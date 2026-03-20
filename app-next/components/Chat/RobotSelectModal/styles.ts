import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';
export default StyleSheet.create({
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pxToDp(24),
    paddingVertical: pxToDp(24),
    borderBottomWidth: pxToDp(2),
    borderColor: '#25212E',
  },
  itemLeftContent: {
    flex: 1,
    flexDirection: 'row',
    gap: pxToDp(12),
    alignItems: 'center',
  },
  avatar: {
    width: pxToDp(88),
    height: pxToDp(88),
    borderRadius: pxToDp(16),
  },
  status: {
    fontSize: pxToDp(28),
    color: '#80878E',
  },
});

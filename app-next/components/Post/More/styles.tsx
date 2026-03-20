import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  containerWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  container: {
    position: 'absolute',
    borderRadius: pxToDp(22),
    width: pxToDp(380),
    backgroundColor: 'blue',
  },
  moreActionItem: {
    flexDirection: 'row',
    gap: pxToDp(32),
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: pxToDp(26),
    paddingHorizontal: pxToDp(24),
  },
  moreActionItemText: {
    fontSize: pxToDp(32),
  },
  moreActionItemTopBorder: {
    borderTopWidth: pxToDp(1),
    borderTopColor: 'rgba(128, 135, 142, 1)',
  },
});

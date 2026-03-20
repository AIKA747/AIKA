import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {},

  valueInput: {
    opacity: 0.5,
    position: 'absolute',
    // top: 10,
    // left: 10,
    width: 1,
    height: 1,
  },

  blocks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  block: {
    width: pxToDp(52 * 2),
    height: pxToDp(56 * 2),
    borderRadius: pxToDp(14 * 2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockText: {
    fontSize: pxToDp(16 * 2),
  },
});

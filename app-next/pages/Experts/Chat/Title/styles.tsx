import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: pxToDp(10),
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatar: {
    height: pxToDp(80),
    width: pxToDp(80),
    borderRadius: pxToDp(80),
    // backgroundColor: 'red',
  },
  name: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(48),
    paddingLeft: pxToDp(20),
  },
});

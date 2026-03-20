import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: { flex: 1 },

  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: pxToDp(32) },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pxToDp(20),
    marginBottom: pxToDp(40),
  },

  verifiedText: {
    fontSize: pxToDp(32),
    lineHeight: pxToDp(48),
  },

  passedIcon: { width: pxToDp(48), height: pxToDp(48), marginLeft: pxToDp(12) },
});

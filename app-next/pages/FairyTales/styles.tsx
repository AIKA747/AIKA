import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    backgroundColor: '#262A32',
    flex: 1,
  },
  container: {
    flex: 1,
  },

  navTitle: {
    alignSelf: 'center',
    fontSize: pxToDp(36),
    lineHeight: pxToDp(44),
    marginBottom: pxToDp(18),
  },
  tabBtn: {
    height: pxToDp(100),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(160, 123, 237, 0.05)',
  },
});

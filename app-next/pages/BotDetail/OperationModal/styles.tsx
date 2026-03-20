import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  content: {
    backgroundColor: '#59516F',
    borderRadius: pxToDp(24),
    width: '100%',
  },
  main: {
    flexDirection: 'column',
    marginTop: pxToDp(80),
    justifyContent: 'center',
    // alignItems: 'center',
    marginBottom: pxToDp(28),
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: pxToDp(24),
    marginHorizontal: pxToDp(34),
    gap: pxToDp(12),
  },
  infoIcon: {},
  infoText: {
    color: '#fff',
    fontSize: pxToDp(34),
  },
});

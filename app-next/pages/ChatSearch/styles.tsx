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
});

export const ListStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pxToDp(24),
    paddingHorizontal: pxToDp(32),
  },
  avatar: {
    height: pxToDp(80),
    width: pxToDp(80),
    borderRadius: pxToDp(80),
  },
  info: {
    flex: 1,
    paddingLeft: pxToDp(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    textAlign: 'left',
    fontSize: pxToDp(26),
    lineHeight: pxToDp(32),
  },
  date: {
    flex: 1,
    textAlign: 'right',
    fontSize: pxToDp(26),
    lineHeight: pxToDp(32),
  },
  text: {
    marginTop: pxToDp(12),
    width: '100%',
    fontSize: pxToDp(26),
    lineHeight: pxToDp(32),
  },
});

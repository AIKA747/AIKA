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

export const GroupsRequestStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: pxToDp(32),
    paddingBottom: pxToDp(16),

    paddingTop: pxToDp(32),

    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatar: {},
  info: {
    paddingLeft: pxToDp(16),
    flex: 1,
  },
  infoName: {
    fontFamily: 'ProductSansBold',
    fontSize: pxToDp(28),
  },
  infoDesc: {
    fontSize: pxToDp(24),
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    // width: pxToDp(128),
    height: pxToDp(56),
    borderRadius: pxToDp(16),
    marginLeft: pxToDp(12),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pxToDp(16),
  },
  buttonText: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(40),
    fontFamily: 'ProductSansBold',
  },
});

import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  formItem: {
    marginTop: pxToDp(20 * 2),
    justifyContent: 'center',
  },
  formLabel: {
    fontSize: pxToDp(16 * 2),
    lineHeight: pxToDp(24 * 2),
    marginBottom: pxToDp(4 * 2),
  },
  formContent: {
    borderRadius: pxToDp(14 * 2),
    paddingHorizontal: pxToDp(16 * 2),
    fontSize: pxToDp(16 * 2),
    lineHeight: pxToDp(18 * 2),
    minHeight: pxToDp(56 * 2),
    justifyContent: 'center',
  },
  formBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passed: {
    width: pxToDp(24 * 2),
    height: pxToDp(24 * 2),
    marginLeft: pxToDp(12 * 2),
  },
  usernameInUse: {
    position: 'absolute',
    color: 'red',
    bottom: -pxToDp(12 * 2 + 4),
    fontSize: pxToDp(12 * 2),
    lineHeight: pxToDp(12 * 2),
  },
  genderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

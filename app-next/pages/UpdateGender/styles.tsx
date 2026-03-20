import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: pxToDp(16 * 2),
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
    minHeight: pxToDp(56 * 2),
    justifyContent: 'center',
  },
  genderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

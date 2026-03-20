import { StyleSheet } from 'react-native';

import pxToDp, { deviceHeightDp } from '@/utils/pxToDp';

export default StyleSheet.create({
  ScrollView: {
    paddingHorizontal: pxToDp(32),
    maxHeight: deviceHeightDp * 0.75,
  },
  content: {
    paddingBottom: pxToDp(32),
  },
});

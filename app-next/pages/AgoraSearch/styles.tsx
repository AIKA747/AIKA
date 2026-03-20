import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  ScrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: pxToDp(30),
    paddingVertical: pxToDp(30),
  },
});

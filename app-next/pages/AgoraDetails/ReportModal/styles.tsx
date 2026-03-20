import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(36),
    // paddingVertical: pxToDp(50),
  },
  tips: {
    paddingBottom: pxToDp(30),
    fontSize: pxToDp(30),
    lineHeight: pxToDp(40),
    color: '#fff',
  },
  CheckboxGroup: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  CheckboxGroupItem: {
    // width: '47%',
    justifyContent: 'center',
  },
});

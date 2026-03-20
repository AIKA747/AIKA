import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {},

  selectContainer: {
    flex: 1,
    borderRadius: pxToDp(100),
    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(32),
  },

  selectContainerText: {
    fontSize: pxToDp(32),
    marginRight: pxToDp(40),
  },
  selectContainerArrow: {
    position: 'absolute',
    top: pxToDp(32),
    right: pxToDp(32),
  },

  modalContainer: {
    paddingHorizontal: pxToDp(30),
    paddingVertical: pxToDp(30),
  },
});

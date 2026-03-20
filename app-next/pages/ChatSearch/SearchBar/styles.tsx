import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';
const HEIGHT = pxToDp(80);
export default StyleSheet.create({
  Shadow: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: pxToDp(16),
    paddingHorizontal: pxToDp(16),
  },
  back: {
    paddingRight: pxToDp(10),
    height: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {},

  input: {
    flex: 1,
    alignItems: 'center',
    height: HEIGHT,
    flexDirection: 'row',
    borderRadius: pxToDp(20),
    paddingHorizontal: pxToDp(16),
  },

  inputSearch: {
    marginHorizontal: pxToDp(10),
  },
  inputSearchIcon: {},
  inputText: {
    flex: 1,
    height: '100%',
    backgroundColor: 'transparent',
  },
  inputClear: {
    height: pxToDp(40),
    width: pxToDp(40),
    borderRadius: pxToDp(40),

    justifyContent: 'center',
    alignItems: 'center',
  },
  inputClearIcon: {},

  cancel: {
    paddingLeft: pxToDp(10),
    height: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: pxToDp(32),
  },
});

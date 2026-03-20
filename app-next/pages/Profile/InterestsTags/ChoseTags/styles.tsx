import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {},
  CheckboxGroup: {
    paddingTop: pxToDp(16),
  },
  CheckboxGroupItem: {
    borderRadius: pxToDp(50),
  },

  addMore: {
    marginTop: pxToDp(16),
    borderRadius: pxToDp(60),
    paddingHorizontal: pxToDp(19),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: pxToDp(30),
    paddingVertical: pxToDp(20),
  },
  iconWrapper: {
    height: pxToDp(60),
    width: pxToDp(60),

    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBg: {
    height: pxToDp(48),
    width: pxToDp(48),
    borderRadius: pxToDp(16),

    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {},
});

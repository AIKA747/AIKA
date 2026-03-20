import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    // backgroundColor: '#262A32',
    flex: 1,
  },
  TabsView: {
    paddingHorizontal: pxToDp(32),
  },

  buttonWrapper: {
    padding: pxToDp(32),
  },
  container: {
    flex: 1,
    // paddingHorizontal: pxToDp(30),
  },

  list: {
    paddingHorizontal: pxToDp(36),
    marginTop: pxToDp(32),
  },

  DropShadow: {
    borderRadius: pxToDp(32),
    paddingVertical: pxToDp(25),
  },

  listItem: {
    borderRadius: pxToDp(20),
    paddingHorizontal: pxToDp(30),
    paddingVertical: pxToDp(28),
  },

  listItemTitle: {
    fontSize: pxToDp(30),
    paddingBottom: pxToDp(30),
    fontFamily: 'ProductSansRegular',
  },
  listItemDate: {
    fontSize: pxToDp(28),
    opacity: 0.7,
  },
});

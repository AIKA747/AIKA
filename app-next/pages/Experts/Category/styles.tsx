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

  List: {
    paddingHorizontal: pxToDp(32),
  },
  ListItem: {
    width: pxToDp(332),
    height: pxToDp(280),
    marginBottom: pxToDp(20),
  },
  ListItemBg: {
    height: '100%',
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  ListItemImage: {
    borderRadius: pxToDp(28),
  },
  ListItemText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(34),
    fontFamily: 'ProductSansBold',
    padding: pxToDp(20),
    textAlign: 'center',
  },
});

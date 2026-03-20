import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  tagsWrapper: {
    height: pxToDp(60),
    marginBottom: pxToDp(18),
    paddingHorizontal: pxToDp(32),
  },
  tags: {},
  tag: {
    // backgroundColor: 'red',
    borderRadius: pxToDp(60),
    marginRight: pxToDp(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pxToDp(24),
  },
  tagText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(48),
  },

  List: {
    paddingHorizontal: pxToDp(32),
    paddingTop: pxToDp(0),
  },
  ListItem: {
    // width: pxToDp(330),
    height: pxToDp(280),
    marginBottom: pxToDp(20),
  },
  ListItemBg: {
    height: '100%',
    width: '100%',
  },
  ListItemImage: {
    borderRadius: pxToDp(28),
  },
  ListItemText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(34),
    fontFamily: 'ProductSansBold',
    padding: pxToDp(20),
  },
});

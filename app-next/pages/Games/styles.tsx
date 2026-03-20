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

  tagsWrapper: {
    height: pxToDp(60),
    marginTop: pxToDp(18),
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
  },
  ListItem: {
    height: pxToDp(632),
    marginBottom: pxToDp(20),
  },
  ListItemBg: {
    height: '100%',
    width: '100%',
  },
  ListItemImage: {
    borderRadius: pxToDp(28),
  },
  ListItemTitle: {
    fontSize: pxToDp(48),
    lineHeight: pxToDp(58),
    fontFamily: 'ProductSansBold',
    padding: pxToDp(40),
  },
  ListItemDesc: {
    flex: 1,

    fontSize: pxToDp(24),
    lineHeight: pxToDp(29),

    paddingHorizontal: pxToDp(40),
    paddingVertical: pxToDp(20),

    textAlignVertical: 'bottom',

    paddingBottom: pxToDp(24),
  },
  ListItemButton: {
    borderRadius: pxToDp(28),
    height: pxToDp(100),
    width: pxToDp(606),
    borderWidth: pxToDp(2),
    marginHorizontal: pxToDp(40),
    marginBottom: pxToDp(40),

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ListItemButtonIcon: {
    marginRight: pxToDp(10),
  },
  ListItemButtonText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(35),
  },
});

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

  List: {},
  ListItem: {
    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(32),
    borderBottomWidth: pxToDp(2),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ListItemAvatar: {
    borderWidth: pxToDp(2),
    height: pxToDp(128),
    width: pxToDp(128),
    borderRadius: pxToDp(128),
    padding: pxToDp(4),
    overflow: 'hidden',
    marginRight: pxToDp(16),
  },
  ListItemAvatarImage: {
    borderRadius: pxToDp(88),
    height: '100%',
    width: '100%',
  },
  ListItemInfo: {
    flex: 1,
  },
  ListItemInfoName: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(48),
    fontFamily: 'ProductSansBold',
  },
  ListItemInfoDesc: {
    paddingRight: pxToDp(40),
    fontSize: pxToDp(24),
    lineHeight: pxToDp(40),
  },
});

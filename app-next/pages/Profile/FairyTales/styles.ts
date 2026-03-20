import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  List: {
    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(24),
  },
  ListItemWrapper: {},
  ListItem: {},
  ListItemCover: {},
  ListItemTitle: {
    fontSize: pxToDp(28),
  },
  ListItemIntroduction: {
    fontSize: pxToDp(24),
  },
  ListItemProgressTitle: {
    fontSize: pxToDp(28),
  },
  ListItemProgress: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    width: pxToDp(230),
    height: pxToDp(20),
    borderRadius: pxToDp(20),
    marginTop: pxToDp(12),
    borderWidth: pxToDp(4),
  },
  ListItemProgressInner: {
    height: pxToDp(12),
    borderRadius: pxToDp(20),
  },
  ListItemButton: {
    width: pxToDp(220),
    height: pxToDp(66),
    borderWidth: pxToDp(2),
    borderRadius: pxToDp(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ListItemButtonIcon: {
    marginRight: pxToDp(10),
  },
  ListItemButtonText: {
    fontSize: pxToDp(26),
    lineHeight: pxToDp(35),
  },
});

import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  List: {
    paddingHorizontal: pxToDp(32),
    paddingBottom: pxToDp(32 + 80),
  },
  ListItemWrapper: {
    position: 'relative',
    width: pxToDp(750 - 32 * 2),
    height: pxToDp(520 - 80),
    shadowColor: '#30119021',
    shadowOffset: { width: pxToDp(0), height: pxToDp(-30) },
    shadowOpacity: 1,
    shadowRadius: pxToDp(20),
    paddingTop: pxToDp(90),
  },
  ListItem: {
    width: pxToDp(750 - 32 * 2),
    height: pxToDp(520),
  },
  ListItemBg: {
    height: '100%',
    width: '100%',
  },
  ListItemImage: {
    borderRadius: pxToDp(40),
    borderColor: '#A07BED',
    borderWidth: pxToDp(2),
  },
  ListItemTitle: {
    width: '50%',
    fontSize: pxToDp(36),
    lineHeight: pxToDp(32),
    fontFamily: 'ProductSansBold',
    padding: pxToDp(80),
  },
  ListItemProgressTitle: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(35),
    paddingHorizontal: pxToDp(36),
    paddingBottom: pxToDp(20),
  },
  ListItemProgress: {
    width: pxToDp(230),
    height: pxToDp(20),
    borderRadius: pxToDp(20),
    marginHorizontal: pxToDp(36),
    borderWidth: pxToDp(4),
  },
  ListItemProgressInner: {
    height: pxToDp(12),
    borderRadius: pxToDp(20),
  },
  ListItemButton: {
    width: pxToDp(246),
    height: pxToDp(80),
    marginTop: pxToDp(40),
    marginHorizontal: pxToDp(36),
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
    fontSize: pxToDp(28),
    lineHeight: pxToDp(35),
  },
});

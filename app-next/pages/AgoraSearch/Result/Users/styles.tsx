import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export const UsersStyles = StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(32),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: pxToDp(20),
    gap: pxToDp(18),
  },
  itemAvatar: {
    borderWidth: pxToDp(2),
    height: pxToDp(100),
    width: pxToDp(100),
    borderRadius: pxToDp(88),
    padding: pxToDp(4),
    overflow: 'hidden',
  },
  itemAvatarImage: {
    borderRadius: pxToDp(88),
    height: '100%',
    width: '100%',
  },
  itemInfo: {
    flex: 1,
  },
  itemInfoName: {
    fontSize: pxToDp(28),
    marginBottom: pxToDp(12),
  },
  itemInfoId: {
    fontSize: pxToDp(24),
  },
  itemInfoDesc: {
    paddingTop: pxToDp(10),
    fontSize: pxToDp(24),
  },
  itemButtons: {},
  itemButtonsButton: {
    // width: pxToDp(180),
    paddingHorizontal: pxToDp(16),
    height: pxToDp(50),
    borderRadius: pxToDp(10),
    borderWidth: pxToDp(2),

    justifyContent: 'center',
    alignItems: 'center',
  },
  itemButtonsButtonText: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(44),
  },
});

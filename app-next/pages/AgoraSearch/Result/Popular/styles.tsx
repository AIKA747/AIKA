import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  title: {
    fontSize: pxToDp(32),
    lineHeight: pxToDp(32),
    paddingHorizontal: pxToDp(32),
    paddingTop: pxToDp(32),
  },
  sesAll: {
    fontSize: pxToDp(32),
    lineHeight: pxToDp(40),
    paddingHorizontal: pxToDp(32),
  },
});
export const PeopleStyles = StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(32),
    gap: pxToDp(12),
  },
  item: {
    width: pxToDp(306),
    paddingHorizontal: pxToDp(20),
    paddingVertical: pxToDp(20),
    borderRadius: pxToDp(20),
    marginRight: pxToDp(10),
    height: pxToDp(200),
  },
  itemAvatar: {
    borderWidth: pxToDp(2),
    height: pxToDp(88),
    width: pxToDp(88),
    borderRadius: pxToDp(88),
    padding: pxToDp(4),
    overflow: 'hidden',
    marginRight: pxToDp(16),
    marginBottom: pxToDp(10),
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
  },
  itemInfoId: {
    fontSize: pxToDp(24),
  },
  itemInfoDesc: {
    paddingTop: pxToDp(10),
    fontSize: pxToDp(24),
  },
  itemButtons: {
    position: 'absolute',
    right: pxToDp(20),
    top: pxToDp(20),
  },
  itemButtonsButton: {
    // width: pxToDp(180),
    height: pxToDp(50),
    borderRadius: pxToDp(10),
    borderWidth: pxToDp(2),
    paddingHorizontal: pxToDp(12),

    justifyContent: 'center',
    alignItems: 'center',
  },
  itemButtonsButtonText: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(40),
  },
});

export const PopularStyles = StyleSheet.create({
  container: {
    paddingVertical: pxToDp(32),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: pxToDp(32),
    paddingBottom: pxToDp(20),
    marginBottom: pxToDp(60),
  },
  itemAvatar: {
    borderWidth: pxToDp(2),
    height: pxToDp(88),
    width: pxToDp(88),
    borderRadius: pxToDp(88),
    padding: pxToDp(4),
    overflow: 'hidden',
    marginRight: pxToDp(16),
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
  },
  itemInfoId: {
    fontSize: pxToDp(24),
  },
  itemInfoDesc: {
    paddingTop: pxToDp(10),
    fontSize: pxToDp(28),
  },
  itemMore: {
    position: 'absolute',
    right: 0,
    top: pxToDp(0),
    height: pxToDp(40),
    width: pxToDp(40),

    justifyContent: 'center',
    alignItems: 'center',
  },
  itemMoreIcon: {},
  contentImage: {
    flex: 1,
    marginTop: pxToDp(12),
    width: pxToDp(580),
    // height: pxToDp(211 * 2),
    borderRadius: pxToDp(20),
    overflow: 'hidden',
  },
});

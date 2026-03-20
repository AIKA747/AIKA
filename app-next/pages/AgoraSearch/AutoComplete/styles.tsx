import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
  },
});

export const AssociatedStyles = StyleSheet.create({
  container: {
    paddingVertical: pxToDp(16),
  },
  KeywordsItems: {
    paddingVertical: pxToDp(16),
    paddingHorizontal: pxToDp(32),
    paddingTop: 0,
    borderBottomColor: '#0B0C0A1A',
    borderBottomWidth: pxToDp(1),
  },
  KeywordsItemsItem: {
    flexDirection: 'row',
    paddingVertical: pxToDp(10),
  },
  KeywordsItemsItemText: {
    fontSize: pxToDp(32),
  },
  KeywordsItemsItemTextImportant: {
    fontFamily: 'ProductSansBold',
  },
  PeopleItems: {
    paddingVertical: pxToDp(16),
    paddingHorizontal: pxToDp(32),
    paddingBottom: 0,
  },
  PeopleItemsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: pxToDp(10),
  },
  PeopleItemsItemAvatar: {
    borderWidth: pxToDp(2),
    height: pxToDp(88),
    width: pxToDp(88),
    borderRadius: pxToDp(88),
    padding: pxToDp(4),
    overflow: 'hidden',
    marginRight: pxToDp(16),
  },
  PeopleItemsItemAvatarImage: {
    borderRadius: pxToDp(88),
    height: '100%',
    width: '100%',
  },
  PeopleItemsItemInfo: {
    flex: 1,
  },
  PeopleItemsItemInfoName: {
    fontSize: pxToDp(28),
  },
  PeopleItemsItemInfoId: {
    fontSize: pxToDp(24),
  },
  noData: {
    fontSize: pxToDp(24),
    textAlign: 'center',
  },
});
export const EmptyStyles = StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(16),
  },
  text: {
    textAlign: 'center',
    fontSize: pxToDp(28),
  },
});

export const RecentSearchStyles = StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(16),
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: pxToDp(32),
  },
  titleClear: {
    height: pxToDp(40),
    width: pxToDp(40),
    borderRadius: pxToDp(40),

    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: pxToDp(28),
  },
  items: {
    paddingTop: pxToDp(20),
  },
  itemsItem: {
    paddingTop: pxToDp(20),
  },
  itemsItemText: {
    fontSize: pxToDp(32),
  },
});

import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pxToDp(24),
    paddingVertical: pxToDp(24),
    borderBottomWidth: pxToDp(2),
    borderColor: '#25212E',
  },
  itemLeftContent: {
    flex: 1,
    flexDirection: 'row',
    gap: pxToDp(12),
    alignItems: 'center',
  },
  avatar: {
    width: pxToDp(88),
    height: pxToDp(88),
    borderRadius: pxToDp(16),
  },
  status: {
    fontSize: pxToDp(28),
    color: '#80878E',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: pxToDp(88),
    marginHorizontal: pxToDp(32),
    marginBottom: pxToDp(24),
    backgroundColor: 'rgba(27, 27, 34, 1)',
    borderRadius: pxToDp(24),
    paddingHorizontal: pxToDp(24),
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    height: '100%',
    width: '100%',
    paddingRight: pxToDp(48),
  },
  searchInput: {
    width: '100%',
    color: '#fff',
    fontSize: pxToDp(32),
  },
  iconWrapper: {},
});

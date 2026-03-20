import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  card: {
    marginHorizontal: pxToDp(24),
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(24),
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    paddingVertical: pxToDp(24),
    borderBottomWidth: pxToDp(2),
    borderColor: '#25212E',
    paddingHorizontal: pxToDp(24),
    gap: pxToDp(12),
    alignItems: 'center',
  },
  cardSubtitle: {
    color: '#80878E',
    fontSize: pxToDp(28),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pxToDp(24),
    paddingVertical: pxToDp(24),
    borderBottomWidth: pxToDp(2),
    borderColor: '#25212E',
    gap: pxToDp(20),
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
    borderRadius: pxToDp(12),
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
  members: {
    flex: 1,
  },
  qaContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    width: pxToDp(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: pxToDp(200),
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
    fontFamily: 'ProductSansBold',
    fontSize: pxToDp(32),
  },
});

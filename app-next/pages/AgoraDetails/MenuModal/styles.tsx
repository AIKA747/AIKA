import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#1B1B22',
    width: pxToDp(460),
    borderRadius: pxToDp(24),
    shadowColor: '#1B1B22',
    shadowOffset: { width: 0, height: pxToDp(2) },
    shadowOpacity: 0.8,
    shadowRadius: pxToDp(2),
    elevation: 5,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: pxToDp(24),
    paddingHorizontal: pxToDp(20),
  },
  itemIcon: {
    height: pxToDp(46),
    width: pxToDp(46),
  },
  itemText: {
    flex: 1,
    fontSize: pxToDp(30),
    paddingLeft: pxToDp(40),
  },
});

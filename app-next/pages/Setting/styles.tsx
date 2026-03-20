import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  ScrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: pxToDp(32),
    // paddingVertical: pxToDp(30),
  },

  item: {
    width: '100%',
    borderRadius: pxToDp(32),
    height: pxToDp(112),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: pxToDp(32),
    marginBottom: pxToDp(16),
  },

  itemText: {
    fontSize: pxToDp(32),
    lineHeight: pxToDp(44),
    flex: 1,
  },
  itemTextDanger: {
    color: '#ED1313',
  },
  itemIconLeft: {},
  itemIconRight: {
    height: pxToDp(32),
    width: pxToDp(32),
  },

  itemBorder: {
    borderWidth: pxToDp(2),
  },

  itemRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  itemThemeText: {
    marginRight: pxToDp(10),
    fontSize: pxToDp(32),
  },
  itemCacheText: {
    fontSize: pxToDp(28),
  },
  itemButton: {
    marginLeft: pxToDp(16),
    borderRadius: pxToDp(200),
    paddingHorizontal: pxToDp(18),
    paddingVertical: pxToDp(4),
    borderWidth: pxToDp(2),
  },
  itemButtonText: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(40),
  },
  itemIcon: {},

  containerExpend: {
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // paddingVertical: pxToDp(32),
    // marginBottom: pxToDp(30),
    borderRadius: pxToDp(20),
  },
});

export const StyleSelectTheme = StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(32),
  },
  Checkbox: {
    // backgroundColor: 'red',

    // backgroundColor: '#1B1D26',
    borderRadius: pxToDp(20),
  },
});

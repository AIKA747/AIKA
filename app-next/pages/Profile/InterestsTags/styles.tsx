import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(32),
    marginTop: pxToDp(40),
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: pxToDp(36),
    fontFamily: 'ProductSansBold',
    flex: 1,
  },
  titleButton: {},

  items: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',

    marginTop: pxToDp(30),
  },
  item: {
    borderRadius: pxToDp(50),
    marginBottom: pxToDp(20),
    marginRight: pxToDp(14),
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemText: {
    paddingVertical: pxToDp(20),
    paddingHorizontal: pxToDp(34),
    fontSize: pxToDp(28),
  },
});

export const modalStyles = StyleSheet.create({
  container: {
    padding: pxToDp(33),
  },

  headerTips: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    color: '#000',
  },
  footerTips: {
    paddingTop: pxToDp(30),
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    color: '#000',
    opacity: 0.6,
  },
});

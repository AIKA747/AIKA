import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

import { MyAiImageSize } from './constants';

export default StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(32),
    marginTop: pxToDp(40),
  },
  title: {},
  titleText: {
    fontSize: pxToDp(36),
    fontFamily: 'ProductSansBold',
    color: '#fff',
  },
  titleTextNum: {},

  block: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1D26',
    borderRadius: pxToDp(20),
    marginTop: pxToDp(40),
    paddingVertical: pxToDp(32),
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  items: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  item: {
    height: MyAiImageSize,
    width: MyAiImageSize,
    borderRadius: MyAiImageSize,
    // shadow
  },
  itemImage: {
    height: MyAiImageSize,
    width: MyAiImageSize,
    borderRadius: MyAiImageSize,
  },
  itemAll: {
    height: MyAiImageSize,
    width: MyAiImageSize,
    borderRadius: MyAiImageSize,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: pxToDp(18),

    backgroundColor: '#4C455E',
  },
  itemAllIcon: {},

  create: {
    marginTop: pxToDp(32),
    width: pxToDp(320),
    height: pxToDp(82),
  },
});

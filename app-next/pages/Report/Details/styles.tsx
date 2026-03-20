import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  ScrollView: {},
  container: {
    flex: 1,
    paddingHorizontal: pxToDp(30),
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: pxToDp(32),
  },
  headerStatus: {
    color: '#4932FF',
    fontSize: pxToDp(32),
    fontFamily: 'ProductSansBold',
  },
  headerDate: {
    fontSize: pxToDp(32),
    fontFamily: 'ProductSansBold',
  },
  title: {
    fontSize: pxToDp(32),
    lineHeight: pxToDp(40),
    fontFamily: 'ProductSansBold',
    marginTop: pxToDp(38),
  },
  content: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    marginTop: pxToDp(28),
  },
  images: {
    marginTop: pxToDp(28),
    flexDirection: 'row',
  },

  buttons: {
    paddingHorizontal: pxToDp(30),
    paddingVertical: pxToDp(30),
  },
});

export const ItemNewAvatar = StyleSheet.create({
  bgWrapper: {
    height: pxToDp(200),
    width: pxToDp(200),
    overflow: 'visible',
    marginRight: pxToDp(20),
  },
  bg: {
    height: pxToDp(200),
    width: pxToDp(200),
    borderRadius: pxToDp(240),

    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    height: pxToDp(200 - 14),
    width: pxToDp(200 - 14),
    borderRadius: pxToDp(240 - 14),
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    borderRadius: pxToDp(200 - 14),
  },
  avatarReloadWrapper: {
    height: pxToDp(96),
    width: pxToDp(96),

    position: 'absolute',
    bottom: 0,
    right: -pxToDp(48),
  },
  avatarReloadWrapper2: {
    height: pxToDp(96),
    width: pxToDp(96),
    borderRadius: pxToDp(96),
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarReload: {
    height: pxToDp(48),
    width: pxToDp(48),
  },

  avatarEmpty: {
    height: pxToDp(200 - 14),
    width: pxToDp(200 - 14),
    borderRadius: pxToDp(240 - 14),
    backgroundColor: '#F6F6F6',

    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmptyAdd: {
    height: pxToDp(98),
    width: pxToDp(98),
  },
});

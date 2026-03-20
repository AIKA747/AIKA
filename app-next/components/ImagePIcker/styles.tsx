import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';
export default StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  item: {
    position: 'relative',
    height: pxToDp(200),
    width: pxToDp(200),
    marginRight: pxToDp(20),
    marginTop: pxToDp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDelete: {
    position: 'absolute',
    right: -pxToDp(20),
    top: -pxToDp(20),

    height: pxToDp(40),
    width: pxToDp(40),
    borderRadius: pxToDp(40),

    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLoading: {
    borderRadius: pxToDp(20),
    position: 'absolute',
    left: 0,
    top: 0,
    height: pxToDp(200),
    width: pxToDp(200),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    backgroundColor: '#000',
  },
  itemImage: {
    height: pxToDp(200),
    width: pxToDp(200),

    borderWidth: pxToDp(2),
    borderStyle: 'solid',
    borderRadius: pxToDp(20),
  },
  itemNew: {
    height: pxToDp(200),
    width: pxToDp(200),

    borderWidth: pxToDp(2),
    borderStyle: 'dashed',
    borderRadius: pxToDp(20),

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: pxToDp(20),
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

  linearBtn: {
    borderRadius: pxToDp(240),
    borderWidth: pxToDp(1),
  },

  avatar: {
    position: 'relative',
    height: pxToDp(200 - 14),
    width: pxToDp(200 - 14),
    borderRadius: pxToDp(240 - 14),
    overflow: 'hidden',
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

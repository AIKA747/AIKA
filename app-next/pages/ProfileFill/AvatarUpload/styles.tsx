import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export const AvatarUploadStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgWrapper: {
    height: pxToDp(240),
    width: pxToDp(240),
    overflow: 'visible',
    position: 'relative',
  },

  bg: {
    height: pxToDp(240),
    width: pxToDp(240),
    borderRadius: pxToDp(240),

    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: pxToDp(240 - 14),
    width: pxToDp(240 - 14),
    borderRadius: pxToDp(240 - 14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLoading: {},
  avatarImage: {
    height: '100%',
    width: '100%',
    borderRadius: pxToDp(240 - 14),
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
    height: pxToDp(240 - 14),
    width: pxToDp(240 - 14),
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

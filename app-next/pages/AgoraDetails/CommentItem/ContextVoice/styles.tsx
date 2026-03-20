import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    borderRadius: pxToDp(24),
    paddingHorizontal: pxToDp(24),
    paddingVertical: pxToDp(32),
  },
  containerWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconWrapper: {
    height: pxToDp(72),
    width: pxToDp(72),
    borderRadius: pxToDp(72),

    justifyContent: 'center',
    alignItems: 'center',
    marginRight: pxToDp(30),
  },
  icon: {
    height: pxToDp(44),
    width: pxToDp(44),
    transform: [{ translateX: pxToDp(4) }], // 图标本身左重右轻，修复一下居中
  },

  infoWrapper: {},
  wave: {
    // width: pxToDp(180),
  },
  text: {
    fontSize: pxToDp(24),
  },
  username: {
    fontSize: pxToDp(24),
  },
});

export const messagesStylesLeft = StyleSheet.create({
  container: {},
  iconWrapper: {},
  username: {
    textAlign: 'left',
  },
});
export const messagesStylesRight = StyleSheet.create({
  container: {
    borderBottomRightRadius: 0,
  },
  iconWrapper: {},
  username: {
    textAlign: 'right',
  },
});

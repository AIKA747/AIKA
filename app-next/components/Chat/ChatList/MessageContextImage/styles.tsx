import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    backgroundColor: '#301190', // left
    // backgroundColor: '#DBD6FF',
    borderRadius: pxToDp(12),
  },
  noData: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperDropShadow: {},

  iconWrapper: {
    width: pxToDp(96),
    borderRadius: pxToDp(96),
    height: pxToDp(96),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: pxToDp(48),
    height: pxToDp(48),
  },

  text: {
    color: '#FFF',
    fontSize: pxToDp(24),
  },
  image: {
    position: 'relative',
    backgroundColor: '#000',
    borderRadius: pxToDp(12),
    borderBottomRightRadius: pxToDp(0),
    overflow: 'hidden',
  },

  imageViewFooter: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewFooterText: {
    color: '#fff',
    fontSize: pxToDp(24),
  },
  imageViewFooterTime: {
    color: '#fff',
    fontSize: pxToDp(24),
  },
  imageViewHeaderMore: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: pxToDp(24),
  },
  time: {
    position: 'absolute',
    bottom: pxToDp(16),
    right: pxToDp(16),
    fontSize: pxToDp(24),
    lineHeight: pxToDp(28.8),
    marginHorizontal: pxToDp(8),
  },
});

export const messagesStylesLeft = StyleSheet.create({
  wrapper: { flexDirection: 'row-reverse', alignItems: 'flex-end' },
  container: {},
  iconWrapper: {},
});
export const messagesStylesRight = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'flex-end' },
  container: {
    borderBottomRightRadius: 0,
  },
  iconWrapper: {},
});

import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: pxToDp(24),
    paddingHorizontal: pxToDp(16),
    paddingVertical: pxToDp(16),
    maxWidth: '85%',
  },
  commentItem: {
    marginVertical: pxToDp(16),
    paddingHorizontal: pxToDp(24),
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: pxToDp(12),
  },
  commentItemAvatar: {},
  commentItemContent: {
    maxWidth: '85%',
    flex: 1,
  },
  containerText: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    minWidth: pxToDp(0),
    fontSize: pxToDp(32),
    lineHeight: pxToDp(19.2 * 2),
    marginBottom: pxToDp(12),
  },
  replyContainer: {
    borderRadius: pxToDp(12),
    marginBottom: pxToDp(16),
    overflow: 'hidden',
    flexDirection: 'row',
  },
  replyContent: {
    padding: pxToDp(16),
  },
  replyContentLine: {
    width: pxToDp(8),
    height: '100%',
  },
  leftContainer: {
    backgroundColor: '#1B1B22',
    borderBottomLeftRadius: 0,
  },
  rightContainer: {
    backgroundColor: '#301190',
    borderBottomRightRadius: 0,
  },
  nickname: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(28),
    marginBottom: pxToDp(16),
  },
  time: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(28.8),
    alignSelf: 'flex-end',
  },
});

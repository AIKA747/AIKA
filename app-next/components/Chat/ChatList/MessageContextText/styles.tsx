import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: pxToDp(24),
    padding: pxToDp(16),
    minWidth: pxToDp(0),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '85%',
  },
  text: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    minWidth: pxToDp(0),
    fontSize: pxToDp(32),
    lineHeight: pxToDp(19.2 * 2),
  },
  time: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(28.8),
    alignSelf: 'flex-end',
  },
  username: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(16.8 * 2),
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
  },
  highlighted: {
    backgroundColor: 'yellow', // 高亮背景色
  },
  replyMessage: {
    borderRadius: pxToDp(12),
    marginBottom: pxToDp(16),
    overflow: 'hidden',
    flexDirection: 'row',
  },
  line: {
    width: pxToDp(8),
    height: '100%',
  },
  replyContent: {
    padding: pxToDp(16),
  },
});

export const messagesStylesLeft = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F6',
    borderBottomLeftRadius: 0,
  },
  text: {
    // color: '#000',
    fontSize: pxToDp(28),
  },
  username: {
    textAlign: 'left',
  },
  groupMsgBgColor: { backgroundColor: '#fff' },
});
export const messagesStylesRight = StyleSheet.create({
  container: {
    backgroundColor: '#A07BED',
    borderBottomRightRadius: 0,
  },
  text: {
    // color: '#fff',
    fontSize: pxToDp(28),
  },
  username: {
    textAlign: 'right',
  },
  groupMsgBgColor: { backgroundColor: '#301190' },
});

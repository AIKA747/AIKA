import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  itemSeparator: {
    flex: 1,
    height: pxToDp(2),
    backgroundColor: '#1B1B22',
  },
  itemWrapper: {
    paddingVertical: pxToDp(32),
    paddingHorizontal: pxToDp(24),
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: pxToDp(20),
  },
  avatar: {
    position: 'relative',
  },
  plus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: pxToDp(28),
    borderRadius: pxToDp(4),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nickname: {
    fontSize: pxToDp(32),
    color: '#fff',
    fontWeight: 'bold',
  },
  time: {
    fontSize: pxToDp(24),
    color: '#80878E',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pxToDp(20),
  },
  content: {
    flex: 1,
    paddingVertical: pxToDp(16),
  },
  itemReply: {
    flexDirection: 'row',
    gap: pxToDp(8),
    marginBottom: pxToDp(16),
  },
  itemReplyText: {
    fontSize: pxToDp(24),
    color: '#80878E',
  },
  contentText: {
    color: '#fff',
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
  },
  actions: { flexDirection: 'row', gap: pxToDp(20), marginTop: pxToDp(16) },
  actionItem: {
    flexDirection: 'row',
    gap: pxToDp(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionItemText: { fontSize: pxToDp(28), color: '#80878E' },
  lineWrapper: {
    width: pxToDp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    width: pxToDp(0.5),
    backgroundColor: '#80878E',
  },
});

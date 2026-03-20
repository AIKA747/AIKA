import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  NavBarMore: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: pxToDp(20),
  },
  NavBarMoreIcon: {
    height: pxToDp(60),
    width: pxToDp(60),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: pxToDp(10),
  },
  commentItemStatusText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentItemTime: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentItemTimeBubble: {
    paddingVertical: pxToDp(5),
    paddingHorizontal: pxToDp(20),
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(14),
  },
  commentItemTimeBubbleText: {
    textAlign: 'center',
    fontSize: pxToDp(20),
    color: '#80878E',
  },
});

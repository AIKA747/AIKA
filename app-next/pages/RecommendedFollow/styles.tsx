import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  caption: {
    color: 'rgba(0,0,0,0.3)',
    fontSize: pxToDp(12 * 2),
    lineHeight: pxToDp(14.4 * 2),
    marginTop: pxToDp(8 * 2),
  },

  content: {
    marginVertical: pxToDp(20 * 2),
    borderTopWidth: pxToDp(2),
    borderTopColor: '#1B1B22',
  },

  label: {
    fontSize: pxToDp(16 * 2),
    lineHeight: pxToDp(24 * 2),
    marginBottom: pxToDp(4 * 2),
  },

  box: {
    marginTop: pxToDp(10 * 2),
    borderRadius: pxToDp(14 * 2),
    padding: pxToDp(10 * 2),
    flexDirection: 'row',
    // alignItems: 'center',
  },
  avatar: {
    width: pxToDp(46 * 2),
    marginRight: pxToDp(8 * 2),
    marginTop: pxToDp(4 * 2),
  },
  userinfo: {
    marginBottom: pxToDp(10 * 2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: pxToDp(14 * 2),
    lineHeight: pxToDp(24 * 2),
    marginBottom: pxToDp(1 * 2),
  },
  username: {
    fontSize: pxToDp(12 * 2),
    lineHeight: pxToDp(14.4 * 2),
    bottom: pxToDp(6 * 2),
  },

  followBtn: {
    paddingVertical: pxToDp(4 * 2),
    paddingHorizontal: pxToDp(32 * 2),
    borderRadius: pxToDp(14 * 2),
    borderWidth: pxToDp(1 * 2),
    borderColor: 'rgba(255,255,255,0.1)',
  },
  followedBtn: { borderColor: 'transparent', backgroundColor: '#A07BED' },
  followedBtnText: { color: '#fff' },
  followBtnText: { fontSize: pxToDp(12 * 2) },
  desc: { fontSize: pxToDp(12 * 2), lineHeight: pxToDp(14.4 * 2) },
});

import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  title: {
    fontSize: pxToDp(16),
    color: '#fff',
  },
  alertIcon: { width: pxToDp(24 * 2), height: pxToDp(24 * 2), marginRight: pxToDp(10 * 2) },
  topBox: { flexDirection: 'row', paddingHorizontal: pxToDp(16 * 2) },
  quickPostBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pxToDp(8 * 2),
    paddingVertical: pxToDp(5 * 2),
    marginRight: pxToDp(8 * 2),
  },
  postInput: {
    flex: 1,
    fontSize: pxToDp(24),
    marginLeft: pxToDp(16),
  },
  postBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: pxToDp(8 * 2),
    width: pxToDp(30 * 2),
    height: pxToDp(30 * 2),
    borderRadius: pxToDp(15 * 2),
    backgroundColor: 'rgba(160, 123, 237, 0.1)',
  },
  postBtnIcon: { width: pxToDp(20 * 2), height: pxToDp(20 * 2) },
  searchBtn: { padding: pxToDp(10 * 2) },
  notificationBtn: { padding: pxToDp(10 * 2) },
  searchBtnIcon: {},
  bellBtnIcon: {},
  bellDot: {
    backgroundColor: '#A07BED',
    width: pxToDp(8 * 2),
    height: pxToDp(8 * 2),
    borderRadius: pxToDp(4 * 2),
    position: 'absolute',
    right: pxToDp(11 * 2),
    top: pxToDp(9 * 2),
  },
  newPostBox: { alignItems: 'center', marginRight: pxToDp(12 * 2) },
  newPostBtn: {
    padding: pxToDp(3 * 2),
    width: pxToDp(56 * 2),
    height: pxToDp(56 * 2),
    borderRadius: pxToDp(28 * 2),
    borderWidth: pxToDp(2),
  },
  newPostBtnDashed: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pxToDp(100 * 2),
    width: '100%',
    height: '100%',
    borderStyle: 'dashed',
    borderWidth: pxToDp(2),
  },
  newPostUsername: { marginTop: pxToDp(8), fontSize: pxToDp(10 * 2), lineHeight: pxToDp(16 * 2) },

  sceneContainer: {
    paddingTop: pxToDp(10 * 2),
    paddingHorizontal: pxToDp(16 * 2),
  },

  fixedPostBtnBox: {
    width: pxToDp(40 * 2),
    height: pxToDp(40 * 2),
    borderRadius: pxToDp(40),
    position: 'absolute',
    bottom: pxToDp(22 * 2),
    right: pxToDp(16 * 2),
    shadowColor: 'rgba(32, 22, 53, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  fixedPostBtn: {
    width: '100%',
    height: '100%',
    borderRadius: pxToDp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

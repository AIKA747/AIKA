import { StyleSheet } from 'react-native';

import pxToDp, { deviceWidthDp } from '@/utils/pxToDp';

export default StyleSheet.create({
  navBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: pxToDp(32),
  },
  newBox: { borderRadius: pxToDp(16), marginBottom: pxToDp(32) },
  newGroupBtn: {
    height: pxToDp(71),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pxToDp(16),
  },
  groupInfoBox: {
    borderRadius: pxToDp(16),
    padding: pxToDp(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pxToDp(16),
  },
  camera: {
    height: pxToDp(108),
    width: pxToDp(108),
    borderRadius: pxToDp(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  descriptionBox: {
    borderRadius: pxToDp(16),
    padding: pxToDp(20),
    marginVertical: pxToDp(16),
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  description: {
    marginTop: pxToDp(12),
    fontSize: pxToDp(28),
    lineHeight: pxToDp(16.8 * 2),
  },
  searchBox: {
    marginVertical: pxToDp(16),
    height: pxToDp(80),
    borderRadius: pxToDp(20),
    paddingHorizontal: pxToDp(24),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIco: { marginRight: pxToDp(24) },
  selectedBox: {
    borderRadius: pxToDp(16),
    paddingVertical: pxToDp(16),
    marginBottom: pxToDp(16),
    marginTop: pxToDp(16),
  },
  selectedName: {
    width: pxToDp(88),
    fontSize: pxToDp(20),
    lineHeight: pxToDp(24),
    marginTop: pxToDp(6),
    textAlign: 'center',
  },
  removeBtn: { position: 'absolute', top: pxToDp(-12), right: pxToDp(-18) },

  // user-card
  userCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: pxToDp(16) },
  userInfo: { flex: 1, marginLeft: pxToDp(16), justifyContent: 'space-between' },
  nickname: { fontSize: pxToDp(32), lineHeight: pxToDp(19.2 * 2), flex: 1 },
  username: { fontSize: pxToDp(28), lineHeight: pxToDp(16.8 * 2), flex: 1 },
  userCardBottomLine: {
    left: pxToDp(32),
    height: pxToDp(2),
    alignSelf: 'flex-end',
    width: deviceWidthDp - pxToDp(88) - pxToDp(32) - pxToDp(8),
  },

  uploading: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});

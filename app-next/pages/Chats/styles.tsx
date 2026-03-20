import { StyleSheet } from 'react-native';

import pxToDp, { deviceWidthDp } from '../../utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0B0C0A',
  },
  topBox: {
    height: pxToDp(80),
    flexDirection: 'row',
    marginVertical: pxToDp(16),
    marginHorizontal: pxToDp(32),
  },
  searchBox: {
    flex: 1,
    alignItems: 'center',
  },
  searchI: { marginRight: pxToDp(24) },
  input: { fontSize: pxToDp(28), lineHeight: pxToDp(28.8), flex: 1 },
  newBtn: {
    width: pxToDp(80),
    borderRadius: pxToDp(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: pxToDp(16),
    marginRight: pxToDp(8),
  },
  moreBtn: {
    width: pxToDp(80),
    borderRadius: pxToDp(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneText: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(24 * 1.2),
  },
  navTitle: {
    alignSelf: 'center',
    fontSize: pxToDp(36),
    lineHeight: pxToDp(44),
    marginBottom: pxToDp(18),
  },
  tabBtn: { height: pxToDp(100), flex: 1, alignItems: 'center', justifyContent: 'center' },

  // story-card
  textInfo: { marginLeft: pxToDp(16), flex: 1 },
  name: { fontSize: pxToDp(28), lineHeight: pxToDp(48), color: '#fff' },
  desc: { fontSize: pxToDp(24), lineHeight: pxToDp(40) },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: pxToDp(20),
  },
  progressText: { fontSize: pxToDp(24), lineHeight: pxToDp(40) },
  progressBox: {
    width: pxToDp(158 * 2),
    height: pxToDp(24),
    padding: pxToDp(4),
    borderRadius: pxToDp(200),
  },
  progress: {
    borderRadius: pxToDp(200),
    height: '100%',
  },
  continue: {
    height: pxToDp(64),
    borderRadius: pxToDp(20),
    paddingHorizontal: pxToDp(16),
    flexDirection: 'row',
    gap: pxToDp(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: pxToDp(2),
  },

  // experts

  // chat
  chat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pxToDp(16),
  },
  chatCardInfo: {
    flex: 1,
    marginLeft: pxToDp(16),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatName: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(32),
    lineHeight: pxToDp(19.2 * 2),
    flex: 1,
  },
  chatCardTime: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    flexShrink: 0,
    fontSize: pxToDp(28),
    lineHeight: pxToDp(16.8 * 2),
    marginLeft: pxToDp(16),
  },
  chatMsgNickname: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(28),
    lineHeight: pxToDp(16.8 * 2),
  },
  chatMsg: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(28),
    lineHeight: pxToDp(20 * 2),
    flex: 1,
  },
  chatMsgCountBox: {
    marginLeft: pxToDp(24),
    height: pxToDp(32),
    minWidth: pxToDp(32),
    paddingHorizontal: pxToDp(8),
    borderRadius: pxToDp(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatMsgCount: { fontSize: pxToDp(24), lineHeight: pxToDp(14.4 * 2), color: '#fff' },
  chatBottomLine: {
    flex: 1,
    height: pxToDp(2),
    alignSelf: 'flex-end',
    width: deviceWidthDp - pxToDp(88) - pxToDp(32) - pxToDp(8),
  },

  moreModalMask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#00000050',
  },
  moreModalContent: {
    position: 'absolute',
    right: pxToDp(32),
    backgroundColor: '#fff',
    minWidth: pxToDp(176 * 2),
    borderRadius: pxToDp(24),
  },
  moreModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pxToDp(16),
    paddingVertical: pxToDp(24),
  },

  selectBot: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopRightRadius: pxToDp(24),
    borderTopLeftRadius: pxToDp(24),
  },

  deleteBtn: {
    marginTop: pxToDp(16),
    padding: pxToDp(32),
    borderRadius: pxToDp(28),
    alignItems: 'center',
  },

  delModalTitle: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(16.9 * 2),
    top: pxToDp(8),
  },
});

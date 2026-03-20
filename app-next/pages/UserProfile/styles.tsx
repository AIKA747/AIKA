import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: pxToDp(24),
    fontSize: pxToDp(34),
    color: '#fff',
    textAlign: 'center',
  },
  btn: {
    paddingHorizontal: pxToDp(42),
    paddingVertical: pxToDp(16),
    backgroundColor: '#000',
    borderRadius: pxToDp(16),
    marginTop: pxToDp(132),
    borderWidth: 1,
    borderColor: '#A07BED',
  },
  btnText: {
    fontSize: pxToDp(32),
    color: '#A07BED',
  },
  settingBox: {
    width: pxToDp(60),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOuter: {
    width: pxToDp(200),
    height: pxToDp(200),
    borderRadius: pxToDp(20),
    borderWidth: pxToDp(2),
    borderColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
    padding: pxToDp(2),
  },
  avatarInner: {
    flex: 1,
    width: '100%',
    borderRadius: pxToDp(20),
    backgroundColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBox: {
    flexDirection: 'row',
    gap: pxToDp(24),
  },
  counterItemBox: {
    backgroundColor: '#ffffff20',
    borderRadius: pxToDp(20),
    padding: pxToDp(8),
    borderColor: '#ffffff40',
    borderWidth: pxToDp(3),
    paddingHorizontal: pxToDp(18),
    paddingVertical: pxToDp(10),
    gap: pxToDp(6),
  },
  counterItemValue: {
    fontSize: pxToDp(28),
    fontFamily: 'ProductSansRegular',
    fontWeight: '400',
  },
  counterItemLabel: {
    fontSize: pxToDp(24),
  },
  nicknameAndBioBox: { marginLeft: pxToDp(16), flex: 1, marginTop: pxToDp(8) },
  nickname: { fontSize: pxToDp(32), lineHeight: pxToDp(19.2 * 2) },
  username: { fontSize: pxToDp(28), lineHeight: pxToDp(19.2 * 2) },
  bio: { fontSize: pxToDp(28), lineHeight: pxToDp(40) },
  followAndChatBox: { flexDirection: 'row' },
  FCBtn: {
    flex: 1,
    height: pxToDp(80),
    borderRadius: pxToDp(20),
    borderWidth: pxToDp(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000060',
  },
  container: {
    flex: 1,
  },
  info: {
    flexDirection: 'row',
  },

  infoAvatar: {
    width: pxToDp(200),
    height: pxToDp(200),
    borderRadius: pxToDp(40),
    marginRight: pxToDp(30),
    backgroundColor: '#000',
  },

  infoContent: {
    height: pxToDp(200),
    flex: 1,
  },
  infoContentTex1: {
    color: '#fff',
    fontSize: pxToDp(36),
    width: '100%',
  },
  infoContentTex2: {
    color: '#fff',
    fontSize: pxToDp(36),
  },
  infoContentTex3: {
    color: '#ECA0FF',
    fontSize: pxToDp(60),
  },

  list: {
    paddingTop: pxToDp(30),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#4C455E',
    borderRadius: pxToDp(20),
    padding: pxToDp(30),
    paddingTop: pxToDp(40),
    paddingBottom: pxToDp(40),
    marginBottom: pxToDp(30),
  },

  listItemAvatar: {
    width: pxToDp(150),
    height: pxToDp(150),
    borderRadius: pxToDp(100),
    marginRight: pxToDp(30),
    backgroundColor: '#000',
  },

  listItemButtons: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: pxToDp(20),

    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemButtonsButton: {
    // backgroundColor: '#393D46',
    // borderColor: '#393D46',
    marginLeft: pxToDp(20),
  },

  listItemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  listItemInfoName: {
    fontSize: pxToDp(36),
    color: '#fff',
    flex: 1,
  },

  listItemInfoContext: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  listItemInfoContextItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: pxToDp(40),
  },
  listItemInfoContextItemIcon: {},
  listItemInfoContextItemText: {
    color: '#fff',
    marginLeft: pxToDp(10),
  },
  actionContainer: {
    gap: pxToDp(24),
    paddingHorizontal: pxToDp(24),
    paddingVertical: pxToDp(44),
  },
  actionInfo: {
    flexDirection: 'row',
    gap: pxToDp(24),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  actionInfoDot: {
    width: pxToDp(6),
    height: pxToDp(6),
    borderRadius: pxToDp(2),
    marginTop: pxToDp(14),
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pxToDp(26),
    paddingHorizontal: pxToDp(30),
    backgroundColor: '#ffffff',
    borderRadius: pxToDp(20),
    gap: pxToDp(20),
  },
  actionItemText: {
    fontSize: pxToDp(32),
    textAlign: 'center',
  },
});

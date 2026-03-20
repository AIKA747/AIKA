import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  hero: {
    position: 'relative',
    width: '100%',
    marginBottom: pxToDp(48),
  },
  heroBg: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: pxToDp(340),
    height: pxToDp(340),
    borderRadius: pxToDp(24),
    overflow: 'hidden',
  },
  editAvatarBtn: {
    position: 'absolute',
    right: pxToDp(24),
    padding: pxToDp(24),
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  editAvatarBtnIcon: {
    width: pxToDp(48),
    height: pxToDp(48),
  },
  container: {
    flex: 1,
    paddingHorizontal: pxToDp(24),
  },
  card: {
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(24),
  },
  copyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    marginBottom: pxToDp(12),
    paddingHorizontal: pxToDp(24),
  },
  itemLabel: {
    paddingVertical: pxToDp(12),
  },
  itemLabelText: {
    fontSize: pxToDp(32),
    color: '#80878E',
  },
  itemValue: {
    paddingVertical: pxToDp(14),
  },
  itemValueText: {
    color: '#ffffff',
    fontSize: pxToDp(32),
  },
  copyBtn: {
    width: pxToDp(28),
    height: pxToDp(28),
    padding: pxToDp(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: pxToDp(32),
    borderBottomWidth: pxToDp(2),
    borderColor: 'transparent',
    paddingHorizontal: pxToDp(24),
  },
  linkItemText: {
    color: '#ffffff',
    fontSize: pxToDp(32),
  },
  addItem: {
    flexDirection: 'row',
    gap: pxToDp(12),
    padding: pxToDp(24),
  },
  addItemText: {
    color: '#80878E',
    fontSize: pxToDp(32),
  },
  moderators: {
    paddingHorizontal: pxToDp(24),
  },
  moderatorsItem: {
    paddingVertical: pxToDp(24),
    borderBottomWidth: pxToDp(2),
    borderColor: '#25212E',
    flexDirection: 'row',
    gap: pxToDp(12),
  },
  moderatorsItemAvatar: {
    width: pxToDp(88),
    height: pxToDp(88),
    borderRadius: pxToDp(12),
  },
  moderatorsItemInfo: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  nameWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: pxToDp(12),
  },
  userName: {
    fontSize: pxToDp(32),
    color: '#ffffff',
  },
  role: {
    fontSize: pxToDp(28),
    color: '#80878E',
  },
  status: {
    fontSize: pxToDp(28),
    color: '#80878E',
  },
  leaveGroupModalHeader: {
    paddingTop: pxToDp(34),
    paddingHorizontal: pxToDp(32),
    gap: pxToDp(12),
  },
  leaveGroupModalHeaderTitle: {
    fontSize: pxToDp(48),
    color: '#ffffff',
  },
  leaveGroupModalHeaderDesc: {
    fontSize: pxToDp(32),
    color: '#80878E',
  },
  leaveGroupModalFormContent: {
    // fontSize: pxToDp(16 * 2),
    // minHeight: pxToDp(56 * 2),
    // justifyContent: 'center',
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: pxToDp(24),
    borderBottomWidth: pxToDp(2),
    borderColor: '#25212E',
  },
  formItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pxToDp(12),
  },
  formItemAvatar: {
    width: pxToDp(88),
    height: pxToDp(88),
    borderRadius: pxToDp(12),
    color: '#A07BED',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: pxToDp(34),
    color: '#fff',
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

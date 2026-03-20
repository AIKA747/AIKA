import { StyleSheet } from 'react-native';

import pxToDp, { deviceWidthDp } from '@/utils/pxToDp';

export default StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pxToDp(8 * 2),
  },
  headerContent: { flex: 1, marginHorizontal: pxToDp(12 * 2) },
  nickname: {
    fontSize: pxToDp(14 * 2),
    lineHeight: pxToDp(24 * 2),
    fontFamily: 'ProductSansBold',
  },
  date: { fontSize: pxToDp(12 * 2), lineHeight: pxToDp(20 * 2) },
  moreIcon: { height: pxToDp(24 * 2), width: pxToDp(24 * 2) },
  contentText: {
    fontSize: pxToDp(14 * 2),
    lineHeight: pxToDp(22 * 2),
    marginTop: pxToDp(6 * 2),
  },
  contentHidden: {
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
    opacity: 0,
    zIndex: -1,
  },
  contentImg: { borderRadius: pxToDp(12 * 2), width: '100%', height: '100%' },
  readMore: { fontSize: pxToDp(28) },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pxToDp(8),
  },
  bottomBtnText: { fontSize: pxToDp(14 * 2) },
  bottomBtnIcon: {},

  verticalLine: {
    position: 'absolute',
    top: 0,
    left: pxToDp(88 / 2),
    width: pxToDp(2),
    height: '100%',
    backgroundColor: 'rgba(160, 123, 237, 0.16)',
  },
  moreModalContainer: {
    paddingHorizontal: pxToDp(16 * 2),
    paddingVertical: pxToDp(48),
  },
  moreModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pxToDp(24),
    gap: pxToDp(24),
  },
  moreModalItemText: {
    fontSize: pxToDp(32),
    color: '#FFFFFF',
    fontFamily: 'ProductSansBold',
  },
  alert: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    padding: pxToDp(15 * 2),
    borderRadius: pxToDp(14 * 2),
    borderWidth: pxToDp(2),
    zIndex: 1,
    width: deviceWidthDp - pxToDp(16 * 2) * 2,
  },
  alertIcon: { width: pxToDp(24 * 2), height: pxToDp(24 * 2), marginRight: pxToDp(10 * 2) },
  reportMask: {
    position: 'relative',
    flex: 1,
    width: '100%',
    height: pxToDp(315 * 2),
    padding: pxToDp(12 * 2),
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(12 * 2),
    justifyContent: 'space-between',
  },
  reportMaskClose: {
    position: 'absolute',
    right: pxToDp(24),
    top: pxToDp(24),
  },
  reportMaskContent: {
    paddingVertical: pxToDp(36 * 2),
    alignItems: 'center',
    gap: pxToDp(24),
  },
  reportMaskContentTitle: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(16 * 2),
    textAlign: 'center',
  },
  reportMaskContentDescription: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(14 * 2),
    textAlign: 'center',
  },
});

import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: pxToDp(12),
  },
  rich: {
    minHeight: 300,
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e3e3e3',
  },
  topBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pxToDp(4 * 2),
    justifyContent: 'space-between',
    paddingHorizontal: pxToDp(16 * 2),
  },
  cancel: {
    height: pxToDp(40 * 2),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  publish: {
    height: pxToDp(40 * 2),
    paddingHorizontal: pxToDp(24 * 2),
    borderRadius: pxToDp(100 * 2),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: pxToDp(12),
  },
  threadBox: { flexDirection: 'row', marginBottom: pxToDp(44 * 2) },
  avatarBox: {
    width: pxToDp(44 * 2),
    height: pxToDp(44 * 2),
    borderRadius: pxToDp(22 * 2),
  },
  input: {
    flex: 1,
    paddingTop: pxToDp(8 * 2),
    fontSize: pxToDp(16 * 2),
    marginLeft: pxToDp(10 * 2),
    lineHeight: pxToDp(24 * 2),
  },
  imgBoxContainer: { marginTop: pxToDp(10 * 2), minHeight: pxToDp(160 * 2) },
  imgBox: {
    overflow: 'hidden',
    width: pxToDp(160 * 2),
    height: pxToDp(160 * 2),
    borderRadius: pxToDp(14 * 2),
    marginRight: pxToDp(6 * 2),
  },
  img: { width: pxToDp(160 * 2), height: pxToDp(160 * 2) },
  imgDelete: { position: 'absolute', top: pxToDp(6 * 2), right: pxToDp(6 * 2) },
  imgDeleteIcon: { width: pxToDp(16 * 2), height: pxToDp(16 * 2) },
  line: {
    height: '100%',
    width: pxToDp(2),
    position: 'absolute',
    left: pxToDp(22 * 2),
    top: pxToDp(22 * 2),
    zIndex: -1,
  },
  delete: {
    top: pxToDp(10 * 2),
    marginLeft: pxToDp(10 * 2),
  },
  bottomBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: pxToDp(10 * 2),
    paddingHorizontal: pxToDp(16 * 2),
    gap: pxToDp(12),
  },
  bottomBtn: {
    flex: 1,
    width: '100%',
    height: pxToDp(40 * 2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pxToDp(10 * 2),
  },
  bottomBtnIcon: { width: pxToDp(20 * 2), height: pxToDp(20 * 2), marginRight: pxToDp(10 * 2) },

  imgMask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.666)',
  },
});

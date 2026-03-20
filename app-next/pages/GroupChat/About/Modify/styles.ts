import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: '#000',
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
    width: '100%',
    paddingBottom: pxToDp(152),
  },
  card: {
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(24),
  },
  item: {
    marginBottom: pxToDp(12),
    paddingHorizontal: pxToDp(24),
  },
  itemLabel: {
    paddingVertical: pxToDp(12),
    marginBottom: pxToDp(24),
  },
  itemLabelText: {
    fontSize: pxToDp(32),
    color: '#fff',
  },
  itemInput: {
    backgroundColor: 'rgba(27, 27, 34, 1)',
    paddingVertical: pxToDp(24),
    paddingHorizontal: pxToDp(20),
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(32),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  itemInputValue: {
    width: '100%',
    color: '#fff',
    fontSize: pxToDp(32),
  },
});

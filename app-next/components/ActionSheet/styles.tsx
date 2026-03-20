import { StyleSheet } from 'react-native';

import FontFamily from '@/constants/FontFamily';
import pxToDp from '@/utils/pxToDp';

export const ActionSheetStyles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    paddingVertical: pxToDp(32),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pxToDp(24),
    paddingHorizontal: pxToDp(10),
    backgroundColor: '#ffffff',
  },
  close: {
    position: 'absolute',
    right: pxToDp(48),
  },
  title: {
    borderTopStartRadius: pxToDp(16),
    borderTopEndRadius: pxToDp(16),
    paddingVertical: pxToDp(36),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pxToDp(10),
  },
  titleText: {
    top: pxToDp(12),
    fontSize: pxToDp(32),
    lineHeight: pxToDp(38),
    textAlign: 'left',
    overflow: 'hidden',
    marginBottom: pxToDp(20),
  },
  itemText: {
    fontFamily: FontFamily.InterMedium,
    fontSize: pxToDp(32),
    lineHeight: pxToDp(36),
    paddingHorizontal: pxToDp(8),
    textAlign: 'center',
    overflow: 'hidden',
  },
  itemIcon: {
    overflow: 'hidden',
    flexShrink: 0,
  },
});

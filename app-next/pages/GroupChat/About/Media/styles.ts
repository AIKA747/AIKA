import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  medias: {
    paddingVertical: pxToDp(24),
    paddingHorizontal: pxToDp(12),
  },
  mediaItem: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: pxToDp(1),
    borderColor: 'transparent',
    backgroundColor: '#D9D9D9',
    aspectRatio: 1,
    borderRadius: pxToDp(24),
    overflow: 'hidden',
  },
  imageViewHeaderMore: {
    flexDirection: 'row',
    gap: pxToDp(24),
    paddingRight: pxToDp(24),
  },
  imageViewFooter: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewFooterText: {
    color: '#fff',
    fontSize: pxToDp(24),
  },
  imageViewFooterTime: {
    color: '#fff',
    fontSize: pxToDp(24),
  },
});

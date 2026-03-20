import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    backgroundColor: '#352B4D',
    borderRadius: pxToDp(12),
    overflow: 'hidden',
  },
  text: {
    color: '#FFF',
    fontSize: pxToDp(24),
  },
  playIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

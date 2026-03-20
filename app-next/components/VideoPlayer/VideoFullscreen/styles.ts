import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  videoFullscreen: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#ff4400',
    zIndex: 10,
  },
  videoFullscreenClose: {
    position: 'absolute',
    left: pxToDp(32),
    zIndex: 100,
  },
  videoFullscreenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    height: pxToDp(48),
    width: pxToDp(90),
    padding: pxToDp(6),
    borderRadius: pxToDp(48),
    borderColor: '#fff',
  },

  circle: {
    height: '100%',
    aspectRatio: 1,
    backgroundColor: 'white',
  },
});

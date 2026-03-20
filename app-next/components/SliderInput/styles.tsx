import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
  },

  slider: {
    flex: 1,
  },

  sliderValue: {
    width: pxToDp(80),
    fontSize: pxToDp(32),
    color: '#FFF',
  },
});

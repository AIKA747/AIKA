import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  contentContainerStyle: { paddingHorizontal: pxToDp(32), justifyContent: 'space-between' },

  box: { borderRadius: pxToDp(24), overflow: 'hidden', marginTop: pxToDp(10) },

  boxInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: pxToDp(32),
  },

  text: { textAlign: 'center', fontSize: pxToDp(24), lineHeight: pxToDp(36) },
});

import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  avatarBox: { padding: pxToDp(3 * 2), width: '100%', borderWidth: pxToDp(1 * 2) },
  img: { width: '100%', height: '100%' },
});

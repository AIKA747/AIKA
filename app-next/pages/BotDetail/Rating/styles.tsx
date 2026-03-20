import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  ScrollView: {},
  ratingMain: {
    marginTop: pxToDp(40),
  },
  ratingContent: {
    padding: pxToDp(30),
    backgroundColor: '#20222B',
    borderRadius: pxToDp(20),
    marginRight: pxToDp(30),
    width: pxToDp(440),
  },
  ratingContentEmpty: {
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontSize: pxToDp(24),
  },
  ratingContentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

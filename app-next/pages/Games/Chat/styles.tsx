import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    overflow: 'hidden',
  },
  NavBarMore: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: pxToDp(20),
  },
  NavBarMoreIcon: {
    height: pxToDp(60),
    width: pxToDp(60),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: pxToDp(10),
  },
});

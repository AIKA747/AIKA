import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  content: {
    paddingVertical: pxToDp(20),
    paddingHorizontal: pxToDp(40),
  },
  contentText: {
    color: '#fff',
    fontSize: pxToDp(32),
    marginBottom: pxToDp(20),
  },
  ratingSelect: {
    marginBottom: pxToDp(40),
  },

  contentInput: {
    color: '#fff',
    fontSize: pxToDp(30),
    padding: pxToDp(28),
    borderRadius: pxToDp(20),
    minHeight: pxToDp(200),

    borderWidth: pxToDp(2),
    borderColor: '#51555B',
    backgroundColor: '#1B1B22',

    textAlignVertical: 'top',
  },
  contentButton: {
    // width: pxToDp(400),
    // height: pxToDp(80),
    borderRadius: pxToDp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentButtonText: {
    color: '#fff',
    fontSize: pxToDp(32),
  },
});

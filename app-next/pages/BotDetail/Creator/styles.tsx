import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  creator: {
    marginTop: pxToDp(40),
    padding: pxToDp(30),
    backgroundColor: '#1a1b22',
  },

  creatorErrorText: {
    fontSize: pxToDp(32),
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
  },

  creatorTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorTopLeft: {
    flexDirection: 'row',
  },

  creatorTopLeftAvatar: {
    width: pxToDp(100),
    height: pxToDp(100),
    borderRadius: pxToDp(100),
  },

  creatorTopInfo: {
    marginLeft: pxToDp(22),

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorTopLeftInfoWarper: {
    alignItems: 'flex-start',
  },

  creatorTopLeftInfoName: {
    width: pxToDp(200),
    fontSize: pxToDp(32),
    color: '#fff',
  },
  creatorTopLeftInfoGender: {
    paddingTop: pxToDp(10),
    fontSize: pxToDp(32),
    color: '#fff',
  },

  creatorTopBots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorTopBotsText1: {
    fontSize: pxToDp(32),
    color: '#fff',
  },
  creatorTopBotsText2: {
    fontSize: pxToDp(32),
    color: '#fff',
    opacity: 0.7,
  },
});

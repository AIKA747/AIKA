import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    backgroundColor: '#262A32',
    flex: 1,
  },
  container: {
    padding: pxToDp(30),
    paddingTop: pxToDp(50),
    paddingBottom: pxToDp(200),
  },
  botDetailTop: {
    flexDirection: 'row',
    gap: pxToDp(24),
  },
  botDetailAvatar: {
    width: pxToDp(230),
    height: pxToDp(230),
  },
  botDetailScore: {
    marginTop: pxToDp(20),
  },
  botDetailScoreTitle: {
    fontSize: pxToDp(32),
    color: '#fff',
    marginBottom: pxToDp(20),
  },
  botDetailScoreText: {
    fontSize: pxToDp(66),
    fontFamily: 'ProductSansBold',
    color: '#A07BED',
  },
  botDetailName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botDetailNameLeftText: {
    color: '#fff',
    fontSize: pxToDp(36),
  },
  botDetailButtonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: pxToDp(20),
    paddingRight: pxToDp(20),
  },
  botDetailTitle: {
    fontSize: pxToDp(36),
    color: '#fff',
    marginTop: pxToDp(40),
  },
  botDetailIntro: {
    paddingTop: pxToDp(20),
    fontSize: pxToDp(28),
    lineHeight: pxToDp(46),
    color: '#fff',
    opacity: 0.5,
  },
  botDetailPersonality: {
    marginTop: pxToDp(20),
  },
  commentBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: pxToDp(42),
  },
});

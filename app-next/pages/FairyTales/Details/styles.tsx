import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
    flexGrow: 1,
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 20,
  },
  blurView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    pointerEvents: 'none',
  },
  info: {
    width: '100%',
    marginTop: pxToDp(32),
    paddingBottom: pxToDp(140),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoIntroduction: {
    width: '100%',
    color: '#fff',
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    marginBottom: pxToDp(32),
    paddingHorizontal: pxToDp(32),
  },
  coverWrap: {
    width: '100%',
  },
  continueBtnWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    paddingVertical: pxToDp(32),
    overflow: 'hidden',
  },
  continueBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: pxToDp(130),
    aspectRatio: 1,
    borderRadius: pxToDp(130),
    borderColor: '#A07BED',
    borderWidth: pxToDp(3),
    zIndex: 1,
  },
});

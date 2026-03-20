import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

import {
  ContainerHeight,
  ContainerPadding,
  LockSliderWidthRange,
  PressSliderHandleHeight,
  PressSliderMicHeight,
  PressSliderTopRange,
  PressSliderWidthRange,
} from './constants';

export default StyleSheet.create({
  container: {
    paddingHorizontal: ContainerPadding,
    paddingBottom: pxToDp(16),
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },

  connection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: pxToDp(40),
  },
  connectionText: {
    fontSize: pxToDp(32),
    color: '#fff',
    paddingRight: pxToDp(10),
  },

  timingContainer: {
    position: 'absolute',
    top: -pxToDp(500),
    left: pxToDp(30), // container paddingHorizontal
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timing: {
    height: pxToDp(200),
    width: pxToDp(400),
    backgroundColor: '#262A32',
    borderRadius: pxToDp(20),

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timingText: {
    fontSize: pxToDp(32),
    lineHeight: pxToDp(50),
    color: '#fff',
  },
  timingDot: {
    marginLeft: pxToDp(10),
  },

  textAndVoice: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',

    backgroundColor: '#fff',
    borderRadius: pxToDp(40),
  },
  textInput: {
    borderRadius: pxToDp(40),
    // backgroundColor: 'red',
    flex: 1,
    textAlignVertical: 'center',
    fontSize: pxToDp(28),
    lineHeight: pxToDp(36),
    paddingVertical: pxToDp(20),
    paddingLeft: pxToDp(30),
    // marginLeft: pxToDp(30),
  },

  voiceInput: {
    height: pxToDp(80),
    width: pxToDp(80),
    borderRadius: pxToDp(60),
    marginLeft: pxToDp(16),

    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceInputIcon: {
    // backgroundColor: 'red',
  },

  // voiceInputPress
  voiceInputPress: {
    flex: 1,
    height: ContainerHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: pxToDp(40),
  },
  voiceInputPressSend: {
    height: pxToDp(60),
    width: pxToDp(60),
    borderRadius: pxToDp(60),
    backgroundColor: '#000',
    marginVertical: pxToDp(10),

    marginHorizontal: pxToDp(10),

    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    right: 0,
  },
  voiceInputPressSendIcon: {},
  voiceInputPressSlider: {
    position: 'absolute',
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#262A32',
    borderRadius: pxToDp(60),

    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: pxToDp(20),
  },
  voiceInputPressSliderIcon: {},
  voiceInputPressSliderText: {
    flex: 1,
    color: 'rgba(255, 255, 255, .5)',
    fontSize: pxToDp(30),
    lineHeight: pxToDp(40),
    paddingLeft: pxToDp(10),
    textAlign: 'left',
  },
  voiceInputPressHandle: {
    height: PressSliderHandleHeight,
    width: ContainerHeight,
    paddingTop: pxToDp(15),

    position: 'absolute',
    left: `${PressSliderWidthRange[1] * 100}%`,
    bottom: 0,
    transform: [
      {
        translateX: -pxToDp(80),
      },
      // {
      //   translateY: -pxToDp(100),
      // },
    ],

    borderRadius: ContainerHeight,

    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  voiceInputPressMic: {
    height: PressSliderMicHeight,
    width: PressSliderMicHeight,

    position: 'absolute',
    top: PressSliderTopRange[1],
    left: `${PressSliderWidthRange[1] * 100}%`,
    transform: [{ translateX: -PressSliderMicHeight }, { translateY: -PressSliderMicHeight / 2 }],

    borderRadius: PressSliderMicHeight,
    // TODO 渐变
    backgroundColor: '#7278CB',

    justifyContent: 'center',
    alignItems: 'center',
  },

  // voiceInputLock
  voiceInputLock: {
    flex: 1,
    height: ContainerHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: pxToDp(40),
  },
  voiceInputLockText: {
    flex: 1,
    color: 'rgba(255, 255, 255, .5)',
    fontSize: pxToDp(30),
    lineHeight: pxToDp(40),
    paddingLeft: `${LockSliderWidthRange[0] * 100}%`,
    textAlign: 'center',
  },
  voiceInputLockSend: {
    height: pxToDp(60),
    width: pxToDp(60),
    borderRadius: pxToDp(60),
    backgroundColor: '#000',
    marginVertical: pxToDp(10),

    marginHorizontal: pxToDp(10),

    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceInputLockSendIcon: {},
  voiceInputLockSlider: {
    position: 'absolute',
    left: 0,
    height: '100%',
    width: `${LockSliderWidthRange[0] * 100}%`,
    backgroundColor: '#262A32',
    borderRadius: pxToDp(60),

    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: pxToDp(20),
  },
  voiceInputLockSliderIcon: {},
  voiceInputLockSliderText: {
    paddingLeft: pxToDp(10),
    color: '#fff',
    fontSize: pxToDp(28),
  },

  buttons: {
    flexDirection: 'row',
  },
  buttonItem: {
    marginLeft: pxToDp(20),

    height: pxToDp(70),
    borderColor: '#BAAED8',
    // borderWidth: pxToDp(2),
    borderRadius: pxToDp(8),

    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#262A32',
    textAlign: 'center',
    paddingHorizontal: pxToDp(22),
    fontSize: pxToDp(32),
    fontFamily: 'ProductSansBold',
  },

  buttonIcon: {
    // marginLeft: pxToDp(16),
    height: pxToDp(48),
    width: pxToDp(48),
  },

  replyMsgBox: {
    marginHorizontal: pxToDp(32),
    marginBottom: pxToDp(16),
    borderRadius: pxToDp(16),
    flexDirection: 'row',
    minHeight: pxToDp(84),
    alignItems: 'center',
  },
  replyMsgBoxNickname: {
    fontSize: pxToDp(26),
    color: '#fff',
  },
  line: {
    width: pxToDp(8),
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: pxToDp(4),
    marginRight: pxToDp(16),
  },
});

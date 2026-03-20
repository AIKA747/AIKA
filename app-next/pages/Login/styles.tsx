import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    paddingHorizontal: pxToDp(32),
  },
  title: {
    paddingTop: pxToDp(58 * 2),
  },
  form: {
    marginTop: pxToDp(32),
  },
  formError: {
    marginTop: pxToDp(10),
  },
  formErrorText: {
    fontSize: pxToDp(24),
    color: '#FF3141',
  },

  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: pxToDp(14 * 2),
    paddingHorizontal: pxToDp(16 * 2),
    height: pxToDp(56 * 2),
  },

  formItemClear: {
    position: 'absolute',
    top: '50%',
    right: pxToDp(22),
    width: pxToDp(44),
    height: pxToDp(44),
    borderRadius: pxToDp(44),
    transform: [
      {
        translateY: -pxToDp(22),
      },
    ],
    backgroundColor: '#9BA1A8',

    justifyContent: 'center',
    alignItems: 'center',
  },
  formItemInput: {
    fontSize: pxToDp(16 * 2),
    lineHeight: undefined,
    flex: 1,
    height: '100%',
  },
  formItemInputError: {
    borderColor: '#FF3141',
    borderWidth: pxToDp(2),
  },

  gap: {
    position: 'relative',
    marginTop: pxToDp(60),
  },
  gapText: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    fontSize: pxToDp(32),
    lineHeight: pxToDp(32),

    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(16),
    transform: [
      {
        translateY: -pxToDp(26),
      },
      {
        translateX: -pxToDp(60),
      },
    ],
  },

  thirdLogin: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: pxToDp(60),
    gap: pxToDp(32),
  },
  thirdLoginItem: {
    width: pxToDp(40),
    height: pxToDp(40),
    marginRight: pxToDp(5 * 2),
  },

  formPolicy: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  formPolicyIcon: {
    height: pxToDp(44),
    width: pxToDp(44),
    borderRadius: pxToDp(44),
    borderWidth: pxToDp(2),
    marginRight: pxToDp(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formPolicyText: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(32),
    textAlign: 'left',
    flex: 1,
  },
  formPolicyTextImportant: {
    color: '#301190',
  },

  button: {
    marginTop: pxToDp(90),
  },

  loginItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: pxToDp(46 * 2),
    flex: 1,
    borderWidth: pxToDp(1),
    borderRadius: pxToDp(14 * 2),
  },
});

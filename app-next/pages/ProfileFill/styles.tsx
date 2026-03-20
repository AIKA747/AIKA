import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: pxToDp(32),
  },
  title: {
    fontSize: pxToDp(36),
  },

  /**表单 开始 */
  form: {
    // padding: pxToDp(Size.padding),
    paddingTop: pxToDp(30 * 2),
  },
  formErrorTips: {
    fontSize: pxToDp(28),
    color: '#FF9F59',
    paddingBottom: pxToDp(30),
  },
  formItem: {
    marginBottom: pxToDp(60),
  },
  formItemLabel: {
    fontSize: pxToDp(32),
    fontFamily: 'ProductSansBold',
    paddingBottom: pxToDp(16),
  },
  formItemTips: {
    color: '#000',
    opacity: 0.6,
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    paddingTop: pxToDp(32),
  },
  formItemInput: {
    height: pxToDp(112),
    fontSize: pxToDp(32),
    paddingVertical: pxToDp(16),
    paddingHorizontal: pxToDp(25),
    borderRadius: pxToDp(100),
    borderWidth: pxToDp(2),
  },
  formItemCheckbox: {
    paddingTop: pxToDp(32),
  },
  formItemImagePicker: {
    paddingTop: pxToDp(32),
  },

  formItemEye: {
    position: 'absolute',
    right: pxToDp(25),
    top: pxToDp(30),
    width: pxToDp(44),
    height: pxToDp(44),
  },
  /**表单 结束 */

  tips: {
    color: '#000',
    opacity: 0.8,
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    marginTop: pxToDp(30),
  },
  buttons: {
    marginTop: pxToDp(40),
  },
});

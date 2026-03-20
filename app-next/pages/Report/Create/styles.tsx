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
    paddingBottom: pxToDp(15),
    fontSize: pxToDp(32),
    lineHeight: pxToDp(40),
    fontFamily: 'ProductSansBold',
    opacity: 0.9,
  },
  tips: {
    paddingBottom: pxToDp(15),
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    opacity: 0.7,
  },

  /**表单 开始 */
  form: {
    // padding: pxToDp(Size.padding),
    // paddingTop: pxToDp(Size.padding * 1),
  },
  formErrorTips: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(32),
    color: '#FF9F59',
    marginTop: pxToDp(16),
  },
  formItem: {
    // marginVertical: pxToDp(30),
  },
  formItemGap: {
    justifyContent: 'space-between',
    alignContent: 'center',

    flexDirection: 'row',
  },

  formItemLabel: {
    fontSize: pxToDp(32),
    lineHeight: pxToDp(40),
    fontFamily: 'ProductSansBold',
    marginTop: pxToDp(32),
  },
  formItemTips: {
    flex: 1,
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    paddingTop: pxToDp(32),
  },
  formItemInput: {
    fontSize: pxToDp(32),
    marginTop: pxToDp(32),
    borderRadius: pxToDp(100),
    paddingVertical: pxToDp(32),
    paddingHorizontal: pxToDp(32),
  },

  formItemMultilineInput: {
    padding: pxToDp(28),
    minHeight: pxToDp(200),

    textAlignVertical: 'top',

    fontSize: pxToDp(32),
    marginTop: pxToDp(32),
    borderRadius: pxToDp(28),
    paddingVertical: pxToDp(32),
    paddingHorizontal: pxToDp(32),
  },

  formItemAgree: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  formItemCheckbox: {
    marginRight: pxToDp(20),
  },
  formItemCheckboxItem: {
    borderRadius: pxToDp(50),
  },

  formItemPicker: {
    paddingTop: pxToDp(32),
    lineHeight: pxToDp(40),
  },
  formItemSlider: {
    paddingTop: pxToDp(32),
  },
  formItemImagePicker: {
    paddingTop: pxToDp(32),
  },

  formPolicy: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    // paddingTop: pxToDp(30),
    // backgroundColor: 'red',
    textAlignVertical: 'center',
  },

  formItemEye: {
    position: 'absolute',
    right: pxToDp(25),
    top: pxToDp(30),
    width: pxToDp(44),
    height: pxToDp(44),
  },
  /**表单 结束 */

  buttons: {
    marginTop: pxToDp(40),
  },
});

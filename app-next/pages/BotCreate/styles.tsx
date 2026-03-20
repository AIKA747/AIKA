import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    backgroundColor: '#262A32',
    flex: 1,
  },
  container: {
    flex: 1,
    padding: pxToDp(32),
  },

  visibled: {
    backgroundColor: '#4C455E',
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'flex-start',

    paddingVertical: pxToDp(32),
    paddingHorizontal: pxToDp(20),
    borderRadius: pxToDp(20),
  },
  visibledSwitch: {
    marginRight: pxToDp(20),
  },
  visibledText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    color: '#fff',
    flex: 1,
  },

  /**表单 开始 */
  form: {
    // padding: pxToDp(Size.padding),
    paddingTop: pxToDp(30),
  },
  formErrorTips: {
    fontSize: pxToDp(28),
    color: '#FF9F59',
  },
  formItem: {
    marginVertical: pxToDp(30),
  },
  formItemGap: {
    justifyContent: 'space-between',
    alignContent: 'center',

    flexDirection: 'row',
  },
  formItemGapText: {
    color: '#FFF',
    fontSize: pxToDp(36),
    fontFamily: 'ProductSansBold',
    paddingVertical: pxToDp(36),
  },

  formItemLabel: {
    fontSize: pxToDp(32),
    color: '#FFF',
  },
  formItemTips: {
    color: '#FFF',
    opacity: 0.6,
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    paddingTop: pxToDp(32),
  },
  formItemInput: {
    color: '#fff',
    fontSize: pxToDp(32),
    marginTop: pxToDp(32),

    paddingBottom: pxToDp(20),

    borderBottomWidth: pxToDp(2),
    borderColor: '#51555B',
  },

  formItemMultilineInput: {
    color: '#fff',
    fontSize: pxToDp(28),
    marginTop: pxToDp(32),
    padding: pxToDp(28),
    borderRadius: pxToDp(20),
    minHeight: pxToDp(200),

    borderWidth: pxToDp(2),
    borderColor: '#51555B',
    backgroundColor: '#1B1D26',

    textAlignVertical: 'top',
  },
  formItemsLineInput: {
    color: '#fff',
    fontSize: pxToDp(28),
    marginTop: pxToDp(32),
    padding: pxToDp(28),
    borderRadius: pxToDp(20),

    borderWidth: pxToDp(2),
    borderColor: '#51555B',
    backgroundColor: '#1B1D26',

    textAlignVertical: 'top',
  },

  formItemCheckbox: {
    paddingTop: pxToDp(32),
  },
  formItemCheckboxItem: {
    borderRadius: pxToDp(50),
  },
  formItemCheckboxRules: {
    marginTop: pxToDp(32),
    padding: pxToDp(16),
    backgroundColor: '#1B1D26',
    borderRadius: pxToDp(20),
  },
  formItemPicker: {
    paddingTop: pxToDp(32),
  },
  formItemSlider: {
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

  buttons: {
    marginTop: pxToDp(40),
  },
});

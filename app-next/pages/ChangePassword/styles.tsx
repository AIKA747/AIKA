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
    color: '#FFF',
    fontSize: pxToDp(36),
  },

  /**表单 开始 */
  form: {
    paddingTop: pxToDp(30),
  },
  formErrorTips: {
    fontSize: pxToDp(28),
    color: '#FF9F59',
  },
  formItem: {
    borderBottomWidth: pxToDp(2),
    borderColor: '#51555B',
  },
  formItemInput: {
    color: '#fff',
    fontSize: pxToDp(32),
    paddingVertical: pxToDp(25),
    paddingHorizontal: pxToDp(16),
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
    color: '#FFF',
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    marginTop: pxToDp(30),
  },
  tipsImportant: {
    color: '#ECA2FF',
  },
  buttons: {
    marginTop: pxToDp(90),
  },
});

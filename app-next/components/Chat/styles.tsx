import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',

    paddingHorizontal: pxToDp(27),
    // paddingVertical: pxToDp(16),
    // backgroundColor: 'blue',
  },
  messages: {
    paddingHorizontal: pxToDp(27),
    paddingVertical: pxToDp(16),
    // backgroundColor: 'red',
    flex: 1,
  },
});

export const messagesStylesLeft = StyleSheet.create({
  messagesItem: {
    marginVertical: pxToDp(24),
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageSystemMonth: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageSystemMonthInner: {
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(12),
  },
  messageSystemMonthText: {
    textAlign: 'center',
    fontSize: pxToDp(24),
    color: '#80878E',
    paddingVertical: pxToDp(5),
    paddingHorizontal: pxToDp(20),
  },
  messagesContentComponentTime: {
    marginTop: pxToDp(8),
  },
  messagesContentComponentTimeText: {
    textAlign: 'left',
    fontSize: pxToDp(22),
    color: '#000000',
  },

  messageSystemTips: {
    marginVertical: pxToDp(16),
    textAlign: 'center',
    color: '#A498C1',
  },
  messageSystemTipsImportant: {
    color: '#FFD426',
  },
  // messagesAvatar: {
  //   height: pxToDp(66),
  //   width: pxToDp(66),
  //   borderRadius: pxToDp(66),
  //   backgroundColor: '#000',
  //   marginRight: pxToDp(24),
  // },
  groupAvatar: {
    width: pxToDp(68),
    height: pxToDp(68),
    borderRadius: pxToDp(16),
    marginRight: pxToDp(8),
  },
  messagesAvatar: {
    height: pxToDp(80),
    width: pxToDp(80),
    marginRight: pxToDp(24),
    borderRadius: pxToDp(80),
  },
  messagesContent: {
    width: '100%', // 根据有无avatar判断
    alignItems: 'flex-start', // 根据左右位置判断
    // backgroundColor: 'red',
  },
  messagesContentComponent: {
    // maxWidth: '80%', // 弃用这里，用父容器宽度做限制
    minWidth: '8%', //  文本内容太短时会遮挡操作按钮
    // backgroundColor: 'blue',
  },
  messagesContentHandle: {
    position: 'absolute',
    right: 0,
    top: -pxToDp(50),

    display: 'none', // TODO 暂时屏蔽

    flexDirection: 'row',
  },
  messagesContentHandleIcon: {
    padding: pxToDp(10),
    marginRight: pxToDp(10),
  },

  messagesContentStatus: {
    position: 'absolute',
    right: -pxToDp(50),
    top: 0,

    // backgroundColor: 'red',
    height: pxToDp(50),
    width: pxToDp(50),

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const messagesStylesRight = StyleSheet.create({
  messagesItem: {
    ...messagesStylesLeft.messagesItem,
    justifyContent: 'flex-end',
  },
  messageSystemMonth: {
    ...messagesStylesLeft.messageSystemMonth,
  },
  messageSystemMonthInner: {
    ...messagesStylesLeft.messageSystemMonthInner,
  },
  messageSystemMonthText: {
    ...messagesStylesLeft.messageSystemMonthText,
  },
  messagesContentComponentTime: {
    ...messagesStylesLeft.messagesContentComponentTime,
  },
  messagesContentComponentTimeText: {
    ...messagesStylesLeft.messagesContentComponentTimeText,
    textAlign: 'right',
  },
  groupAvatar: { ...messagesStylesLeft.groupAvatar },
  messageSystemTips: {
    ...messagesStylesLeft.messageSystemTips,
  },
  messageSystemTipsImportant: {
    ...messagesStylesLeft.messageSystemTipsImportant,
  },
  messagesAvatar: {
    ...messagesStylesLeft.messagesAvatar,
  },
  messagesContent: {
    ...messagesStylesLeft.messagesContent,
    paddingLeft: 0,
    // paddingRight: pxToDp(33),
  },
  messagesContentComponent: {
    ...messagesStylesLeft.messagesContentComponent,
  },
  messagesContentHandle: {
    ...messagesStylesLeft.messagesContentHandle,
    right: null,
    left: 0,
  },
  messagesContentHandleIcon: {
    ...messagesStylesLeft.messagesContentHandleIcon,
    marginRight: 0,
    marginLeft: pxToDp(10),
  },

  messagesContentStatus: {
    ...messagesStylesLeft.messagesContentStatus,
    right: null,
    left: -pxToDp(50),
    top: 0,
  },
});

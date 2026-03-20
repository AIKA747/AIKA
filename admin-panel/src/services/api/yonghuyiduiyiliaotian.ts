// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 用户聊天 GET /bot/app/chatroom/user/chat */
export async function getBotAppChatroomUserChat(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatroomUserChatParams,
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: number }>(
    '/bot/app/chatroom/user/chat',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

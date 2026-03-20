// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 删除会话 DELETE /bot/app/chat/bot/${param0} */
export async function deleteBotAppChatBotId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotAppChatBotIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(
    `/bot/app/chat/bot/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 删除消息 DELETE /bot/app/chat/msg/${param0} */
export async function deleteBotAppChatMsgMsgId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotAppChatMsgMsgIdParams,
  options?: { [key: string]: any },
) {
  const { msgId: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string[] }>(
    `/bot/app/chat/msg/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 会话记录 该接口排序，按照消息记录的时间，越新越靠前 进行排序

查询当前登录用户与传入的botId之间的聊天记录 GET /bot/app/chat/records */
export async function getBotAppChatRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatRecordsParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      total: number;
      pageNum: number;
      pageSize: number;
      pages: number;
      list: {
        objectId: string;
        contentType: string;
        json?: string;
        media?: string;
        textContent?: string;
        sourceType: string;
        userId: string;
        msgStatus: string;
        readFlag: boolean;
        readTime: string;
        replyMessageId: string;
        createdAt: string;
        msgId: string;
        fileProperty: string;
        videoUrl: string;
        videoStatus: string;
        digitHuman: boolean;
        badAnswer: boolean;
        gameStatus: string;
      }[];
    };
  }>('/bot/app/chat/records', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 会话列表 GET /bot/app/chats */
export async function getBotAppChats(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatsParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      total: number;
      pageNum: number;
      pageSize: number;
      pages: number;
      list: {
        botId: string;
        botName: string;
        dialogues: number;
        botAvatar: string;
        creatorName: string;
        creator: string;
        selfCreation: boolean;
        botStatus: string;
        lastMessageAt: string;
        lastReadAt: string;
        botSource: string;
        subscribed: boolean;
        userId: string;
        botIntroduce: string;
      }[];
    };
  }>('/bot/app/chats', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 机器人举报 POST /bot/app/bot/report */
export async function postBotAppBotReport(
  body: {
    /** 机器人id */
    botId: string;
    behavior: string;
    content: string;
    details: string;
    /** 图片集合 */
    images: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/bot/report',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 聊天内容举报 POST /bot/app/chat/message/feedback */
export async function postBotAppChatMessageFeedback(
  body: {
    /** assistant, bot, story */
    chatModule: string;
    /** 消息id */
    msgId: string;
    /** 消息内容 */
    msgContent: string;
    /** 内容反馈 */
    feedback: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chat/message/feedback',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

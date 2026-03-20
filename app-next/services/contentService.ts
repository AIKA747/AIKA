// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 获得当前章节的礼物 GET /content/app/gift */
export async function getContentAppGift(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppGiftParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      code: number;
      msg: string;
      total: number;
      pageNum: number;
      pageSize: number;
      pages: number;
      list: { id?: string; giftName?: string; image?: string }[];
    };
  }>('/content/app/gift', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 铭感内容检查 POST /content/app/moderation */
export async function postContentAppModeration(
  body: { type: string; content: string }[],
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: { flagged: boolean; categories: string[] } }>(
    '/content/app/moderation',
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

/** 开始一个新的故事对话 删除原来的故事会话记录，重新开始对话 POST /content/app/story-recorder */
export async function postContentAppStoryRecorder(
  body: {
    storyId: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: API.ChapterPassDto }>('/content/app/story-recorder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 故事聊天的消息记录 该接口排序，按照消息记录的时间，越新越靠前 进行排序

查询当前登录用户与传入的botId之间的聊天记录 GET /content/app/story/chat-record */
export async function getContentAppStoryChatRecord(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppStoryChatRecordParams,
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
        storyRecorderId: string;
        chapterId: string;
        username: string;
      }[];
    };
  }>('/content/app/story/chat-record', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

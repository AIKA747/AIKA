// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 获取助手信息 GET /bot/app/assistant */
export async function getBotAppAssistant(options?: { [key: string]: any }) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      maleAvatar: string;
      femaleAvatar: string;
      greetWords: string;
      age: number;
      profession: string;
      botCharacter: string;
      personalStrength: string;
      answerStrategy: string[];
      botRecommendStrategy: string;
      storyRecommendStrategy: string;
      rules: { key: string; rule: { question: string; answer: string; weight: string } }[];
      salutationPrompts: string;
      salutationFrequency: number;
      prompts: string;
      digitaHumanService: string[];
      createdAt: string;
      updatedAt: string;
      userSettingGender: string;
      maleGreetVideo: string;
      femaleGreetVideo: string;
      maleIdleVideo: string;
      femaleIdleVideo: string;
    };
  }>('/bot/app/assistant', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 与助手聊天的消息记录 该接口排序，按照消息记录的时间，越新越靠前 进行排序

查询当前登录用户与传入的botId之间的聊天记录 GET /bot/app/assistant/chat-record */
export async function getBotAppAssistantChatRecord(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppAssistantChatRecordParams,
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
  }>('/bot/app/assistant/chat-record', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 标记机器人回复消息为bad PUT /bot/app/assistant/chat-record/bad */
export async function putBotAppAssistantChatRecordBad(
  body: {
    /** 消息id */
    msgId: string;
    /** 是否为badAnswer */
    badAnswer: boolean;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/bot/app/assistant/chat-record/bad', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 助手性别设置 POST /bot/app/assistant/gender */
export async function postBotAppAssistantGender(
  body: {
    /** 助手id */
    assistantId: string;
    /** 性别 */
    gender: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/bot/app/assistant/gender', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取助手预加载信息 GET /bot/public/assistant */
export async function getBotPublicAssistant(options?: { [key: string]: any }) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      maleAvatar: string;
      femaleAvatar: string;
      greetWords: string;
      age: number;
      profession: string;
      botCharacter: string;
      personalStrength: string;
      answerStrategy: string[];
      botRecommendStrategy: string;
      storyRecommendStrategy: string;
      rules: { key: string; rule: { question: string; answer: string; weight: string } }[];
      salutationPrompts: string;
      salutationFrequency: number;
      prompts: string;
      digitaHumanService: string[];
      createdAt: string;
      updatedAt: string;
      maleGreetVideo: string;
      femaleGreetVideo: string;
      maleIdleVideo: string;
      femaleIdleVideo: string;
    };
  }>('/bot/public/assistant', {
    method: 'GET',
    ...(options || {}),
  });
}

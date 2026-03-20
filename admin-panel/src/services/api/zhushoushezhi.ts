// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取助手配置 GET /bot/manage/assistant */
export async function getBotManageAssistant(options?: { [key: string]: any }) {
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
      rules: {
        key: string;
        rule: { question: string; answer: string; weight: string };
      }[];
      salutationPrompts: string;
      salutationFrequency: number;
      prompts: string;
      digitaHumanService: string[];
      createdAt: string;
      updatedAt: string;
      dataVersion: number;
      deleted: boolean;
    };
  }>('/bot/manage/assistant', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 编辑助手 不管是否传入id，都直接查询助手配置，有则修改，无则新增
即数据库表中的数据最多一条 POST /bot/manage/assistant */
export async function postBotManageAssistant(
  body: {
    id?: string;
    /** 助手男性头像 */
    maleAvatar: string;
    /** 助手女性头像 */
    femaleAvatar: string;
    /** 欢迎语 */
    greetWords: string;
    /** 年龄 */
    age: number;
    /** 职业 */
    profession: string;
    /** 机器人扮演的角色 */
    botCharacter: string;
    /** 擅长领域 */
    personalStrength: string;
    /** 回答策略 */
    answerStrategy: string[];
    /** 机器人推荐策略 */
    botRecommendStrategy: string;
    /** 故事推荐策略 */
    storyRecommendStrategy: string;
    /** 回答策略集合 */
    rules: {
      key: string;
      rule: { question: string; answer: string; weight: string };
    }[];
    /** 预留字段（许久没有聊天，机器人主动打招呼prompt） */
    salutationPrompts?: string;
    /** 打招呼的频率（单位：天）；距离最后一次会话消息多长时间机器人主动给用户发送消息打招呼 */
    salutationFrequency?: number;
    prompts: string;
    /** 支持的数字人配置 */
    digitaHumanService: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: number }>(
    '/bot/manage/assistant',
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

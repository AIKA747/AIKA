// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建机器人 POST /bot/manage/bot */
export async function postBotManageBot(
  body: {
    /** 是否公开机器人 */
    visibled: string;
    /** 机器人名称 */
    botName: string;
    /** 头像 */
    avatar: string;
    /** 性别：1男，2女 */
    gender: number;
    /** 机器人介绍 */
    botIntroduce: string;
    /** 年龄 */
    age: number;
    /** 分类（栏目）id */
    categoryId: string;
    /** 分类（栏目）名称 */
    categoryName: string;
    /** 特点 */
    botCharacter: string;
    /** 职业 */
    profession: string;
    /** 个人实力 */
    personalStrength: string;
    /** 回答风格 */
    conversationStyle: string;
    /** 回答策略id集合 */
    rules: string[];
    prompts?: string;
    knowledgeEnable?: string;
    /** 学习文件路径集合 */
    knowledges?: string[];
    /** 支持模型 */
    supportedModels?: string[];
    album?: string[];
    tags?: string;
    greetWords?: string;
    salutationFrequency?: number;
    salutationPrompts?: string;
    /** 聊天提示语 */
    dialogueTemplates: string[];
    /** 发帖频率 */
    postingFrequecy: string;
    /** 发帖prompt */
    postingPrompt: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: { id: number } }>(
    '/bot/manage/bot',
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

/** 机器人详情 GET /bot/manage/bot/${param0} */
export async function getBotManageBotId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageBotIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      creator: string;
      creatorName: string;
      botSource: string;
      botName: string;
      botIntroduce: string;
      avatar: string;
      gender: 'male' | 'female';
      age: number;
      profession: string;
      personality: string;
      botCharacter: string;
      personalStrength: string;
      conversationStyle: string;
      rules: string[];
      prompts: string;
      knowledgeEnable: boolean;
      knowledges: string[];
      supportedModels: string[];
      botStatus: string;
      visibled: boolean;
      rating: number;
      chatTotal: number;
      subscriberTotal: number;
      dialogues: number;
      recommend: boolean;
      sortNo: number;
      recommendImage: string;
      recommendWords: string;
      updatedAt: string;
      subscribed: boolean;
      commented: boolean;
      hasUpdated: boolean;
      dialogueTemplates: string[];
      cover: string;
      category: 'all' | 'open' | 'closed';
      greetWords: string;
      frequency: number;
      solutionPrompts: string;
      models: ('A' | 'B')[];
      album: string;
      tags: string;
      salutationFrequency: number;
      salutationPrompts: string;
    };
  }>(`/bot/manage/bot/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 编辑机器人 PUT /bot/manage/bot/${param0} */
export async function putBotManageBotId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putBotManageBotIdParams,
  body: {
    /** 是否公开机器人 */
    visibled: boolean;
    /** 机器人名称 */
    botName: string;
    /** 头像 */
    avatar: string;
    /** 性别：1男，2女 */
    gender: string;
    /** 机器人介绍 */
    botIntroduce: string;
    /** 年龄 */
    age: number;
    /** 分类（栏目）id */
    categoryId?: string;
    /** 分类（栏目）名称 */
    categoryName?: string;
    /** 特点 */
    botCharacter: string;
    /** 职业 */
    profession: string;
    /** 个人实力 */
    personalStrength: string;
    /** 回答风格 */
    conversationStyle: string;
    /** 回答策略id集合 */
    rules: string[];
    prompts?: string;
    knowledgeEnable?: string;
    /** 学习文件路径集合 */
    knowledges?: string[];
    /** 支持模型 */
    supportedModels?: string[];
    /** 数字人配置 */
    digitalHumanProfile?: {
      id: number;
      profileType: string;
      objectId: string;
      gender: string;
      sourceImage: string;
      expression: string;
      intensity: number;
      language?: { language: string; voice: string }[];
      greetVideoId: string;
      greetVideo: string;
      idleVideoId: string;
      idleVideo: string;
      voiceName: string;
    };
    /** 相册 */
    album?: string[];
    tags?: string;
    greetWords?: string;
    salutationFrequency?: number;
    salutationPrompts?: string;
    /** 聊天提示语 */
    dialogueTemplates: string[];
    postingFrequecy?: string;
    postingPrompt?: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      creator: string;
      creatorName: string;
      botSource: string;
      botName: string;
      botIntroduce: string;
      avatar: string;
      gender: string;
      age: number;
      profession: string;
      personality: string;
      botCharacter: string;
      personalStrength: string;
      conversationStyle: string;
      rules: string[];
      prompts: string;
      knowledgeEnable: boolean;
      knowledges: string[];
      supportedModels: string[];
      album: string[];
      botStatus: string;
      visibled: boolean;
      rating: number;
      chatTotal: number;
      subscriberTotal: number;
      dialogues: number;
      recommend: boolean;
      sortNo: number;
      recommendImage: string;
      recommendWords: string;
      updatedAt: string;
      subscribed: boolean;
      commented: boolean;
      hasUpdated: boolean;
      dialogueTemplates: string[];
      cover: string;
      tags: string;
    };
  }>(`/bot/manage/bot/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除机器人 DELETE /bot/manage/bot/${param0} */
export async function deleteBotManageBotId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotManageBotIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(
    `/bot/manage/bot/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 机器人推荐详情 GET /bot/manage/bot/${param0}/recommend */
export async function getBotManageBotIdRecommend(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageBotIdRecommendParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      botName: string;
      botIntroduce: string;
      avatar: string;
      rating: number;
      chatTotal: number;
      subscriberTotal: number;
      dialogues: number;
      sortNo: number;
      recommendImage: string;
      recommendWords: string;
    };
  }>(`/bot/manage/bot/${param0}/recommend`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 取消推荐 PUT /bot/manage/bot/${param0}/unrecommend */
export async function putBotManageBotIdUnrecommend(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putBotManageBotIdUnrecommendParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<Record<string, any>>(`/bot/manage/bot/${param0}/unrecommend`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 机器人栏目列表 GET /bot/manage/bot/category */
export async function getBotManageBotCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageBotCategoryParams,
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
      list: { categoryId: number; categoryName: string }[];
    };
  }>('/bot/manage/bot/category', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 推荐列表 GET /bot/manage/bot/recommend */
export async function getBotManageBotRecommend(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageBotRecommendParams,
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
        botId?: number;
        botSource?: string;
        sortNo?: number;
        recommendImage?: string;
        recommendWords?: string;
        recommendTime?: string;
        rating?: number;
        botName: string;
      }[];
    };
  }>('/bot/manage/bot/recommend', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 推荐机器人 PUT /bot/manage/bot/recommend */
export async function putBotManageBotRecommend(
  body: {
    /** 机器人id */
    botId: number;
    /** 排序 */
    sortNo?: number;
    /** 推荐封面 */
    recommendImage: string;
    /** 推荐词 */
    recommendWords: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/bot/manage/bot/recommend', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 推荐排序 PUT /bot/manage/bot/recommend/sort */
export async function putBotManageBotRecommendSort(
  body: {
    /** 机器人id */
    botId: number;
    /** 推荐排序 */
    sortNo: number;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/bot/manage/bot/recommend/sort', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 上线/下线 PUT /bot/manage/bot/status */
export async function putBotManageBotStatus(
  body: {
    /** 机器人id */
    botId: number;
    /** 机器人状态：Online,Offline */
    botStatus: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ message: string; code: 1 | 0; data: Record<string, any> }>(
    '/bot/manage/bot/status',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 机器人列表 GET /bot/manage/bots */
export async function getBotManageBots(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageBotsParams,
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
        creatorName: string;
        creator: string;
        chatCount: string;
        botStatus: 'Online' | 'Offline';
        createdAt: string;
        categoryName: string;
        recommend: boolean;
      }[];
    };
  }>('/bot/manage/bots', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

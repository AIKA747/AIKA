// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 机器人详情（改） 增加Cover字段，返回当前用户选择的机器人封面。如果没有选择，返回机器人相册第一张作为封面。 GET /bot/app/bot/${param0} */
export async function getBotAppBotId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppBotIdParams,
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
      postingEnable: boolean;
      postingFrequecy: string;
      postingPrompt: string;
    };
  }>(`/bot/app/bot/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 机器人栏目列表（改） 机器人栏目在新版中为expert分类列表。在列表中加入了栏目分类的tags GET /bot/app/bot/category */
export async function getBotAppBotCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppBotCategoryParams,
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
      list: { id: number; cover: string; categoryName: string; introduction: string; tags: string[] }[];
    };
  }>('/bot/app/bot/category', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 机器人检索（改） GET /bot/app/explore-bots */
export async function getBotAppExploreBots(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppExploreBotsParams,
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
      tags: string[];
      list: {
        id: string;
        botName: string;
        botAvatar: string;
        userId: number;
        creator: number;
        creatorName: string;
        rating: number;
        subscriberTotal: number;
        gender: string;
        updatedAt: string;
        lastReadAt?: string;
        botStatus: string;
        chatTotal: number;
        recommendImage?: string;
        recommendWords?: string;
        botIntroduce?: string;
        album: string[];
        botSource: string;
        cover: string;
      }[];
    };
  }>('/bot/app/explore-bots', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 搜索关键词集合 GET /bot/app/keywords */
export async function getBotAppKeywords(options?: { [key: string]: any }) {
  return request<{ code: number; msg: string; data: string[] }>('/bot/app/keywords', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 我的机器人列表 GET /bot/app/my-bots */
export async function getBotAppMyBots(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppMyBotsParams,
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
        id: string;
        botName: string;
        botAvatar: string;
        userId: number;
        creator: number;
        creatorName: string;
        rating: number;
        subscriberTotal: number;
        gender: string;
        updatedAt: string;
        lastReadAt?: string;
        botStatus: string;
        chatTotal: number;
        dialogues: number;
      }[];
    };
  }>('/bot/app/my-bots', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询指定用户的机器人列表 GET /bot/app/owner-bots */
export async function getBotAppOwnerBots(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppOwnerBotsParams,
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
        id: string;
        botName: string;
        botAvatar: string;
        userId: number;
        creator: number;
        creatorName: string;
        rating: number;
        subscriberTotal: number;
        gender: string;
        updatedAt: string;
        lastReadAt?: string;
        botStatus: string;
        chatTotal: number;
        recommendImage?: string;
        recommendWords?: string;
        botIntroduce?: string;
        album: string[];
        botSource: string;
        cover: string;
      }[];
    };
  }>('/bot/app/owner-bots', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 推荐机器人列表 GET /bot/app/recommend-bots */
export async function getBotAppRecommendBots(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppRecommendBotsParams,
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
        id: string;
        botName: string;
        botAvatar: string;
        userId: number;
        creator: number;
        creatorName: string;
        rating: number;
        subscriberTotal: number;
        gender: string;
        updatedAt: string;
        lastReadAt?: string;
        botStatus: string;
        chatTotal: number;
        recommendImage?: string;
        recommendWords?: string;
        botIntroduce?: string;
        album: string[];
        botSource: string;
        cover: string;
      }[];
    };
  }>('/bot/app/recommend-bots', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 我订阅机器人列表 GET /bot/app/subscribed-bots */
export async function getBotAppSubscribedBots(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppSubscribedBotsParams,
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
        id: string;
        botName: string;
        botAvatar: string;
        userId: number;
        creator: number;
        creatorName: string;
        rating: number;
        subscriberTotal: number;
        gender: string;
        updatedAt: string;
        lastReadAt?: string;
        botStatus: string;
        chatTotal: number;
        recommendImage?: string;
        recommendWords?: string;
        botIntroduce?: string;
        album: string[];
        botSource: string;
        cover: string;
      }[];
    };
  }>('/bot/app/subscribed-bots', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

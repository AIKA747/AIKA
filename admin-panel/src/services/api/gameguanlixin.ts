// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 游戏列表 游戏列表 GET /bot/manage/game */
export async function getBotManageGame(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageGameParams,
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
        id: number;
        gameName: string;
        listCover: string;
        avatar: string;
        listDesc: string;
        orderNum: number;
        enable: boolean;
        free: boolean;
      }[];
    };
  }>('/bot/manage/game', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改游戏 PUT /bot/manage/game */
export async function putBotManageGame(
  body: {
    /** 主键id */
    id: number;
    /** 对应assistant的instructions参数 */
    instructions: string;
    /** 这个给用户看 */
    gameName: string;
    /** 这个告诉AI它扮演什么角色 */
    assistantName: string;
    /** 枚举：code_interpreter，file_search，function */
    tools?: string;
    /** 使用的模型 */
    model?: string;
    /** 在openai上创建的assistant的id */
    assistantId?: string;
    /** 给用户看的游戏介绍 */
    introduce: string;
    /** 列表封面的描述 */
    description: string;
    /** 问题 */
    questions: string[];
    /** 封面URL */
    cover: string;
    /** 列表封面URL */
    listCover: string;
    /** 头像图片URL */
    avatar: string;
    /** 知识文档url */
    knowledge?: string[];
    listDesc: string;
    /** 排序 */
    orderNum: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/bot/manage/game', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增游戏 POST /bot/manage/game */
export async function postBotManageGame(
  body: {
    /** 对应assistant的instructions参数 */
    instructions: string;
    /** 这个给用户看 */
    gameName: string;
    /** 这个告诉AI它扮演什么角色 */
    assistantName: string;
    /** 枚举：code_interpreter，file_search，function */
    tools?: string;
    /** 使用的模型，对应chatgpt的模型参数 */
    model?: string;
    /** 在openai上创建的assistant的id */
    assistantId?: string;
    /** 给用户看的游戏介绍 */
    introduce: string;
    /** 封面的描述 */
    description: string;
    /** 问题 */
    questions?: string[];
    /** 封面URL */
    cover: string;
    /** 封面URL */
    listCover: string;
    /** 封面URL */
    avatar: string;
    /** 知识文档url */
    knowledge?: string[];
    listDesc: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: number }>(
    '/bot/manage/game',
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

/** 游戏详情（新） GET /bot/manage/game/${param0} */
export async function getBotManageGameId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageGameIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: API.Game }>(
    `/bot/manage/game/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 删除游戏 DELETE /bot/manage/game/${param0} */
export async function deleteBotManageGameId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotManageGameIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/bot/manage/game/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 游戏的结果列表（新） GET /bot/manage/game/${param0}/game-result */
export async function getBotManageGameIdGameResult(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageGameIdGameResultParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: API.GameResult[] }>(
    `/bot/manage/game/${param0}/game-result`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 游戏下线/上线（新） PUT /bot/manage/game/enable */
export async function putBotManageGameEnable(
  body: {
    id: number;
    enable: boolean;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/bot/manage/game/enable', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改游戏结果 PUT /bot/manage/game/game-result */
export async function putBotManageGameGameResult(
  body: {},
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/bot/manage/game/game-result', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新建游戏结果（新） POST /bot/manage/game/game-result */
export async function postBotManageGameGameResult(
  body: {
    gameId: number;
    summary: string;
    /** 建议使用markdown语法 */
    description: string;
    /** 图片url */
    cover: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: { id: number } }>(
    '/bot/manage/game/game-result',
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

/** 删除游戏结果 DELETE /bot/manage/game/game-result/${param0} */
export async function deleteBotManageGameGameResultId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotManageGameGameResultIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/bot/manage/game/game-result/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 游戏训练 PUT /bot/manage/game/train */
export async function putBotManageGameTrain(
  body: {
    /** 游戏id */
    gameId?: string;
  },
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<{ code: number; msg: string; data: string }>(
    '/bot/manage/game/train',
    {
      method: 'PUT',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    },
  );
}

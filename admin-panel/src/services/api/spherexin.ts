// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 查看sphere上的快捷方式（新） GET /bot/app/sphere */
export async function getBotAppSphere(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppSphereParams,
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
      list: API.SphereDto[];
    };
  }>('/bot/app/sphere', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查看sphere上的快捷方式-不分页（新） GET /bot/app/sphere/all */
export async function getBotAppSphereAll(options?: { [key: string]: any }) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      type: string;
      avatar: string;
      collectionName: string;
      category?: string;
      categoryName?: string;
    }[];
  }>('/bot/app/sphere/all', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Sphere分类下的机器人列表（新） GET /bot/app/sphere/bot */
export async function getBotAppSphereBot(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppSphereBotParams,
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
      list: API.SphereBotDto[];
    };
  }>('/bot/app/sphere/bot', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 列出所有的sphere快捷方式（新） 列出分类 GET /bot/manage/sphere */
export async function getBotManageSphere(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageSphereParams,
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
      list: API.BotCollection[];
    };
  }>('/bot/manage/sphere', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改sphere快捷方式（新） PUT /bot/manage/sphere */
export async function putBotManageSphere(
  body: API.SphereVO,
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/bot/manage/sphere', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新建sphere快捷方式（新） POST /bot/manage/sphere */
export async function postBotManageSphere(
  body: {
    /** TALES、EXPERT、GAME、GROUP_CHAT */
    type: string;
    avatar: string;
    collectionName: string;
    /** 如果设置了分类，则此集合将关联到分类上去 */
    category?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: { id: number } }>(
    '/bot/manage/sphere',
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

/** 删除sphere快捷方式（新） 硬删除即可 DELETE /bot/manage/sphere/${param0} */
export async function deleteBotManageSphereId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotManageSphereIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/bot/manage/sphere/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** shpere下的AI列表（新） GET /bot/manage/sphere/bot */
export async function getBotManageSphereBot(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageSphereBotParams,
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
      list: API.SphereBotDto[];
    };
  }>('/bot/manage/sphere/bot', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建Sphere分类下的AI（新） POST /bot/manage/sphere/bot */
export async function postBotManageSphereBot(
  body: {
    botId: number;
    /** 枚举：TALES、EXPERT、GAME */
    type: string;
    collectionId: number;
    name: string;
    listCover: string;
    description: string;
    avatar: string;
    listCoverDark: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data?: { id?: number } }>(
    '/bot/manage/sphere/bot',
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

/** 删除sphere分类下的机器人（新） DELETE /bot/manage/sphere/bot/${param0} */
export async function deleteBotManageSphereBotId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotManageSphereBotIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/bot/manage/sphere/bot/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

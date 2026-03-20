// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 机器人类型（栏目）管理列表（改） GET /bot/manage/category */
export async function getBotManageCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageCategoryParams,
  options?: { [key: string]: any },
) {
  return request<{
    total: number;
    pageNum: number;
    pageSize: number;
    pages: number;
    list: {
      categoryId: string;
      categoryName: string;
      sortNo: number;
      botCount: number;
      createdAt: string;
      builtIn: boolean;
      introduction: string;
      cover: string;
      tags: string[];
    }[];
  }>('/bot/manage/category', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 编辑机器人类型（栏目）（改） PUT /bot/manage/category */
export async function putBotManageCategory(
  body: {
    /** 类型id */
    categoryId: number;
    /** 分类名称 */
    categoryName: string;
    /** 类型说明 */
    introduction: string;
    /** 排序默认0 */
    sortNo?: number;
    /** 机器人集合 */
    botIds?: number[];
    cover: string;
    tags?: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/manage/category',
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

/** 创建机器人类型（栏目）（改） POST /bot/manage/category */
export async function postBotManageCategory(
  body: {
    /** 分类名称 */
    categoryName: string;
    /** 排序默认0 */
    sort?: number;
    /** 介绍 */
    introduction: string;
    /** 机器人id集合 */
    botIds?: number[];
    /** 新增 */
    cover: string;
    tags?: string[];
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/bot/manage/category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 机器人类型（栏目）详情（改） GET /bot/manage/category/${param0} */
export async function getBotManageCategoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageCategoryIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      categoryId: number;
      categoryName: string;
      sortNo: string;
      introduction: string;
      cover: string;
      tags: string[];
    };
  }>(`/bot/manage/category/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除机器人类型（栏目） DELETE /bot/manage/category/${param0} */
export async function deleteBotManageCategoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotManageCategoryIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(
    `/bot/manage/category/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 机器人列表-新建类型（栏目）勾选列表 GET /bot/manage/category/bots */
export async function getBotManageCategoryBots(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageCategoryBotsParams,
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
        digitalHuman: boolean;
        botSource: string;
      }[];
    };
  }>('/bot/manage/category/bots', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 机器人列表-非本栏目下的机器人集合 GET /bot/manage/category/can-select-bots */
export async function getBotManageCategoryCanSelectBots(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageCategoryCanSelectBotsParams,
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
        botSource: string;
        creator: string;
        creatorName: string;
      }[];
    };
  }>('/bot/manage/category/can-select-bots', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

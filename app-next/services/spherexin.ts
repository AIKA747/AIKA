// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

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
    data: { total: number; pageNum: number; pageSize: number; pages: number; list: API.SphereBotDto[] };
  }>('/bot/app/sphere/bot', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 字典查询接口 GET /bot/app/dic */
export async function getBotAppDic(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppDicParams,
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: API.dictionary[] }>(
    '/bot/app/dic',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 字典查询接口 GET /bot/manage/dic */
export async function getBotManageDic(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageDicParams,
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: API.dictionary[] }>(
    '/bot/manage/dic',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

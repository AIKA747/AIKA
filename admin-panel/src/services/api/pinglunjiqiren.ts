// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 评分列表 GET /bot/app/rate */
export async function getBotAppRate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppRateParams,
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
        userId: string;
        id: string;
        username: string;
        botId: string;
        rating: number;
        content: string;
        commentAt: string;
      }[];
    };
  }>('/bot/app/rate', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 提交评分 POST /bot/app/rate */
export async function postBotAppRate(
  body: {
    /** 机器人id */
    botId: string;
    /** 评分: 0-5 */
    rating: number;
    /** 评论内容 */
    content: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/bot/app/rate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

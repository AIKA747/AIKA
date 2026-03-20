// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 任务列表管理 GET /bot/manage/user/task */
export async function getBotManageUserTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageUserTaskParams,
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
        type: string;
        name: string;
        introduction: string;
        cron: string;
        lastExcetedAt?: string;
        creater: string;
        botId: string;
        status: string;
        createdAt: string;
        prompt?: string;
        json?: string;
        username?: string;
        nickname?: string;
        avatar: string;
        botName?: string;
        botAvatar: string;
      }[];
    };
  }>('/bot/manage/user/task', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

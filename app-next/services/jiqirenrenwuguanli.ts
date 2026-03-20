// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 任务列表 GET /bot/app/user-task */
export async function getBotAppUserTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppUserTaskParams,
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
      }[];
    };
  }>('/bot/app/user-task', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 任务详情 GET /bot/app/user-task/${param0} */
export async function getBotAppUserTaskId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppUserTaskIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      type: string;
      name: string;
      introduction: string;
      cron: string;
      lastExcetedAt: string;
      creater: string;
      botId: string;
      status: string;
      createdAt: string;
      prompt: string;
      json: string;
    };
  }>(`/bot/app/user-task/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 任务启用/停用（或修改执行频率） PUT /bot/app/user-task/${param0} */
export async function putBotAppUserTaskId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putBotAppUserTaskIdParams,
  body: {
    /** ENABLED/DISABLED */
    status: string;
    /** 任务执行频次 */
    cron?: string;
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data?: {
      id?: number;
      type?: string;
      name?: string;
      introduction?: string;
      cron?: string;
      lastExcetedAt?: string;
      creater?: string;
      botId?: string;
      status?: string;
      createdAt?: string;
      prompt?: string;
      json?: string;
    };
  }>(`/bot/app/user-task/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除任务 DELETE /bot/app/user-task/${param0} */
export async function deleteBotAppUserTaskId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotAppUserTaskIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      type: string;
      name: string;
      introduction: string;
      cron: string;
      lastExcetedAt: string;
      creater: string;
      botId: string;
      status: string;
      createdAt: string;
      prompt: string;
      json: string;
    };
  }>(`/bot/app/user-task/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

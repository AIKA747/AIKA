// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新建定时任务 POST /user/manage/push-job */
export async function postUserManagePushJob(
  body: {
    /** 当id不为null时编辑，为空时新增 */
    id: number;
    /** 任务名称 */
    name: string;
    /** 定时任务参数，由前端生成cron参数，当category=instant时，该参数设置为任意值不生效，任务直接执行 */
    cron: string;
    /** 定时任务类型：循环任务，定时延迟任务，不活跃用户任务 */
    category: string;
    /** 定时任务推送内容 */
    body: {
      title: string;
      content: string;
      pushTo: string;
      soundAlert: boolean;
      inactiveDays?: number;
      pushTime?: string;
      stopTime?: string;
    };
    /** 前端自定义使用字段 */
    remark?: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/user/manage/push-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 推送任务详情 GET /user/manage/push-job-detail */
export async function getUserManagePushJobDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManagePushJobDetailParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      cron: string;
      category: string;
      body: {
        title: string;
        content: string;
        pushTo: string;
        soundAlert: boolean;
        inactiveDays?: number;
        pushTime?: string;
        stopTime?: string;
      };
      remark: string;
    };
  }>('/user/manage/push-job-detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 推送任务列表查询 GET /user/manage/push-job-list */
export async function getUserManagePushJobList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManagePushJobListParams,
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
        name: string;
        category: string;
        status: string;
        createdAt: string;
      }[];
    };
  }>('/user/manage/push-job-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除推送任务 DELETE /user/manage/push-job/${param0} */
export async function deleteUserManagePushJobId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserManagePushJobIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<Record<string, any>>(`/user/manage/push-job/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** （停用/启用）推送任务 PATCH /user/manage/push-job/${param0}/${param1} */
export async function patchUserManagePushJobIdStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patchUserManagePushJobIdStatusParams,
  options?: { [key: string]: any },
) {
  const { id: param0, status: param1, ...queryParams } = params;
  return request<Record<string, any>>(
    `/user/manage/push-job/${param0}/${param1}`,
    {
      method: 'PATCH',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

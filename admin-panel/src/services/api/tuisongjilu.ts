// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增推送记录 POST /user/manage/push-list */
export async function postUserManagePushList(
  body: {
    /** 标题 */
    title: string;
    /** 内容 */
    content: string;
    /** 多个分组使用逗号分隔（groupId），全部：all */
    pushTo: string;
    /** 是否声音提醒：0否，1是 */
    soundAlert: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/user/manage/push-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 推送记录详情 GET /user/manage/push-list/${param0} */
export async function getUserManagePushListId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManagePushListIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      title: string;
      content: string;
      pushTo: string;
      soundAlert: number;
      operator: string;
      received: number;
      pushTotal: number;
      pushTime: string;
      createdAt: string;
      updatedAt: string;
    };
  }>(`/user/manage/push-list/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 推送记录列表 GET /user/manage/push-lists */
export async function getUserManagePushLists(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManagePushListsParams,
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
        title: string;
        content: string;
        pushTo: string;
        soundAlert: number;
        operator: string;
        received: number;
        pushTotal: number;
        pushTime: string;
        createdAt: string;
      }[];
    };
  }>('/user/manage/push-lists', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

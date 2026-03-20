// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 修改兴趣 PUT /user/manage/interest-item */
export async function putUserManageInterestItem(
  body: {
    itemType: string;
    itemName: string;
    remark?: string;
    orderNum?: number;
    multiple: boolean;
    valueArray?: { optName: string; value: string }[];
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/user/manage/interest-item', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增兴趣 POST /user/manage/interest-item */
export async function postUserManageInterestItem(
  body: {
    /** 有如下     SPORT,     ENTERTAINMENT,     NEWS,     GAMING,     ARTISTIC,     LIFESTYLE,     TECHNOLOGY,     SOCIAL,     OTHER; */
    itemType: string;
    itemName: string;
    remark?: string;
    orderNum?: number;
    multiple: boolean;
    valueArray?: { optName: string; value: string }[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: { id: number } }>(
    '/user/manage/interest-item',
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

/** 删除兴趣 可以直接硬删除 DELETE /user/manage/interest-item/${param0} */
export async function deleteUserManageInterestItemId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserManageInterestItemIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/user/manage/interest-item/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 兴趣列表 GET /user/manage/interest-items */
export async function getUserManageInterestItems(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManageInterestItemsParams,
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
      list: API.interestItem[];
    };
  }>('/user/manage/interest-items', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

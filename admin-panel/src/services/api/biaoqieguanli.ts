// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 修改标签 PUT /user/manage/tag */
export async function putUserManageTag(
  body: {
    tagName: string;
    sortNo?: number;
    id: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/user/manage/tag', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增标签 POST /user/manage/tag */
export async function postUserManageTag(
  body: {
    tagName: string;
    sortNo?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/user/manage/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改标签序号 PATCH /user/manage/tag */
export async function patchUserManageTag(
  body: {
    sortNo?: number;
    id: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/user/manage/tag', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除标签 DELETE /user/manage/tag/${param0} */
export async function deleteUserManageTagId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserManageTagIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/user/manage/tag/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 标签列表 GET /user/manage/tags */
export async function getUserManageTags(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserManageTagsParams,
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
        tagName: string;
        sortNo: number;
        createdAt: string;
      }[];
    };
  }>('/user/manage/tags', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 故事分类管理（新） GET /content/manage/category */
export async function getContentManageCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManageCategoryParams,
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
      list: { id: number; name: string; weight?: number }[];
    };
  }>('/content/manage/category', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改分类 PUT /content/manage/category */
export async function putContentManageCategory(
  body: {
    id: number;
    name: string;
    /** 排序的权重 */
    weight: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/content/manage/category', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新建分类（新） 新建分类 POST /content/manage/category */
export async function postContentManageCategory(
  body: {
    name: string;
    /** 可为空，默认为0 */
    weight?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: { id: string } }>(
    '/content/manage/category',
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

/** 删除分类 DELETE /content/manage/category/${param0} */
export async function deleteContentManageCategoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteContentManageCategoryIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/content/manage/category/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

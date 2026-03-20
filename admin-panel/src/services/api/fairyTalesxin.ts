// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 故事的分类（新） 获得故事的分页列表。 GET /content/app/category */
export async function getContentAppCategory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppCategoryParams,
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
      list: { id: string; name: string }[];
    };
  }>('/content/app/category', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

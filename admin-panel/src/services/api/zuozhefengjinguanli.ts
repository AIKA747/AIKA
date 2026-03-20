// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 作者解封 PUT /content/manage/author-unblocked */
export async function putContentManageAuthorUnblocked(
  body: {
    /** 用户id */
    userId?: number;
  },
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<{ code: number; msg: string; data: string }>(
    '/content/manage/author-unblocked',
    {
      method: 'PUT',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    },
  );
}

/** 封禁作者列表 GET /content/manage/blocked-authors */
export async function getContentManageBlockedAuthors(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManageBlockedAuthorsParams,
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
        userId: number;
        avatar: string;
        nickname: string;
        username: string;
        createdAt?: string;
        bio?: string;
        caseCleanAt?: string;
        flagNum: number;
      }[];
    };
  }>('/content/manage/blocked-authors', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

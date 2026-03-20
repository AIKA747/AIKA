// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 编辑敏感词 PUT /content/manage/sensitive-word */
export async function putContentManageSensitiveWord(
  body: {
    /** id */
    id: number;
    /** 敏感词 */
    word: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/content/manage/sensitive-word',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 添加敏感词 POST /content/manage/sensitive-word */
export async function postContentManageSensitiveWord(
  body: {
    /** 敏感词 */
    word: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/content/manage/sensitive-word',
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

/** 移除敏感词 DELETE /content/manage/sensitive-word */
export async function deleteContentManageSensitiveWord(
  body: {
    /** id */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/content/manage/sensitive-word',
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 敏感词列表 GET /content/manage/sensitive-words */
export async function getContentManageSensitiveWords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManageSensitiveWordsParams,
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
        word: string;
        createdAt: string;
        updatedAt: string;
        deleted: boolean;
      }[];
    };
  }>('/content/manage/sensitive-words', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量导入接口 POST /content/manage/sensitive-words */
export async function postContentManageSensitiveWords(
  body: string[],
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/content/manage/sensitive-words', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 删除帖子 DELETE /content/manage/post */
export async function deleteContentManagePost(
  body: {
    /** 屏蔽帖子的id集合,多个使用逗号分隔 */
    ids?: string;
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

  return request<{ code: number; msg: string; data: number }>(
    '/content/manage/post',
    {
      method: 'DELETE',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    },
  );
}

/** 屏蔽帖子 PUT /content/manage/post-blocked */
export async function putContentManagePostBlocked(
  body: {
    /** 屏蔽帖子的id集合,多个id使用英文逗号分隔 */
    ids?: string;
    /** 屏蔽：true，解除屏蔽：false */
    blocked?: boolean;
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

  return request<{ code: number; msg: string; data: number }>(
    '/content/manage/post-blocked',
    {
      method: 'PUT',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    },
  );
}

/** 获取发帖全局配置 GET /content/manage/post-create-config */
export async function getContentManagePostCreateConfig(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: { postCreateBlockedEnabled: string; postCreateBlockedNumber: number };
  }>('/content/manage/post-create-config', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改发帖全局配置 PUT /content/manage/post-create-config */
export async function putContentManagePostCreateConfig(
  body: {
    /** 是否开启禁止发贴功能 */
    postCreateBlockedEnabled?: boolean;
    /** 设置帖子被标记多次则禁止用户发贴 */
    postCreateBlockedNumber?: number;
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
    '/content/manage/post-create-config',
    {
      method: 'PUT',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    },
  );
}

/** 帖子详情 GET /content/manage/post-detail */
export async function getContentManagePostDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManagePostDetailParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      title: string;
      summary: string;
      thread: { title: string; content: string; images: string[] }[];
      id: number;
      cover: string;
      topicTags: string;
      createdAt: string;
      updatedAt: string;
      author: number;
      type: string;
      likes: number;
      reposts: number;
      visits: number;
      keywords: string;
      recommendTags: string;
      blocked: boolean;
      flagged: boolean;
      categories: string[];
    };
  }>('/content/manage/post-detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 帖子列表 GET /content/manage/post-list */
export async function getContentManagePostList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManagePostListParams,
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
        cover: string;
        title: string;
        summary: string;
        author: string;
        authorName: string;
        authorAvatar: string;
        type: string;
        keywords?: string;
        recommendTags?: string;
        createdAt: string;
        blocked: boolean;
        flagged?: boolean;
        categories?: string[];
      }[];
    };
  }>('/content/manage/post-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

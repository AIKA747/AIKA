// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 帖子的评论列表（新） 按发表时间升序排列 GET /content/app/comment */
export async function getContentAppComment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppCommentParams,
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
      list: API.CommentDto[];
    };
  }>('/content/app/comment', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 发表评论接口（新） POST /content/app/comment */
export async function postContentAppComment(
  body: {
    /** 评论内容 */
    content: string;
    /** 语音链接 */
    voiceUrl?: string;
    postId: string;
    /** 文件属性，前端自行设置，后端不做参数解析，会在列表接口进行返回 */
    fileProperty?: Record<string, any>;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/content/app/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除自己评论（新） 只能删除自己的评论，或自己发帖下的评论。 DELETE /content/app/comment/${param0} */
export async function deleteContentAppCommentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteContentAppCommentIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/content/app/comment/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获得帖子中的回帖用户列表 支持用户在回帖@ 某人时出现一个备选人列表。其中 username若为空则返回所有回贴人，不为空则支持前缀匹配 GET /content/app/post/${param0}/comment-users */
export async function getContentAppPostPostIdCommentUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppPostPostIdCommentUsersParams,
  options?: { [key: string]: any },
) {
  const { postId: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      total: number;
      pageNum: number;
      pageSize: number;
      pages: number;
      list: string[];
    };
  }>(`/content/app/post/${param0}/comment-users`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 用户的评论列表（新） 按发表时间升序排列 GET /content/app/user-comment */
export async function getContentAppUserComment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppUserCommentParams,
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
      list: API.CommentDto[];
    };
  }>('/content/app/user-comment', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

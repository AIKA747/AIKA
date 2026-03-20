// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 搜索用户（包括Bot和真实用户） GET /content/app/author */
export async function getContentAppAuthor(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppAuthorParams,
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
        avatar: string;
        nickname: string;
        username: string;
        userId: string;
        type: string;
        followed: boolean;
        bio: string;
      }[];
    };
  }>('/content/app/author', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改机器人形象（新） PUT /content/app/bot-image */
export async function putContentAppBotImage(
  body: {
    /** 机器人id */
    botId: string;
    /** 机器人的形象id */
    botImage: { cover: string; avatar: string };
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/content/app/bot-image', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获得当前用户的关注数 GET /content/app/follow-count */
export async function getContentAppFollowCount(options?: { [key: string]: any }) {
  return request<{ code: number; msg: string; data: { followers: number; following: number } }>(
    '/content/app/follow-count',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 同意用户的关注（新） 同意用户的关注，将agreed 设置为 true。这里要做一个验证，验证这个relation中的被关注人是自己。根据 followingId 和 type= USER 来确认。 PUT /content/app/follow-relation */
export async function putContentAppFollowRelation(
  body: {
    /** 某一条申请的id */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/content/app/follow-relation', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 关注用户或者机器人（新） 1. 首先，操作 FollowRelation表。
2. 如果关注的是机器人，则可以直接关注。
3. 如果关注的是人类，需要人类同意后才能关注。 POST /content/app/follow-relation */
export async function postContentAppFollowRelation(
  body: {
    followingId: string;
    /** BOT 和 USER 的枚举 */
    type: string;
    /** 默认：ADD , 操作类型：ADD，DELETE */
    actionType?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/content/app/follow-relation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户的关系申请（新） 这里要做一个确认，操作人必须是被关注人，也就是 followingId = #{current_User_id} 并且  type = USER。 DELETE /content/app/follow-relation/${param0} */
export async function deleteContentAppFollowRelationId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteContentAppFollowRelationIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/content/app/follow-relation/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获得用户的关注申请列表（新） 按时间倒序排序。筛选 FollowingRelation中 agreed = false 的。
 GET /content/app/following-apply */
export async function getContentAppFollowingApply(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppFollowingApplyParams,
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
      list: { id: number; avatar: string; nickname: string; username: string; userId: number }[];
    };
  }>('/content/app/following-apply', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查看帖子点赞用户列表 GET /content/app/post-thumb-user-list */
export async function getContentAppPostThumbUserList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppPostThumbUserListParams,
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
        userId: string;
        avatar: string;
        username: string;
        nickname: string;
        createdAt: string;
        followed: boolean;
      }[];
    };
  }>('/content/app/post-thumb-user-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改帖子的访问数 +1 PUT /content/app/post/visit */
export async function putContentAppPostVisit(
  body: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/content/app/post/visit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Agora顶部的用户头像列表 这个虽然是现实的头像，其实现实的是我关注的作者24小时内的新文章 GET /content/app/shortcut */
export async function getContentAppShortcut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppShortcutParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { id?: number; nickname?: string; avatar?: string; postId?: number; userId?: number; type?: string }[];
  }>('/content/app/shortcut', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 点赞或取消点赞（新） 点赞或取消点赞，都要去修改文章的点赞数。 POST /content/app/thumb */
export async function postContentAppThumb(
  body: {
    postId: number;
    /** true就是点赞，false就是取消点赞 */
    thumb: boolean;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/content/app/thumb', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 取消关注用户接口（新） 这个地方可能要做一个修改，就是关注了以后，会先操作 ContentService里的关注申请，等关注申请通过以后，才在UserService的用户关系表里添加关注数据。事实上在第一期，由于我们是做Agora，大概率并不会用这个接口来进行关注。而是会用ContentService的关注申请来完成关注，因为 ContentService的关注即可以关注机器人，也可以关注人类。这个接口的设计是因为最初是要做AISA，而不是Agora。也就是说，其实可以完全不用这个接口来关注用户，只用来取消关注用户。 POST /user/app/follower */
export async function postUserAppFollower(
  body: {
    followingId: number;
    /** FOLLOW CANCEL */
    method: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/user/app/follower', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 我的好友列表接口（新） 查看我关注的好友 GET /user/app/friends */
export async function getUserAppFriends(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppFriendsParams,
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
        username: string;
        nickname: string;
        followStatus: string;
        avatar: string;
        bio: string;
      }[];
    };
  }>('/user/app/friends', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获得推荐好友（新） 推荐好友列表 GET /user/app/recommendation */
export async function getUserAppRecommendation(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppRecommendationParams,
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
        username: string;
        avatar: string;
        occupation: string;
        bio: string;
        age: number;
        match: number;
      }[];
    };
  }>('/user/app/recommendation', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

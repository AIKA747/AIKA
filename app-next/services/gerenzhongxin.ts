// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 用户关注列表 GET /content/app/follow-relation-users */
export async function getContentAppFollowRelationUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppFollowRelationUsersParams,
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
        username: string;
        nickname: string;
        avatar: string;
        bio?: string;
        gender: string;
        followed: boolean;
      }[];
    };
  }>('/content/app/follow-relation-users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取用户统计数据 GET /content/app/user/statistics */
export async function getContentAppUserStatistics(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppUserStatisticsParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      storyTotal: number;
      followersTotal: number;
      followingTotal: number;
      postTotal: number;
      commentTotal: number;
      friendTotal: number;
    };
  }>('/content/app/user/statistics', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

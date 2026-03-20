// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 屏蔽 PUT /user/app/user/block/${param0} */
export async function putUserAppUserBlockUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putUserAppUserBlockUserIdParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/user/app/user/block/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 被屏蔽用户列表 GET /user/app/user/blocked-user */
export async function getUserAppUserBlockedUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppUserBlockedUserParams,
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
      list: { userId: number; username: string; nickname: string; avatar: string }[];
    };
  }>('/user/app/user/blocked-user', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 取消屏蔽 PUT /user/app/user/un-block/${param0} */
export async function putUserAppUserUnBlockUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putUserAppUserUnBlockUserIdParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/user/app/user/un-block/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

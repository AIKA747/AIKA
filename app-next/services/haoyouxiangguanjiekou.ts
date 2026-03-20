// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 获得推荐好友（V2） 推荐好友列表 GET /user/app/v2/recommendation */
export async function getUserAppV2Recommendation(options?: { [key: string]: any }) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      username: string;
      nickname: string;
      bio?: string;
      avatar: string;
      status: string;
      phone: string;
      email: string;
      country: string;
      language: string;
    }[];
  }>('/user/app/v2/recommendation', {
    method: 'GET',
    ...(options || {}),
  });
}

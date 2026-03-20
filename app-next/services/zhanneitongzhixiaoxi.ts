// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 站内通知消息查询 GET /user/app/notification */
export async function getUserAppNotification(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserAppNotificationParams,
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
        type: string;
        cover: string;
        number: number;
        authors: { authorId: string; avatar: string; nickname: string; username: string; gender: string }[];
        metadata: {
          postId?: string;
          summary?: string;
          likes: string;
          reposts: string;
          commentId?: string;
          content: string;
        };
        readFlag: boolean;
        createdAt: string;
      }[];
    };
  }>('/user/app/notification', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 通知已读标记 PUT /user/app/notification/read */
export async function putUserAppNotificationRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putUserAppNotificationReadParams,
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/user/app/notification/read', {
    method: 'PUT',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取未读通知数 GET /user/app/notification/unread-num */
export async function getUserAppNotificationUnreadNum(options?: { [key: string]: any }) {
  return request<{ code: number; msg: string; data: number }>('/user/app/notification/unread-num', {
    method: 'GET',
    ...(options || {}),
  });
}

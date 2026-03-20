// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 根据code查询群聊详情 GET /bot/app/chatroom */
export async function getBotAppChatroom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatroomParams,
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: API.ChatGroupDetail }>(
    '/bot/app/chatroom',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查询群聊详情 GET /bot/app/chatroom/${param0} */
export async function getBotAppChatroomId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatroomIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: API.ChatGroupDetail }>(
    `/bot/app/chatroom/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 获取用户精选消息 GET /bot/app/chatroom/feature-messages */
export async function getBotAppChatroomFeatureMessages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatroomFeatureMessagesParams,
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
      list: API.GroupChatMessageRecord[];
    };
  }>('/bot/app/chatroom/feature-messages', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取群聊文件记录 GET /bot/app/chatroom/group-chat-files */
export async function getBotAppChatroomGroupChatFiles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatroomGroupChatFilesParams,
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
      list: API.GroupChatMessageRecord[];
    };
  }>('/bot/app/chatroom/group-chat-files', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取群聊记录 GET /bot/app/chatroom/group-chat-records */
export async function getBotAppChatroomGroupChatRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatroomGroupChatRecordsParams,
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
      list: API.ChatMessageBO[];
    };
  }>('/bot/app/chatroom/group-chat-records', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取聊天列表 GET /bot/app/chatroom/list */
export async function getBotAppChatroomList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatroomListParams,
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
        createdAt: string;
        creator?: number;
        updatedAt: string;
        updater?: number;
        roomName: string;
        roomType: string;
        groupType: string;
        roomAvatar: string;
        memberLimit: number;
        description: string;
        roomCode: string;
        unreadNum: string;
        lastMessageContent?: string;
        lastMessageTime?: string;
        lastReadTime?: string;
        lastLoadTime?: string;
      }[];
    };
  }>('/bot/app/chatroom/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 加入群聊或者申请加入群聊 POST /bot/app/chatroom/member */
export async function postBotAppChatroomMember(
  body: {
    roomId: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/bot/app/chatroom/member', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 群聊信息读取/加载完毕 PUT /bot/app/chatroom/member/last-time */
export async function putBotAppChatroomMemberLastTime(
  body: {
    /** 房间id */
    roomIds: number[];
    type: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/bot/app/chatroom/member/last-time', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查询群成员列表 群成员在线状态可通过：UserOnlineService.online(userId: Long)  方法进行查询 GET /bot/app/chatroom/members */
export async function getBotAppChatroomMembers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatroomMembersParams,
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
      list: API.GroupMemberListVO[];
    };
  }>('/bot/app/chatroom/members', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 群聊列表 GET /bot/app/group-chatroom-list */
export async function getBotAppGroupChatroomList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppGroupChatroomListParams,
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
        roomName: string;
        roomAvatar: string;
        description: string;
        roomCode: string;
        memberLimit: number;
        joined: boolean;
      }[];
    };
  }>('/bot/app/group-chatroom-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

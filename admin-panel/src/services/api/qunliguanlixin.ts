// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 群成员列表 GET /bot/manage/chatroom/members */
export async function getBotManageChatroomMembers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageChatroomMembersParams,
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
        createdAt: string;
        creator?: number;
        updatedAt: string;
        updater?: number;
        roomId: string;
        memberType: string;
        memberRole: string;
        memberId: string;
        avatar: string;
        nickname: string;
        username: string;
        lastReadTime: string;
        onlineStatus: boolean;
        status: string;
      }[];
    };
  }>('/bot/manage/chatroom/members', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加群成员 POST /bot/manage/chatroom/members */
export async function postBotManageChatroomMembers(
  body: {
    /** 群成员id，仅可添加已相互同意的好友 */
    members: {
      memberType: string;
      memberId: string;
      avatar: string;
      nickname: string;
      username: string;
    }[];
    /** 群聊id */
    roomId: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/manage/chatroom/members',
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

/** 剔除群成员 DELETE /bot/manage/chatroom/members */
export async function deleteBotManageChatroomMembers(
  body: {
    /** 群聊id */
    roomId: string;
    /** 剔除的群成员id */
    memberIds: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/manage/chatroom/members',
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

/** 设置成员角色 PUT /bot/manage/chatroom/role */
export async function putBotManageChatroomRole(
  body: {
    /** 群聊id */
    roomId: number;
    /** 成员角色：OWNER、MODERATOR、MEMBER */
    role: string;
    /** 成员id */
    memberIds: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/manage/chatroom/role',
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

/** 群聊详情 GET /bot/manage/group-chatroom */
export async function getBotManageGroupChatroom(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageGroupChatroomParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      createdAt: string;
      creator: number;
      updatedAt: string;
      updater: number;
      dataVersion: number;
      deleted: boolean;
      roomName: string;
      roomType: string;
      groupType: string;
      roomAvatar: string;
      memberLimit: number;
      description: string;
      roomCode: string;
      historyMsgVisibility: boolean;
      permissions: {
        memberRole: string;
        changeGroupSettings: boolean;
        linkChatToPosts: boolean;
        approveNewMembers: boolean;
        addOtherMembers: boolean;
      }[];
    };
  }>('/bot/manage/group-chatroom', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 编辑群聊 仅群主和管理员可以编辑群聊信息 PUT /bot/manage/group-chatroom */
export async function putBotManageGroupChatroom(
  body: {
    /** 群聊名称 */
    roomName: string;
    /** 群聊头像 */
    roomAvatar: string;
    /** 详情 */
    description: string;
    /** 群id */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: number }>(
    '/bot/manage/group-chatroom',
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

/** 创建群聊 POST /bot/manage/group-chatroom */
export async function postBotManageGroupChatroom(
  body: {
    /** 群聊名称 */
    roomName: string;
    /** 群聊头像 */
    roomAvatar?: string;
    /** 详情 */
    description?: string;
    /** 群主id */
    ownerId: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: number }>(
    '/bot/manage/group-chatroom',
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

/** 群聊列表 GET /bot/manage/group-chatroom-list */
export async function getBotManageGroupChatroomList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageGroupChatroomListParams,
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
      }[];
    };
  }>('/bot/manage/group-chatroom-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除群聊 DELETE /bot/manage/group-chatroom/${param0} */
export async function deleteBotManageGroupChatroomId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotManageGroupChatroomIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<Record<string, any>>(`/bot/manage/group-chatroom/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

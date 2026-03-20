// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 编辑群聊基础信息 仅群主和管理员可以编辑群聊信息 PUT /bot/app/chatroom */
export async function putBotAppChatroom(
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
    '/bot/app/chatroom',
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

/** 创建群聊 POST /bot/app/chatroom */
export async function postBotAppChatroom(
  body: {
    /** 群聊名称 */
    roomName: string;
    /** 群聊类型：PUBLIC、PRIVATE */
    groupType: string;
    /** 群聊头像 */
    roomAvatar?: string;
    /** 详情 */
    description?: string;
    /** 群聊成员id（用户的userId）集合，创建者默认为群主，不用传群主id */
    members?: {
      memberType: string;
      memberId: string;
      avatar: string;
      nickname: string;
      username: string;
    }[];
    /** 若传了，则设置权限，若不传，默认所有角色权限为false */
    permissions?: {
      memberRole: string;
      changeGroupSettings: boolean;
      linkChatToPosts: boolean;
      approveNewMembers: boolean;
      addOtherMembers: boolean;
    }[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: number }>(
    '/bot/app/chatroom',
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

/** 删除群聊（仅群主） DELETE /bot/app/chatroom/${param0} */
export async function deleteBotAppChatroomId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotAppChatroomIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<Record<string, any>>(`/bot/app/chatroom/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 设置群聊类型 PUT /bot/app/chatroom/group-type */
export async function putBotAppChatroomGroupType(
  body: {
    /** 群聊类型：PUBLIC、PRIVATE */
    groupType: string;
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chatroom/group-type',
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

/** 设置群聊历史记录是否可见 PUT /bot/app/chatroom/history-visible */
export async function putBotAppChatroomHistoryVisible(
  body: {
    /** 新入群里人员是否可见历史消息 */
    historyMsgVisibility: boolean;
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chatroom/history-visible',
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

/** 查看入群申请接口 GET /bot/app/chatroom/member/join-request */
export async function getBotAppChatroomMemberJoinRequest(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatroomMemberJoinRequestParams,
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
        roomId: string;
        memberType: string;
        memberId: string;
        avatar: string;
        nickname: string;
        username: string;
        status: string;
      }[];
    };
  }>('/bot/app/chatroom/member/join-request', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 剔除群成员 DELETE /bot/app/chatroom/members */
export async function deleteBotAppChatroomMembers(
  body: {
    /** 群聊id */
    roomId: string;
    /** 剔除的群成员id */
    memberIds: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chatroom/members',
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

/** 设置群聊权限 PUT /bot/app/chatroom/permissions */
export async function putBotAppChatroomPermissions(
  body: {
    permissions: {
      memberRole: string;
      linkChatToPosts?: boolean;
      approveNewMembers?: boolean;
      addOtherMembers?: boolean;
      changeGroupInfo?: boolean;
      changeGroupType: string;
      changeShowHis: string;
    }[];
    /** 聊天室id */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chatroom/permissions',
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

/** 设置成员角色 PUT /bot/app/chatroom/role */
export async function putBotAppChatroomRole(
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
    '/bot/app/chatroom/role',
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

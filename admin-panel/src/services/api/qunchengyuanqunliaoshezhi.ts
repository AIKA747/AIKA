// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 通过邀请链接申请加入群聊 POST /bot/app/chatroom/${param0} */
export async function postBotAppChatroomRoomCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postBotAppChatroomRoomCodeParams,
  body: {},
  options?: { [key: string]: any },
) {
  const { roomCode: param0, ...queryParams } = params;
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<Record<string, any>>(`/bot/app/chatroom/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 同意加入群聊 FRIEND_INVITE(朋友邀请加入群聊，待用户审核),USER_JOIN_REQUEST（用户申请加入群里，待管理员审核）,APPROVE（已通过）
根据ChatroomMember表状态区分：
status=FRIEND_INVITE，当前用户id需要和ChatroomMember表memberId相同
status=USER_JOIN_REQUEST，当前操作用户需要具有该群聊的同意用户进群的权限
 PUT /bot/app/chatroom/approve */
export async function putBotAppChatroomApprove(
  body: {
    /** ChatroomMember表id */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chatroom/approve',
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

/** 标记精选消息 POST /bot/app/chatroom/group-chat-record/featured */
export async function postBotAppChatroomGroupChatRecordFeatured(
  body: {
    /** 消息作者用户id */
    uid: number;
    /** 来源类型：user，bot */
    st: string;
    /** 消息作者头像 */
    avatar: string;
    /** 消息作者昵称或机器人昵称 */
    nn: string;
    /** 文本内容 */
    txt?: string;
    /** 多媒体（oss文件链接） */
    med?: string;
    /** 时长，单位：秒 */
    flength?: string;
    /** 文件名称 */
    fn?: string;
    /** 创建时间 */
    time?: string;
    /** 聊天室id */
    roomId: string;
    /** 标记的消息id */
    mid: string;
    /** 回复的消息内容 */
    rmessage?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chatroom/group-chat-record/featured',
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

/** 批量移除精选消息 DELETE /bot/app/chatroom/group-chat-record/featured */
export async function deleteBotAppChatroomGroupChatRecordFeatured(
  body: string[],
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chatroom/group-chat-record/featured',
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

/** 查看入群邀请列表 GET /bot/app/chatroom/member/notification */
export async function getBotAppChatroomMemberNotification(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppChatroomMemberNotificationParams,
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
        roomId: string;
        memberId: string;
        status: string;
        chatroomName: string;
        chatroomAvatar: string;
        creatorNickName: string;
      }[];
    };
  }>('/bot/app/chatroom/member/notification', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 关闭消息提醒 打开消息提醒则将notifyTurnOffTime设置为小于当前时间的一个值
关闭通知时间，直接设置为未来的一个时间点，过了这个时间点则会继续收到通知 PUT /bot/app/chatroom/member/notification-off */
export async function putBotAppChatroomMemberNotificationOff(
  body: {
    /** 群聊id */
    roomId: number;
    /** 在这个时间前不接收群消息通知，此字段是一个枚举
ONE_HOUR,EIGHT_HOUR,ONE_DAY,ONE_WEEK,ALWAYS */
    notifyTurnOff?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chatroom/member/notification-off',
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

/** 添加群成员 POST /bot/app/chatroom/members */
export async function postBotAppChatroomMembers(
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
    '/bot/app/chatroom/members',
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

/** 拒绝加入群聊 FRIEND_INVITE(朋友邀请加入群聊，待用户审核),USER_JOIN_REQUEST（用户申请加入群里，待管理员审核）,APPROVE（已通过）
根据ChatroomMember表状态区分：
status=FRIEND_INVITE，当前用户id需要和ChatroomMember表memberId相同
status=USER_JOIN_REQUEST，当前操作用户需要具有该群聊的同意用户进群的权限
 PUT /bot/app/chatroom/reject */
export async function putBotAppChatroomReject(
  body: {
    /** ChatroomMember表id */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chatroom/reject',
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

/** 设置群聊主题 PUT /bot/app/chatroom/theme */
export async function putBotAppChatroomTheme(
  body: {
    /** 主题类型：gallery、color */
    type: string;
    /** 颜色 */
    color: string;
    /** 图片链接 */
    gallery: string;
    roomId: number;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/app/chatroom/theme',
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

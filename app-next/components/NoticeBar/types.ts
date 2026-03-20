export enum NoticeType {
  /**
   * 加入群聊申请相关通知类型
   */
  CHATROOM_JOIN = 'CHATROOM_JOIN',

  /**
   * 群聊消息通知
   */
  CHATROOM = 'CHATROOM',

  /**
   * 专家提醒
   */
  BOT_REMINDER = 'BOT_REMINDER',
  /**
   * 故事通知
   */
  STORY = 'STORY',
  /**
   * 评论通知
   */
  COMMENT = 'COMMENT',
  /**
   * 点赞通知
   */
  THUMB = 'THUMB',
  /**
   * 贴子通知
   */
  POST = 'POST',
}

export interface NoticeBarProps {
  title?: string;
  body?: string;
  type?: NoticeType;
  id?: string;
  onClose: () => void;
}

export const NoticeBarRouteMap: Record<
  NoticeType,
  {
    pathname: string;
    params: (data: Record<string, string>) => Record<string, string>;
  }
> = {
  [NoticeType.POST]: {
    pathname: '/main/agora-details/[postId]',
    params: (data: Record<string, string>) => ({ postId: data.id, id: data.id }),
  },
  [NoticeType.THUMB]: {
    pathname: '/main/agora-details/[postId]',
    params: (data: Record<string, string>) => ({ postId: data.id, id: data.id }),
  },
  [NoticeType.COMMENT]: {
    pathname: '/main/agora-details/[postId]',
    params: (data: Record<string, string>) => ({ postId: data.id, id: data.id }),
  },
  [NoticeType.CHATROOM]: {
    pathname: '/main/group-chat/chat/[roomId]',
    params: (data: Record<string, string>) => ({ roomId: data.id, id: data.id }),
  },
  [NoticeType.CHATROOM_JOIN]: {
    pathname: '/main/group-chat/chat/[roomId]',
    params: (data: Record<string, string>) => ({ roomId: data.id, id: data.id }),
  },
  [NoticeType.BOT_REMINDER]: {
    pathname: '/main/experts/chat/[expertId]',
    params: (data: Record<string, string>) => ({ expertId: data.id }),
  },
  [NoticeType.STORY]: {
    pathname: '/main/story/details/[storyId]',
    params: (data: Record<string, string>) => ({ storyId: data.id, fairyTaleId: data.id }),
  },
};

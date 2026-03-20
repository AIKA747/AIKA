import React from 'react';

import { ChatListRef } from '@/components/Chat/ChatList/types';
import { ListRequestParams } from '@/components/List/types';
import { Gender } from '@/constants/types';
import {
  ChapterProcess,
  ChapterStatus,
  ChatModule,
  ChatMsgStatus,
  ContentType,
  GameStatus,
  UserType,
} from '@/hooks/useChatClient/types';
import { GameResult } from '@/pages/Games/Result/types';
import { Gift } from '@/pages/StoryChat/GiftModal/types';
import { getBotAppChatRecords } from '@/services/huihua';
import { getBotAppChatroomGroupChatRecords, getBotAppChatroomMembers } from '@/services/pinyin2';

export type RobotItem = Awaited<ReturnType<typeof getBotAppChatroomMembers>>['data']['data']['list'][number];
export type MessageItemServer =
  | NonNullable<Awaited<ReturnType<typeof getBotAppChatRecords>>['data']['data']['list']>[number]
  | Awaited<ReturnType<typeof getBotAppChatroomGroupChatRecords>>['data']['data']['list'][number];

export enum ChatUiMode {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
}

export enum SourceType {
  user = 'user',
  bot = 'bot',
  assistant = 'assistant',
  story = 'story',
  game = 'game',
  post = 'post',
  group = 'group',
  heartbeat = 'heartbeat',
}

export type MessageItem = Omit<
  MessageItemServer,
  'contentType' | 'sourceType' | 'fileProperty' | 'userType' | 'replyMessageId' | 'objectId' | 'userId'
> & {
  conversationId?: string;
  objectId?: string;
  userId?: string;
  contentType: ContentType;
  sourceType: SourceType;
  userType?: UserType;
  videoUrl?: string;
  videoStatus?: ChatMsgStatus;
  fileProperty?: string;
  /**
   * 是否为数字人聊天消息
   */
  digitHuman?: boolean;

  /**
   * 本地数据字段，状态
   *
   * 表明是从本地代码塞进来的
   *
   * 真实请求列表数据时要把这条数据更新掉
   */
  local?: {
    /**
     * 本地数据使用次作为唯一id，等同于 msgId
     */
    clientMsgId: string;
    status: 'DONE' | 'FAIL' | 'SENDING';
    errorMsg?: string;
  };
  /**
   * 后端推送时含有此状态，列表返回没有
   * 消息回复状态，异步数据
   * created,processing,success,fail
   */
  msgStatus?: ChatMsgStatus;

  avatar?: string;
  username?: string;
  nickname?: string;
  gender?: Gender;
  json?: string;
  replyMessage?: string;
  replyMessageId?: string;
  badAnswer?: boolean;

  isRead?: boolean;
  readFlag?: boolean;
  readTime?: string;
  chapterStatus?: ChapterStatus;
  chapterProcess?: ChapterProcess;
  gameStatus?: GameStatus;
  memberIds?: string;
  /**
   * 消息转发信息对象
   */
  forwardInfo?: string;
  lastMessageCreatedAt?: string;
};

export interface ChatProps {
  chatId: string;
  params?: Record<string, any>;
  /**
   * 传入请求方法
   * @param params
   */
  request: (params: ListRequestParams & Record<string, any>) => Promise<{
    data: MessageItem[];
    total: number;
  }>;
  pageSize?: number;
  chatUiMode?: ChatUiMode;
  onChangeChatUiMode?: (mode: ChatUiMode) => void;
  onChangeCharacterModal?: () => void;
  /*
   * 是否为一对一单人聊天
   */
  isPersonal?: boolean;
  chatModule: ChatModule;
  /**
   * 创建bot时的测试界面，聊天记录不会被保存
   */
  test?: boolean;

  /**
   * 数字人打招呼和空闲视频
   */
  assistantVideo?: { greetVideo?: string; idleVideo?: string };
  onGiftSend?: (callback: (gif: Gift) => void) => void;
  onGameResult?: (gameResult: GameResult) => void;
  onChapterStatus?: (
    /**
     * NOT_STARTED PLAYING SUCCESS FAIL
     */
    chapterStatus: ChapterStatus,
    chapterProcess: ChapterProcess,
  ) => void;

  onGameStatus?: (
    /**
     * COMPLETE UNCOMPLETED
     */
    gameStatus: GameStatus,
  ) => void;

  botAvatar?: string;

  /**
   * 跳转进来聊天界面，直接发送此对话
   */
  initText?: string;

  /**
   * 聊天提示语
   */
  dialogueTemplates?: string[];

  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;

  onChangeList?: (list: MessageItem[]) => void;

  triggerResetSelect?: number;
}

export type ChatRefProps = ChatListRef;

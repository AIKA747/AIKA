import React from 'react';

import { MessageItem } from '@/components/Chat/types';
import { ListRequestParams } from '@/components/List/types';
import { BaseMessageDTO, ChapterProcess, ChapterStatus, ChatModule, GameStatus, MsgType } from '@/hooks/useChatClient';

export interface ClientProps {
  chatId: string;
  messagesRef: React.RefObject<MessageItem[]>;
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  chatModule: ChatModule;
  test: boolean;
  digitHuman: boolean;
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
}

export type HandleSendMessageParams<T extends MsgType.CHAT_MSG> = Omit<
  BaseMessageDTO<T>,
  'communicationStyle' | 'sessionId'
>;
export interface MessageCallback {
  clientMsgId: string;
  callback: (msg: BaseMessageDTO<MsgType>) => void;
}

export interface MessageSendProps {
  chatId: string;
  messagesRef: React.RefObject<MessageItem[]>;
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  chatModule: ChatModule;
  test: boolean;
  digitHuman: boolean;
  clientStatus?: 'Connecting' | 'Connected';
  handleSendMessage: <T extends MsgType.CHAT_MSG>(params: HandleSendMessageParams<T>) => void;
}

export interface requestChatListProps {
  cacheKey: string;
  params?: Record<string, any>;
  /**
   * 传入请求方法
   * @param params
   */
  request: (params: ListRequestParams & Record<string, any>) => Promise<{
    data: MessageItem[];
    total: number;
  }>;
}

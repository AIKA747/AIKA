import React from 'react';

import { GroupConversation } from '@/database/models';
import { getBotAppChatroomList } from '@/services/pinyin2';

export type ChatListVO = API.ChatListVO & { lastMessageTime?: string; isRead?: boolean };

export interface GroupChatContextProps {
  conversations?: GroupConversation[];
  setConversations: React.Dispatch<React.SetStateAction<GroupConversation[] | undefined>>;
  currentConversationIdRef?: React.RefObject<string | undefined>;
  chatRoomDetail: API.ChatGroupDetail | null;
  setChatRoomDetail: React.Dispatch<React.SetStateAction<API.ChatGroupDetail | null>>;
  fetchChatRoomDetail: (params: { type: 'id' | 'code'; val: string }) => Promise<void>;
  refreshChatRoomDetail: () => void;
  refreshAsyncChatRoomDetail: () => Promise<void>;
  chatRoomDetailLoading: boolean;
  syncError: Record<string, boolean>;
}

export type GroupChatList = Awaited<ReturnType<typeof getBotAppChatroomList>>;

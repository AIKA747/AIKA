import { FlashListRef } from '@shopify/flash-list';
import React from 'react';
import { GestureResponderEvent } from 'react-native';

import { ChatModule } from '@/hooks/useChatClient';
import { GameResult } from '@/pages/Games/Result/types';

import { MessageItem } from '../types';

export interface ActionEvent extends Partial<GestureResponderEvent> {
  type:
    | 'delete'
    | 'edit'
    | 'copy'
    | 'reply'
    | 'report'
    | 'undo'
    | 'menu'
    | 'selected'
    | 'badAnswer'
    | 'regenerate'
    | 'chooseText'
    | 'addToFavorites';
  msgId: string;
  messagePosition: 'left' | 'right';
}
export interface ChatListProps {
  onLoad?: (info: { elapsedTimeInMs: number }) => void;
  list: MessageItem[];
  refreshing?: boolean;
  chatModule: ChatModule;
  onAction: (e: ActionEvent) => void;
  lastVideoUrl: string;
  botAvatar?: string;
  userAvatar?: string;
  /**
   * 充值
   */
  onRecharge?: () => void;
  onGameResult?: (gameResult: GameResult) => void;
  onCancelChooseTextItem?: () => void;
  chooseTextItemId?: string;
  moreLoading?: boolean;
  onLoadMoreChatData: () => void;
  onUpdateCacheData?: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  selectedItem?: MessageItem[];
  onSelectedItem?: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  showSelectedBox?: boolean;
}

export interface ChatListRef
  extends Pick<
    FlashListRef<MessageItem>,
    | 'scrollToEnd'
    | 'scrollToIndex'
    | 'scrollToTop'
    | 'scrollToItem'
    | 'scrollToOffset'
    | 'getFirstItemOffset'
    | 'prepareForLayoutAnimationRender'
  > {
  getFirstVisibleIndex: () => number;
  scrollToItemAndHighlight: (params: { item: MessageItem }) => void;
}

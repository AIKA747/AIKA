import { MessageItem } from '@/components/Chat/types';

export interface MessageContextGiftProps {
  messageItem: MessageItem;
  messagePosition?: 'left' | 'right';
}

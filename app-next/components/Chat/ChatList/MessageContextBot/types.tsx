import { MessageItem } from '@/components/Chat/types';

export interface MessageContextBotProps {
  messageItem: MessageItem;
  messagePosition?: 'left' | 'right';
}

import { MessageItem } from '../../types';

export interface MessageContextStoryProps {
  messageItem: MessageItem;
  messagePosition?: 'left' | 'right';
}

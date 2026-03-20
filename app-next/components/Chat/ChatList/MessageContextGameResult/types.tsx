import { GameResult } from '@/pages/Games/Result/types';

import { MessageItem } from '../../types';

export interface MessageContextTextProps {
  messageItem: MessageItem;
  messagePosition: 'left' | 'right';
  onGameStatus?: (gameResult: GameResult) => void;
}

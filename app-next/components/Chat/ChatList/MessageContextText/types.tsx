import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';

import { ChatModule } from '@/hooks/useChatClient';

import { MessageItem } from '../../types';

export interface MessageContextTextProps {
  messageItem: MessageItem;
  messagePosition?: 'left' | 'right';
  chooseTextItemId?: string;
  onCancelChooseTextItem?: () => void;
  chatModule?: ChatModule;
  disabled?: boolean;
  onReplyMsgPress?: (msg: MessageItem) => Promise<void>;
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

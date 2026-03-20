import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';

import { MessageItem } from '@/components/Chat/types';
import { ChatModule } from '@/hooks/useChatClient';

export interface MessageContextImageProps {
  chatModule?: ChatModule;
  messageItem: MessageItem;
  messagePosition?: 'left' | 'right';
  disabled?: boolean;
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

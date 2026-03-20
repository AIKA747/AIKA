import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';

import { MessageItem } from '../../types';

export interface MessageContextVoiceProps {
  messageItem: MessageItem;
  repeat?: number;
  messagePosition?: 'left' | 'right';
  disabled?: boolean;
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

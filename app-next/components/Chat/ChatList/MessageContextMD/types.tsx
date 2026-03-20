import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';

import { MessageItem } from '../../types';

export interface MessageContextTextProps {
  messageItem: MessageItem;
  messagePosition: 'left' | 'right';
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

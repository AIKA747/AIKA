import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';

export interface ContextVoiceProps {
  item: API.CommentDto;
  repeat?: number;
  position?: 'left' | 'right';
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

export interface FileProperty {
  length?: number;
  fileName?: string;
}

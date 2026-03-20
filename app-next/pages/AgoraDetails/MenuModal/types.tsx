import type { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';

export interface ActionEvent extends Partial<GestureResponderEvent> {
  type: 'delete' | 'edit' | 'copy' | 'reply' | 'report' | 'menu';
  id: string | number;
  item?: API.CommentDto;
  itemPosition: 'left' | 'right';
}

export interface MenuModalProps {
  visible: boolean;
  item?: API.CommentDto;
  position: { x?: number; y?: number };
  onAction: (e: ActionEvent) => void;
  onClose: (refresh: boolean) => void;
  itemPosition?: 'left' | 'right';
}

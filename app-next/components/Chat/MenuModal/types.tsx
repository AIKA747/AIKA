import { ActionEvent } from '@/components/Chat/ChatList/types';
import { InputAreaSendData } from '@/components/Chat/InputArea/types';
import { MessageItem } from '@/components/Chat/types';
import { ChatModule } from '@/hooks/useChatClient';

export interface MenuModalProps {
  visible: boolean;
  listItem?: MessageItem;
  chatModule: ChatModule;
  position: { x?: number; y?: number };
  onAction: (e: ActionEvent) => void;
  onClose: (refresh: boolean) => void;
  handleInputSend: (data: InputAreaSendData) => void;
  messagePosition?: 'left' | 'right';
}

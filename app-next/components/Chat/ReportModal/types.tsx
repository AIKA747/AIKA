import { ChatModule } from '@/hooks/useChatClient';

import { MessageItem } from '../types';

export interface PayModalProps {
  visible: boolean;
  listItem?: MessageItem;
  chatModule: ChatModule;
  onClose: (refresh: boolean) => void;
}

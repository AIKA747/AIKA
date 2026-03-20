import { ChatModule } from '@/hooks/useChatClient';
import { postOrderAppGoogleInAppPurchase } from '@/services/googleneigou';
import { postOrderAppInAppPurchase } from '@/services/pingguoneigouIap';

export interface PayModalProps {
  from: 'history' | 'unsubscribe' | 'chat';
  chatModule?: ChatModule;
  visible: boolean;
  onClose: (refresh: boolean) => void;
}

export type PayIAPData = Awaited<
  ReturnType<typeof postOrderAppInAppPurchase | typeof postOrderAppGoogleInAppPurchase>
>['data']['data'];

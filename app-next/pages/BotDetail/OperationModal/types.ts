import { BotDetail } from '@/pages/BotDetail/types';

export type OperationModalProps = {
  bot: BotDetail;
  visible: boolean;
  onClose: (refresh: boolean) => void;
};

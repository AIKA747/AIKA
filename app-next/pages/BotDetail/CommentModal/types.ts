import { BotDetail } from '@/pages/BotDetail/types';

export type CommentModalProps = {
  bot: BotDetail;
  visible: boolean;
  onClose: (refresh: boolean) => void;
};

export interface FormValues {
  rating: number;
  content: string;
}

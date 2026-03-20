import { StoryDetail } from '../types';

import { getContentAppGift } from '@/services/contentService';

export type Gift = NonNullable<Awaited<ReturnType<typeof getContentAppGift>>['data']['data']['list']>[number];

export interface GiftModalProps {
  story: StoryDetail;
  visible: boolean;
  onClose?: (gift?: Gift) => void;
}

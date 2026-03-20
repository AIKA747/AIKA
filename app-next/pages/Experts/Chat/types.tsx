import { getBotAppBotId } from '@/services/jiqirenchaxun';

export type ExpertDetail = Awaited<ReturnType<typeof getBotAppBotId>>['data']['data'];

import { getBotAppBotId } from '@/services/jiqirenchaxun';

export type BotDetail = Awaited<ReturnType<typeof getBotAppBotId>>['data']['data'];

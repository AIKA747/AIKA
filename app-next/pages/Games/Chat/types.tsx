import { getBotAppGameId } from '@/services/youxi';

export type GameDetail = Awaited<ReturnType<typeof getBotAppGameId>>['data']['data'];

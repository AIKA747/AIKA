import { getBotAppSphereBot } from '@/services/spherexin';
import { getBotAppGame } from '@/services/youxi';

export type GameItem =
  | NonNullable<Awaited<ReturnType<typeof getBotAppSphereBot>>>['data']['data']['list'][number]
  | NonNullable<Awaited<ReturnType<typeof getBotAppGame>>>['data']['data']['list'][number];

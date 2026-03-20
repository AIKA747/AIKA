import { getBotAppExploreBots } from '@/services/jiqirenchaxun';
import { getBotAppSphereBot } from '@/services/spherexin';

export type ExpertItem =
  | NonNullable<Awaited<ReturnType<typeof getBotAppSphereBot>>>['data']['data']['list'][number]
  | NonNullable<Awaited<ReturnType<typeof getBotAppExploreBots>>>['data']['data']['list'][number];

import { getContentAppStory } from '@/services/gushichaxun';
import { getBotAppSphereBot } from '@/services/spherexin';

export type FairyTaleItem =
  | NonNullable<Awaited<ReturnType<typeof getBotAppSphereBot>>>['data']['data']['list'][number]
  | NonNullable<Awaited<ReturnType<typeof getContentAppStory>>>['data']['data']['list'][number];

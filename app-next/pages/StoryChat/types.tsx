import { getContentAppStoryId } from '@/services/gushichaxun';

export type StoryDetail = Awaited<ReturnType<typeof getContentAppStoryId>>['data']['data'];

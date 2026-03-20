import { getContentAppStoryId } from '@/services/gushichaxun';

export type StoryDetails = Awaited<ReturnType<typeof getContentAppStoryId>>['data']['data'];

export interface StoryContextProps {
  storyDetail?: StoryDetails;
  fetchStoryDetailAsync?: (id: string) => Promise<StoryDetails>;
  refreshStoryDetailAsync?: (id: string) => Promise<StoryDetails>;
  onClearStory?: () => void;
}

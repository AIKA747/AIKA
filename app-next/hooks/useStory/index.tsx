import { useRequest } from 'ahooks';
import { createContext, PropsWithChildren, useContext } from 'react';

import { StoryContextProps } from '@/hooks/useStory/types';
import { getContentAppStoryId } from '@/services/gushichaxun';

const StoryContext = createContext<StoryContextProps>({});

const StoryProvider = ({ children }: PropsWithChildren) => {
  const {
    data: storyDetail,
    runAsync: fetchStoryDetailAsync,
    refreshAsync: refreshStoryDetailAsync,
    mutate: onClearStoryDetail,
  } = useRequest(
    async (fairyTaleId: string) => {
      const resp = await getContentAppStoryId({ id: fairyTaleId });
      return resp.data.data;
    },
    { manual: true, debounceWait: 300 },
  );
  return (
    <StoryContext.Provider
      value={{
        storyDetail,
        fetchStoryDetailAsync,
        refreshStoryDetailAsync,
        onClearStory: onClearStoryDetail,
      }}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStoryProvider = () => useContext(StoryContext);
export default StoryProvider;

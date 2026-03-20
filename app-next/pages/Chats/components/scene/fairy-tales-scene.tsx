import React, { useMemo, useRef } from 'react';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
import StoryCard from '@/pages/Chats/components/card/story-card';
import { getContentAppStory } from '@/services/gushichaxun';
import pxToDp from '@/utils/pxToDp';

function FairyTalesScene(props: { filter: string }) {
  const { filter } = props;
  const listRef = useRef<ListRef>(null);

  const keyboardHeight = useKeyboardHeight(true);

  const params = useMemo(() => ({ storyName: filter }), [filter]);

  return (
    <List
      ref={listRef}
      contentContainerStyle={{ paddingBottom: keyboardHeight }}
      footerProps={{ noMoreText: '' }}
      params={params}
      request={async (params) => {
        const data = {
          ...params,
          pageNo: params.pageNo,
          statusList: 'PLAYING,FAIL,SUCCESS',
        };
        const resp = await getContentAppStory(data);
        return { data: resp.data.data.list || [], total: resp.data.data.total || 0 };
      }}
      renderItem={({ item, index }) => (
        <StoryCard
          storyDetail={item}
          key={item.id}
          style={index === 0 ? undefined : { borderTopWidth: pxToDp(2), borderTopColor: '#1B1B22' }}
        />
      )}
    />
  );
}

export default React.memo(FairyTalesScene);

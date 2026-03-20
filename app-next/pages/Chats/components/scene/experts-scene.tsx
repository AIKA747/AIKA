import React from 'react';

import List from '@/components/List';
import ExpertCard from '@/pages/Chats/components/card/expert-card';
import { getBotAppChats } from '@/services/huihua';
import pxToDp from '@/utils/pxToDp';

function ExpertsScene(props: { filter: string }) {
  const { filter } = props;

  return (
    <List
      footerProps={{ noMoreText: '' }}
      request={async (params) => {
        const resp = await getBotAppChats({ ...params });
        return { data: resp.data.data.list || [], total: resp.data.data.total || 0 };
      }}
      renderItem={({ item, index }) => (
        <ExpertCard
          botDetail={item}
          key={item.botId}
          style={index === 0 ? undefined : { borderTopWidth: pxToDp(2), borderTopColor: '#1B1B22' }}
        />
      )}
      filter={(list) =>
        filter.trim() ? list.filter((item) => item.botName?.toLowerCase().includes(filter.toLowerCase().trim())) : list
      }
    />
  );
}

export default React.memo(ExpertsScene);

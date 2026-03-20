import React, { useRef } from 'react';
import { View } from 'react-native';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import { useConfigProvider } from '@/hooks/useConfig';
import Item from '@/pages/Profile/CommentsScene/Item';
import { getContentAppUserComment } from '@/services/pinglun';

import styles from './styles';

const CommentsScene = ({ userId }: { userId?: string }) => {
  const { eventEmitter } = useConfigProvider();
  const listRef = useRef<ListRef<API.CommentDto>>(null);
  eventEmitter?.useSubscription((value) => {
    if (value.method === 'refresh-profile-comments') {
      listRef.current?.refresh();
    }
  });

  return (
    <View style={styles.container}>
      <List<API.CommentDto>
        ref={listRef}
        footerProps={{
          noMoreText: '',
        }}
        request={async (params) => {
          const res = await getContentAppUserComment({ ...params, userId: userId! });
          return {
            data: res.data.data.list || [],
            total: res.data.data.total || 0,
          };
        }}
        renderItem={({ item }) => <Item item={item} />}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
    </View>
  );
};

export default React.memo(CommentsScene);

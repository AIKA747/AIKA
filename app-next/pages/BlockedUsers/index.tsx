import { useRef } from 'react';
import { useIntl } from 'react-intl';
import { View } from 'react-native';

import List from '@/components/List';
import type { ListRef } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { useConfigProvider } from '@/hooks/useConfig';
import { getUserAppUserBlockedUser } from '@/services/yonghupingbi';
import pxToDp from '@/utils/pxToDp';

import UserItem from './UserItem';

export default function BlockedUsers() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const listRef = useRef<ListRef>(null);
  return (
    <PageView style={{ flex: 1 }}>
      <NavBar title={intl.formatMessage({ id: 'Setting.BlockedUsers' })} />
      <List
        ref={listRef}
        footerProps={{
          noMoreText: '',
          moreText: '',
        }}
        request={async () => {
          const res = await getUserAppUserBlockedUser({});
          return {
            data: res.data.data?.list || [],
            total: res.data?.data?.total || 0,
          };
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              backgroundColor: computedThemeColor.bg_secondary,
              height: pxToDp(2),
              width: '100%',
            }}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: pxToDp(32) }}
        renderItem={({ item }) => {
          return <UserItem item={item as any} onRefresh={() => listRef.current?.refresh()} />;
        }}
      />
    </PageView>
  );
}

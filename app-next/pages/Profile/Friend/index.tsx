import { useRequest } from 'ahooks';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { View } from 'react-native';

import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import TabView from '@/components/TabView';
import UserList from '@/pages/Profile/Friend/UserList';
import { getContentAppUserStatistics } from '@/services/gerenzhongxin';
import { formatCompactNumber } from '@/utils/formatCompactNumber';

import styles from './styles';

export default function Friend() {
  const { title, type, userId } = useLocalSearchParams<{
    userId?: string;
    type: string;
    title: string;
  }>();
  const intl = useIntl();
  const [selectedIndex] = useState(() => ['following', 'follower'].findIndex((x) => x === type));
  const { loading, data, refresh } = useRequest(() => getContentAppUserStatistics({ userId }), {
    debounceWait: 300,
    refreshDeps: [userId],
  });
  const statistics = useMemo(
    () =>
      data?.data.data || {
        storyTotal: 0,
        followersTotal: 0,
        followingTotal: 0,
        postTotal: 0,
        commentTotal: 0,
        friendTotal: 0,
      },
    [data],
  );

  const routes = useMemo(() => {
    const _routes = [
      {
        key: 'Following',
        title: `${intl.formatMessage({ id: 'Following' })} ${statistics.followingTotal > 0 ? formatCompactNumber(Number(statistics?.followingTotal)) : ''}`,
        scene: () => <UserList loading={loading} type="following" userId={userId} onRefreshStatistics={refresh} />,
      },
      {
        key: 'Followers',
        title: `${intl.formatMessage({ id: 'Followers' })} ${statistics.followersTotal > 0 ? formatCompactNumber(Number(statistics.followersTotal)) : ''}`,
        scene: () => <UserList loading={loading} type="follower" userId={userId} onRefreshStatistics={refresh} />,
      },
    ];
    if (!userId) {
      _routes.push(
        {
          key: 'Friends',
          title: `${intl.formatMessage({ id: 'Friends' })} ${statistics.friendTotal > 0 ? formatCompactNumber(Number(statistics.friendTotal)) : ''}`,
          scene: () => <UserList loading={loading} type="friend" userId={userId} onRefreshStatistics={refresh} />,
        },
        {
          key: 'Recommendations',
          title: intl.formatMessage({ id: 'Recommendations' }),
          scene: () => <UserList loading={loading} type="recommendations" onRefreshStatistics={refresh} />,
        },
      );
    }
    return _routes;
  }, [intl, statistics.followingTotal, statistics.followersTotal, statistics.friendTotal, userId, loading, refresh]);

  return (
    <PageView style={styles.page}>
      <NavBar title={title} />
      <View style={styles.container}>
        <TabView
          index={selectedIndex}
          tabStyle={userId === undefined ? { width: 'auto' } : {}}
          scrollEnabled={userId === undefined}
          selectedColor="#ffffff"
          routes={routes}
        />
      </View>
    </PageView>
  );
}

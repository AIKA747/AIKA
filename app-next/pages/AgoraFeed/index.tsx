import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FloatingActionButton from '@/components/FloatingActionButton';
import { BellOutline, GalleryOutline, PlushFilled, SearchOutline, VideoOutline } from '@/components/Icon';
import TabView from '@/components/TabView';
import Toast from '@/components/Toast';
import { useConfigProvider } from '@/hooks/useConfig';
import { Theme } from '@/hooks/useConfig/types';
import { getUserAppNotificationUnreadNum } from '@/services/zhanneitongzhixiaoxi';
import pxToDp from '@/utils/pxToDp';

import Feed from './components/Feed';
import Follow from './components/Follow';
import Private from './components/Private';
import styles from './styles';

export default function AgoraFeed() {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const localSearchParams = useLocalSearchParams<{ postPublished: string }>();
  const { computedThemeColor, computedTheme, setRefreshConfig } = useConfigProvider();

  const { data: unreadNum, refresh } = useRequest(
    async () => {
      const res = await getUserAppNotificationUnreadNum({});
      return res?.data?.data;
    },
    { debounceWait: 300 },
  );

  const handlePublishAlert = useCallback(() => {
    Toast.success(intl.formatMessage({ id: 'agora.index.published' }));
    setTimeout(() => {
      refresh();
      setRefreshConfig((v) => {
        return {
          ...v,
          homePage: {
            ...v?.homePage,
            feedRefresh: true,
            followRefresh: true,
            privateRefresh: true,
          },
        };
      });
    }, 500);
  }, [intl, refresh, setRefreshConfig]);

  useEffect(() => {
    if (localSearchParams.postPublished !== '1') return;
    handlePublishAlert();
    router.setParams({ postPublished: '0' });
  }, [handlePublishAlert, localSearchParams.postPublished]);

  useFocusEffect(refresh);

  const routes = useMemo(
    () => [
      { key: 'Feed', title: intl.formatMessage({ id: 'agora.index.feed' }), scene: Feed },
      { key: 'Follow', title: intl.formatMessage({ id: 'agora.index.follow' }), scene: Follow },
      { key: 'Private', title: intl.formatMessage({ id: 'agora.index.private' }), scene: Private },
    ],
    [intl],
  );

  return (
    <View style={[styles.page, { paddingTop: insets.top, backgroundColor: computedThemeColor.bg_primary }]}>
      <View style={styles.topBox}>
        <View style={styles.quickPostBox}>
          <Image source={require('@/assets/images/logo.png')} style={{ width: pxToDp(138), height: pxToDp(38) }} />
        </View>
        <TouchableOpacity
          onPress={() => {
            router.push('/main/agoraSearch');
          }}
          style={styles.searchBtn}>
          <SearchOutline
            style={styles.searchBtnIcon}
            width={pxToDp(40)}
            height={pxToDp(40)}
            color={computedTheme === Theme.LIGHT ? '#D5D5D5' : '#80878E'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push('/main/notifications');
          }}
          style={styles.notificationBtn}>
          <BellOutline
            style={styles.bellBtnIcon}
            width={pxToDp(40)}
            height={pxToDp(40)}
            color={computedTheme === Theme.LIGHT ? '#D5D5D5' : '#80878E'}
          />
          {unreadNum ? <View style={styles.bellDot} /> : undefined}
        </TouchableOpacity>
      </View>
      <TabView routes={routes} selectedColor="#fff" />
      <FloatingActionButton
        icon={<PlushFilled width={pxToDp(34)} height={pxToDp(34)} color="#ffffff" />}
        items={[
          {
            icon: <GalleryOutline color="#fff" />,
            color: '#301190',
            onPress: () => {
              router.push({
                pathname: '/main/agoraPostPublish',
                params: { type: 'image' },
              });
            },
          },
          {
            icon: <VideoOutline color="#fff" />,
            color: '#C60C93',
            onPress: () => {
              router.push({
                pathname: '/main/agoraPostPublish',
                params: { type: 'video' },
              });
            },
          },
        ]}
      />
    </View>
  );
}

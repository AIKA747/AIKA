import { useRequest } from 'ahooks';
import { router } from 'expo-router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';

import Avatar from '@/components/Avatar';
import { LoadingOutline } from '@/components/Icon';
import Toast from '@/components/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { getContentAppPostThumbUserList, postContentAppFollowRelation } from '@/services/agoraxin';
import pxToDp from '@/utils/pxToDp';

const ThumbUserItem = ({
  item,
  onClose,
  refetch,
}: {
  item: Awaited<ReturnType<typeof getContentAppPostThumbUserList>>['data']['data']['list'][number];
  onClose?: () => void;
  refetch: () => void;
}) => {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const { userInfo } = useAuth();
  const [currentItem, setCurrentItem] = useState(item);

  const { run, loading } = useRequest(
    async () => {
      const followingId = currentItem.userId as any;
      try {
        const res = await postContentAppFollowRelation({
          followingId,
          type: 'USER',
          actionType: currentItem.followed ? 'DELETE' : 'ADD',
        });
        if (res.data?.code !== 0) {
          return Toast.error(res.data?.msg || intl.formatMessage({ id: 'failed' }));
        }
        setCurrentItem({
          ...currentItem,
          followed: !currentItem.followed,
        });
        refetch?.();
      } catch (err) {
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    { manual: true, debounceWait: 300, refreshDeps: [currentItem] },
  );
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        onClose?.();
        router.push({ pathname: '/main/user-profile/[userId]', params: { userId: currentItem.userId } });
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: pxToDp(24),
      }}>
      <View style={{ flexDirection: 'row', flex: 1, gap: pxToDp(24) }}>
        <Avatar img={currentItem.avatar} size={88} shape="square" />
        <View style={{ flex: 1, gap: pxToDp(10) }}>
          <Text style={{ fontSize: pxToDp(32), color: computedThemeColor.text }} ellipsizeMode="tail" numberOfLines={1}>
            {currentItem.nickname}
          </Text>
          <Text
            style={{ fontSize: pxToDp(24), color: computedThemeColor.text_secondary }}
            ellipsizeMode="tail"
            numberOfLines={1}>
            @{currentItem.username}
          </Text>
        </View>
      </View>
      <View>
        {!currentItem.followed && userInfo?.userId !== currentItem.userId && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={run}
            disabled={loading}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: computedThemeColor.primary,
              borderWidth: pxToDp(2),
              borderRadius: pxToDp(10),
              padding: pxToDp(10),
              paddingHorizontal: pxToDp(24),
              gap: pxToDp(8),
            }}>
            {loading ? (
              <LoadingOutline width={pxToDp(32)} height={pxToDp(32)} color={computedThemeColor.primary} />
            ) : undefined}
            <Text
              style={{
                color: computedThemeColor.primary,
                fontSize: pxToDp(28),
                lineHeight: pxToDp(32),
              }}>
              {intl.formatMessage({ id: 'follow' })}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ThumbUserItem;

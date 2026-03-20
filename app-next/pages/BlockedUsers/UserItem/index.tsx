import { useRequest } from 'ahooks';
import { router } from 'expo-router';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';

import Avatar from '@/components/Avatar';
import Toast from '@/components/Toast';
import { useConfigProvider } from '@/hooks/useConfig';
import { getUserAppUserBlockedUser, putUserAppUserUnBlockUserId } from '@/services/yonghupingbi';
import pxToDp from '@/utils/pxToDp';

export default function UserItem({
  item,
  onRefresh,
}: {
  item: Awaited<ReturnType<typeof getUserAppUserBlockedUser>>['data']['data']['list'][number];
  onRefresh?: () => void;
}) {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  const { run, loading } = useRequest(
    async () => {
      try {
        const res = await putUserAppUserUnBlockUserId({ userId: item.userId + '' });
        if (res.data?.code !== 0) {
          return Toast.error(res.data?.msg || intl.formatMessage({ id: 'failed' }));
        }
        onRefresh?.();
      } catch (err) {
        console.log('err', err);
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    { manual: true, debounceWait: 300, refreshDeps: [item, onRefresh] },
  );
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: pxToDp(24),
        gap: pxToDp(24),
      }}
      onPress={() => {
        router.push({
          pathname: '/main/user-profile/[userId]',
          params: { userId: item.userId },
        });
      }}>
      <View style={{ flexDirection: 'row', gap: pxToDp(24), flex: 1 }}>
        <Avatar img={item.avatar} size={100} shape="square" />
        <View style={{ gap: pxToDp(10), flex: 1 }}>
          <Text style={{ fontSize: pxToDp(32), color: computedThemeColor.text }} numberOfLines={1}>
            {item.nickname}
          </Text>
          <Text style={{ fontSize: pxToDp(24), color: computedThemeColor.text_secondary }} numberOfLines={1}>
            @{item.username}
          </Text>
        </View>
      </View>
      <View>
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
          <Text
            style={{
              color: computedThemeColor.primary,
              fontSize: pxToDp(28),
              lineHeight: pxToDp(32),
            }}>
            {intl.formatMessage({ id: 'UserProfile.ChooseAction.Options.Unblock' })}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useIntl } from 'react-intl';
import { View, TouchableOpacity, Text } from 'react-native';

import Toast from '@/components/Toast';
import { defaultCover } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { getContentAppAuthor, postContentAppFollowRelation } from '@/services/agoraxin';
import { deleteBotAppBotIdUnsubscribe } from '@/services/dingyuejiqiren';
import s3ImageTransform from '@/utils/s3ImageTransform';

import { PeopleStyles } from './styles';

function UserItem(props: {
  item: Awaited<ReturnType<typeof getContentAppAuthor>>['data']['data']['list'][number];
  handleUpdate: (id: number, followed: boolean) => void;
  onRefetch?: () => void;
}) {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const { userInfo } = useAuth();
  const { item, handleUpdate, onRefetch } = props;

  const { run } = useRequest(
    async () => {
      const followingId = item.userId as any;
      try {
        const res = item.followed
          ? item.type === 'BOT'
            ? await deleteBotAppBotIdUnsubscribe({ id: followingId })
            : await postContentAppFollowRelation({
                followingId,
                type: item.type,
                actionType: 'DELETE',
              })
          : await postContentAppFollowRelation({ followingId, type: item.type, actionType: 'ADD' });
        if (res.data?.code !== 0) {
          return Toast.error(res.data?.msg || intl.formatMessage({ id: 'failed' }));
        }
        handleUpdate(item.id, !item.followed);
      } catch (err) {
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    { manual: true, debounceWait: 300, refreshDeps: [onRefetch, item] },
  );

  return (
    <TouchableOpacity
      key={item.id}
      style={[PeopleStyles.item, { backgroundColor: '#1B1B22' }]}
      onPress={() => {
        if (item.type === 'USER') {
          if (item.userId === userInfo?.userId) router.push('/profile');
          else
            router.push({
              pathname: '/main/user-profile/[userId]',
              params: { userId: item.userId },
            });
        } else if (item.type === 'BOT') {
          router.push({ pathname: '/main/botDetail', params: { botId: item.userId } });
        }
      }}>
      <View
        style={[
          PeopleStyles.itemAvatar,
          {
            borderColor: item.followed ? '#A07BED' : 'transparent',
          },
        ]}>
        <Image
          style={[PeopleStyles.itemAvatarImage, { backgroundColor: '#ccc' }]}
          source={s3ImageTransform(item.avatar, 'small')}
          contentFit="cover"
          placeholder={defaultCover}
          placeholderContentFit="cover"
        />
      </View>
      <View style={[PeopleStyles.itemInfo]}>
        <Text style={[PeopleStyles.itemInfoName, { color: computedThemeColor.text }]} numberOfLines={1}>
          {item.nickname}
        </Text>
        <Text style={[PeopleStyles.itemInfoId, { color: '#80878E' }]} numberOfLines={1}>
          @{item.username}
        </Text>
      </View>
      <View style={[PeopleStyles.itemButtons]}>
        <TouchableOpacity
          onPress={run}
          style={[
            PeopleStyles.itemButtonsButton,
            {
              borderColor: computedThemeColor.primary,
              backgroundColor: item.followed ? computedThemeColor.primary : undefined,
            },
          ]}>
          <Text
            style={[
              PeopleStyles.itemButtonsButtonText,
              { color: item.followed ? '#fff' : computedThemeColor.primary },
            ]}>
            {intl.formatMessage({ id: item.followed ? 'unfollow' : 'follow' })}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
export default UserItem;

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

import { UsersStyles } from './styles';

function UserItem(props: {
  item: Awaited<ReturnType<typeof getContentAppAuthor>>['data']['data']['list'][number];
  handleUpdate: (id: number, followed: boolean) => void;
  onRefetch?: () => void;
}) {
  const { item, handleUpdate, onRefetch } = props;
  const intl = useIntl();
  const { userInfo } = useAuth();
  const { computedThemeColor } = useConfigProvider();

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
        if (item?.followed || item.type === 'BOT') handleUpdate(item.id, !item.followed);
        else onRefetch?.(); // Toast.info(intl.formatMessage({ id: 'user.followTip' }));
      } catch (err) {
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    { manual: true, debounceWait: 300, refreshDeps: [onRefetch, item] },
  );

  return (
    <View key={item.id} style={UsersStyles.item}>
      <TouchableOpacity
        key={item.id}
        style={[UsersStyles.item]}
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
            UsersStyles.itemAvatar,
            {
              // TODO 是否有新帖子
              // borderColor: item.followed ? '#A07BED' : '#fff',
              borderColor: computedThemeColor.bg_primary,
            },
          ]}>
          <Image
            style={[
              UsersStyles.itemAvatarImage,
              {
                backgroundColor: '#ccc',
              },
            ]}
            source={s3ImageTransform(item.avatar, 'small')}
            contentFit="cover"
            placeholder={defaultCover}
            placeholderContentFit="cover"
          />
        </View>
        <View style={[UsersStyles.itemInfo]}>
          <Text
            style={[
              UsersStyles.itemInfoName,
              {
                color: computedThemeColor.text,
              },
            ]}
            numberOfLines={1}>
            {item.nickname}
          </Text>
          <Text
            style={[
              UsersStyles.itemInfoId,
              {
                color: '#80878E',
              },
            ]}
            numberOfLines={1}>
            @{item.username}
          </Text>
        </View>
        <View style={[UsersStyles.itemButtons]}>
          <TouchableOpacity
            onPress={run}
            style={[
              UsersStyles.itemButtonsButton,
              {
                borderColor: computedThemeColor.primary,
                backgroundColor: item.followed ? computedThemeColor.primary : undefined,
              },
            ]}>
            <Text
              style={[
                UsersStyles.itemButtonsButtonText,
                {
                  color: item.followed ? '#fff' : computedThemeColor.primary,
                },
              ]}>
              {intl.formatMessage({ id: item.followed ? 'unfollow' : 'follow' })}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default UserItem;

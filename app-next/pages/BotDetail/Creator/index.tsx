import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useIntl } from 'react-intl';
import { View, Text } from 'react-native';

import Button from '@/components/Button';
import { placeholderUser } from '@/constants';
import { getGenderObj } from '@/constants/Gender';
import { Gender } from '@/constants/types';
import { getUserAppUserId } from '@/services/userService';

import styles from './styles';

export default function Creator({ userId }: { userId: string }) {
  const intl = useIntl();
  const { data: creatorInfo, loading } = useRequest(async () => {
    const resp = await getUserAppUserId({
      id: userId,
    });
    if (resp.data.code !== 0) {
      // 用户不存在等错误
      return null;
    }

    return resp.data.data;
  });

  if (!loading && !creatorInfo) {
    return (
      <View style={[styles.creator]}>
        <Text style={[styles.creatorErrorText]}>{intl.formatMessage({ id: 'bot.detail.creator.deregistered' })}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.creator]}>
      <View style={[styles.creatorTop]}>
        <View style={[styles.creatorTopLeft]}>
          <Image
            style={[styles.creatorTopLeftAvatar]}
            source={creatorInfo?.avatar || placeholderUser}
            contentFit="cover"
          />
          <View style={[styles.creatorTopInfo]}>
            <View style={[styles.creatorTopLeftInfoWarper]}>
              <Text style={[styles.creatorTopLeftInfoName]} numberOfLines={1} ellipsizeMode="tail">
                {creatorInfo?.username}
              </Text>
              <Text style={[styles.creatorTopLeftInfoGender]}>
                {getGenderObj()[creatorInfo?.gender as Gender] || ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.creatorTopBots]}>
          <Text style={[styles.creatorTopBotsText1]}>{creatorInfo?.botTotal} </Text>
          <Text style={[styles.creatorTopBotsText2]}>{intl.formatMessage({ id: 'Bots' })}</Text>
        </View>
        <Button
          type="default"
          size="small"
          onPress={() => {
            router.push({
              pathname: '/main/user-profile/[userId]',
              params: { userId },
            });
          }}>
          {intl.formatMessage({ id: 'View' })}
        </Button>
      </View>
    </View>
  );
}

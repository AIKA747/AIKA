import { router } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import Avatar from '@/components/Avatar';
import { placeholderUser } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { formatDateTime } from '@/utils/formatDateTime';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { TitleProps } from './types';

const Title = ({ post }: TitleProps) => {
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const { userInfo } = useAuth();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (post?.type === 'USER') {
          if (post?.author === userInfo?.userId) router.push('/profile');
          else router.push({ pathname: '/main/user-profile/[userId]', params: { userId: post.author } });
        } else if (post?.type === 'BOT') {
          router.push({ pathname: '/main/botDetail', params: { botId: post.author } });
        }
      }}
      style={[styles.container]}>
      <View style={[styles.left]}>
        <Avatar style={styles.avatar} img={post?.avatar} placeholder={placeholderUser} shape="square" />
        <View
          style={{
            flex: 1,
            marginHorizontal: pxToDp(12 * 2),
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <Text
            style={[
              styles.name,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {post?.nickname || ''}
          </Text>
          <Text style={[styles.date, { color: computedTheme === Theme.LIGHT ? computedThemeColor.text : '#80878E' }]}>
            {formatDateTime(post?.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Title;

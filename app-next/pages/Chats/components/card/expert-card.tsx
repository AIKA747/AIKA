import { router } from 'expo-router';
import React from 'react';
import { View, Text, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';

import Avatar from '@/components/Avatar';
import { getBotAppChats } from '@/services/huihua';
import pxToDp from '@/utils/pxToDp';

import styles from '../../styles';

function ExpertCard(props: {
  style?: StyleProp<ViewStyle>;
  botDetail: Awaited<ReturnType<typeof getBotAppChats>>['data']['data']['list'][number];
}) {
  const { style, botDetail } = props;

  return (
    <TouchableOpacity
      style={[{ flexDirection: 'row', padding: pxToDp(32) }, style]}
      onPress={() => {
        router.push({
          pathname: '/main/experts/chat/[expertId]',
          params: {
            expertId: botDetail.botId,
          },
        });
      }}>
      <Avatar img={botDetail.botAvatar} shape="square" size={128} />
      <View style={styles.textInfo}>
        <Text style={[styles.name, { color: '#fff' }]}>{botDetail?.botName}</Text>
        <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.desc, { color: '#fff' }]}>
          {botDetail.botIntroduce}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(ExpertCard);

import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import Avatar from '@/components/Avatar';
import { RadioCheckTwoTone } from '@/components/Icon';
import { useConfigProvider } from '@/hooks/useConfig';
import { Member } from '@/pages/GroupChat/Create/index';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

function UserCard(props: { data: Member; onSelect: (member: Member) => void; selected: boolean; selectable: boolean }) {
  const { computedThemeColor: theme } = useConfigProvider();

  const { data, selectable = false, selected = false } = props;

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.userCard}
        onPress={() => router.push({ pathname: '/main/user-profile/[userId]', params: { userId: data.userId } })}>
        <Avatar img={data.avatar} size={88} style={{ borderRadius: pxToDp(16) }} />
        <View style={styles.userInfo}>
          <Text numberOfLines={1} style={[styles.nickname, { color: theme.text }]}>
            {data.nickname}
          </Text>

          <View style={{ flexDirection: 'row' }}>
            <Text numberOfLines={1} style={[styles.username, { color: theme.text_secondary }]}>
              @{data.username}
            </Text>
          </View>
        </View>

        {selectable ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => props.onSelect(data)}
            style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
            <RadioCheckTwoTone
              style={{ marginLeft: pxToDp(20), right: pxToDp(2) }}
              color={theme.text_pink}
              twoToneColor={theme.text}
              checked={selected}
            />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      <View style={[styles.userCardBottomLine, { backgroundColor: theme.bg_secondary }]} />
    </View>
  );
}
export default React.memo(UserCard);

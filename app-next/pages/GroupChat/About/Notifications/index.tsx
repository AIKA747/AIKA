import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity } from 'react-native';

import { RadioCheckTwoTone } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { putBotAppChatroomMemberNotificationOff } from '@/services/qunchengyuanqunliaoshezhi';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

enum NotificationType {
  ONE_HOUR = 'ONE_HOUR',
  EIGHT_HOUR = 'EIGHT_HOUR',
  ONE_DAY = 'ONE_DAY',
  ONE_WEEK = 'ONE_WEEK',
  ALWAYS = 'ALWAYS',
}
export default function AboutGroupChatNotifications() {
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const { refreshChatRoomDetail, chatRoomDetail } = useGroupChatProvider();
  const intl = useIntl();
  const { roomId } = useLocalSearchParams<{
    roomId: string; // 群ID
  }>();
  const [options, setOptions] = useState<{ label: string; value: NotificationType; checked: boolean }[]>([
    {
      label: `1 ${intl.formatMessage({ id: 'AboutChat.NotificationsOptions.Hour' })}`,
      value: NotificationType.ONE_HOUR,
      checked: false,
    },
    {
      label: `8 ${intl.formatMessage({ id: 'AboutChat.NotificationsOptions.Hours' })}`,
      value: NotificationType.EIGHT_HOUR,
      checked: false,
    },
    {
      label: `1 ${intl.formatMessage({ id: 'AboutChat.NotificationsOptions.Day' })}`,
      value: NotificationType.ONE_DAY,
      checked: false,
    },
    {
      label: `1 ${intl.formatMessage({ id: 'AboutChat.NotificationsOptions.Week' })}`,
      value: NotificationType.ONE_WEEK,
      checked: false,
    },
    {
      label: intl.formatMessage({ id: 'AboutChat.NotificationsOptions.Always' }),
      value: NotificationType.ALWAYS,
      checked: false,
    },
  ]);
  const handleChange = useCallback(
    (value: NotificationType) => {
      putBotAppChatroomMemberNotificationOff({
        roomId: Number(roomId),
        notifyTurnOff: value,
      }).then((res) => {
        if (res?.data.code === 0) {
          refreshChatRoomDetail();
          setOptions((v) => {
            return v.map((opt) => {
              opt.checked = opt.value === value;
              return opt;
            });
          });
        }
      });
    },
    [refreshChatRoomDetail, roomId],
  );

  useEffect(() => {
    if (chatRoomDetail?.notifyTurnOff) {
      setOptions((v) => {
        return v.map((opt) => {
          opt.checked = opt.value === chatRoomDetail?.notifyTurnOff;
          return opt;
        });
      });
    }
  }, [chatRoomDetail]);

  return (
    <PageView style={styles.page}>
      <NavBar
        theme={computedTheme}
        title={intl.formatMessage({ id: 'AboutChat.Notifications' })}
        style={[{ backgroundColor: '#ffffff00' }]}
      />
      <View style={[styles.card]}>
        <View style={[styles.cardHeader]}>
          <Text style={[styles.cardSubtitle]}>{intl.formatMessage({ id: 'AboutChat.NotificationsInfo' })}</Text>
        </View>
        {options.map((opt, index) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.optionItem, { borderColor: index >= options.length - 1 ? 'transparent' : '#25212E' }]}
            onPress={() => {
              if (!opt.checked) {
                handleChange(opt.value);
              }
            }}>
            <Text
              style={{
                fontSize: pxToDp(16 * 2),
                color: computedThemeColor.text,
              }}>
              {opt.label}
            </Text>
            <RadioCheckTwoTone
              color={opt.checked ? computedThemeColor.text_pink : computedThemeColor.text_secondary}
              twoToneColor="#fff"
              width={pxToDp(24 * 2)}
              height={pxToDp(24 * 2)}
              checked={opt.checked}
            />
          </TouchableOpacity>
        ))}
      </View>
    </PageView>
  );
}

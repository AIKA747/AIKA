import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity } from 'react-native';

import { RadioCheckTwoTone } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { putBotAppChatroomHistoryVisible } from '@/services/guanliyuanqunliaoshezhijiekou';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function AboutGroupChatHistory() {
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const intl = useIntl();
  const { roomId, historyMsgVisibility } = useLocalSearchParams<{
    roomId: string;
    historyMsgVisibility: string;
  }>();
  const { refreshChatRoomDetail } = useGroupChatProvider();
  const [options, setOptions] = useState<{ label: string; value: string; checked: boolean }[]>([
    {
      label: intl.formatMessage({ id: 'AboutChat.HistoryOptions.Visible' }),
      value: 'visible',
      checked: historyMsgVisibility === 'true',
    },
    {
      label: intl.formatMessage({ id: 'AboutChat.HistoryOptions.Hidden' }),
      value: 'hidden',
      checked: historyMsgVisibility === 'false',
    },
  ]);
  const handleChange = useCallback(
    (value: string) => {
      putBotAppChatroomHistoryVisible({
        id: Number(roomId),
        historyMsgVisibility: value === 'visible',
      }).then((res) => {
        if (res?.data?.code === 0) {
          refreshChatRoomDetail();
          setOptions((v) => {
            return v.map((opt) => {
              opt.checked = value === opt.value;
              return opt;
            });
          });
        }
      });
    },
    [refreshChatRoomDetail, roomId],
  );

  return (
    <PageView style={styles.page}>
      <NavBar
        theme={computedTheme}
        title={intl.formatMessage({ id: 'AboutChat.History' })}
        style={[{ backgroundColor: '#ffffff00' }]}
      />
      <View style={[styles.card]}>
        <View style={[styles.cardHeader]}>
          <Text style={[styles.cardSubtitle]}>{intl.formatMessage({ id: 'AboutChat.HistoryInfo' })}</Text>
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

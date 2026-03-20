import { useRequest } from 'ahooks';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { ActivityIndicator, FlatList, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { CheckOutlined } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { ChatThemeType } from '@/pages/GroupChat/About/Theme/type';
import { putBotAppChatroomTheme } from '@/services/qunchengyuanqunliaoshezhi';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function AboutGroupChatColor() {
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const { width } = useWindowDimensions();
  const intl = useIntl();
  const { refreshChatRoomDetail } = useGroupChatProvider();
  const { roomId, color } = useLocalSearchParams<{
    roomId: string;
    color: string;
  }>();

  const numColumns = 3; // 定义列数
  const spacing = 24; // 间距
  const itemSize = (width - (numColumns + 1) * pxToDp(spacing)) / numColumns;
  const { loading, runAsync } = useRequest(putBotAppChatroomTheme, {
    manual: true,
    debounceWait: 300,
  });
  const [selected, setSelected] = useState<string>(color);
  const [loadingKey, setLoadingKey] = useState<number>();

  return (
    <PageView style={styles.page}>
      <NavBar
        theme={computedTheme}
        title={intl.formatMessage({ id: 'AboutChat.Colors' })}
        style={[{ backgroundColor: '#ffffff00' }]}
      />
      <FlatList
        style={[styles.colors]}
        data={[
          '#C1EAF2',
          '#B6FFF9',
          '#9DE5FF',
          '#FEFFDB',
          '#F8F1D0',
          '#F6E97F',
          '#FFE2FF',
          '#DEC8ED',
          '#DE88A5',
          '#CAF2D7',
          '#A0F6D2',
          '#CCE490',
        ]}
        numColumns={3}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.colorItem,
              selected === item ? styles.selectedColor : styles.colorItem,
              {
                width: itemSize,
                height: itemSize * 1.57,
                margin: pxToDp(spacing) / 2,
                backgroundColor: item,
              },
            ]}
            onPress={() => {
              setLoadingKey(index);
              runAsync({
                type: ChatThemeType.Color,
                gallery: '',
                roomId: Number(roomId),
                color: item,
              }).then((res) => {
                refreshChatRoomDetail();
                setSelected(item);
                setLoadingKey(undefined);
              });
            }}>
            {loading && loadingKey === index && <ActivityIndicator color={computedThemeColor.primary} />}
            {selected === item && (
              <View style={[styles.checkbox]}>
                <CheckOutlined color="#D9D9D9" width={pxToDp(36)} height={pxToDp(36)} />
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </PageView>
  );
}

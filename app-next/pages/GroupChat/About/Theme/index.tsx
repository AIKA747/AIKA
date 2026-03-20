import { useRequest } from 'ahooks';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { FlatList, Text, TouchableOpacity, useWindowDimensions, View, Image, ActivityIndicator } from 'react-native';

import { ArrowRightOutline, CheckOutlined } from '@/components/Icon';
import getImage from '@/components/ImagePIcker/utils/getImage';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { ChatThemeType } from '@/pages/GroupChat/About/Theme/type';
import { putBotAppChatroomTheme } from '@/services/qunchengyuanqunliaoshezhi';
import { compressFileToTargetSize } from '@/utils/compressFiletoTargetSize';
import pxToDp from '@/utils/pxToDp';
import uploadAsync from '@/utils/uploadAsync';

import styles from './styles';

const localData = [
  require('@/assets/images/chat/bg/6.png'),
  require('@/assets/images/chat/bg/1.png'),
  require('@/assets/images/chat/bg/2.png'),
  require('@/assets/images/chat/bg/3.png'),
  require('@/assets/images/chat/bg/4.png'),
  require('@/assets/images/chat/bg/5.png'),
];
export default function AboutGroupChatTheme() {
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const { width } = useWindowDimensions();
  const intl = useIntl();
  const { refreshAsyncChatRoomDetail } = useGroupChatProvider();
  const { roomId, theme = '{}' } = useLocalSearchParams<{
    roomId: string;
    theme: string;
  }>();
  const { runAsync } = useRequest(putBotAppChatroomTheme, { manual: true, debounceWait: 300 });
  const currentTheme = JSON.parse(theme);
  const [themeChanging, setThemeChanging] = useState<boolean>(false);

  const handleGallery = useCallback(async () => {
    try {
      const res = await getImage({ value: [], maxLength: 1, mediaType: 'images', aspect: [2, 3] }); // prettier-ignore
      if (!res?.assets?.[0]?.uri) return;
      setThemeChanging(true);
      const fileUrl = await compressFileToTargetSize(res.assets[0].uri, 2);
      const avatar = await uploadAsync({ fileUrl });
      await runAsync({
        type: ChatThemeType.Gallery,
        gallery: avatar,
        roomId: Number(roomId),
        color: '',
      });
      refreshAsyncChatRoomDetail();
    } catch {
      Toast.error(intl.formatMessage({ id: 'failed' }));
    } finally {
      setThemeChanging(false);
    }
  }, [intl, refreshAsyncChatRoomDetail, roomId, runAsync]);

  const options = useMemo(
    () => [
      {
        name: intl.formatMessage({ id: 'AboutChat.ThemeOptions.Gallery' }),
        type: 'Gallery',
        onPress: handleGallery,
      },
      {
        name: intl.formatMessage({ id: 'AboutChat.ThemeOptions.Color' }),
        type: 'Color',
        link: '/main/aboutChatColor',
        params: { roomId, color: currentTheme.color },
      },
    ],
    [intl, handleGallery, roomId, currentTheme.color],
  );

  const numColumns = 3; // 定义列数
  const spacing = 24; // 间距
  const itemSize = (width - (numColumns + 1) * pxToDp(spacing)) / numColumns;

  const [selectedTheme, setSelectedTheme] = useState<number>(0);

  useEffect(() => {
    if (currentTheme.type === ChatThemeType.Local && selectedTheme === 0) {
      setSelectedTheme(localData.findIndex((x) => x === Number(currentTheme.gallery)) + 1);
    }
  }, [currentTheme, selectedTheme]);

  return (
    <PageView style={styles.page}>
      <NavBar
        theme={computedTheme}
        title={intl.formatMessage({ id: 'AboutChat.Theme' })}
        style={[{ backgroundColor: '#ffffff00' }]}
      />
      <View style={[styles.card]}>
        {options.map((opt, index) => (
          <TouchableOpacity
            key={opt.name}
            style={[styles.optionItem, { borderColor: index >= 1 ? 'transparent' : '#25212E' }]}
            onPress={() => {
              if (opt.link) {
                router.push({
                  pathname: opt.link as any,
                  params: opt.params,
                });
              }
              if (opt.onPress) {
                opt.onPress();
              }
            }}>
            <Text
              style={{
                fontSize: pxToDp(16 * 2),
                color: computedThemeColor.text,
              }}>
              {opt.name}
            </Text>
            {themeChanging && opt.type === 'Gallery' ? (
              <ActivityIndicator color={computedThemeColor.primary} />
            ) : (
              <ArrowRightOutline width={pxToDp(32)} height={pxToDp(32)} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        style={[styles.themes]}
        data={localData}
        numColumns={3}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.themeItem,
              { width: itemSize, height: itemSize * 1.57, margin: pxToDp(spacing) / 2 },
              index + 1 === selectedTheme ? styles.selectedTheme : { borderColor: 'transparent' },
            ]}
            onPress={async () => {
              setSelectedTheme(index + 1);
              await runAsync({
                type: ChatThemeType.Local,
                gallery: item,
                roomId: Number(roomId),
                color: '',
              });
              await refreshAsyncChatRoomDetail();
            }}>
            <Image style={{ width: itemSize, height: itemSize * 1.57 }} source={item} resizeMode="cover" />
            {index + 1 === selectedTheme && (
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

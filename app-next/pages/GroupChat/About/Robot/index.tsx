import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { CloseOutline, RadioCheckTwoTone, SearchOutline } from '@/components/Icon';
import List from '@/components/List';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { defaultCover } from '@/constants';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { postBotAppChatroomRoomIdBotMemeber } from '@/services/guanliyuanqunliaoshezhijiekou';
import { getBotAppSubscribedBots } from '@/services/jiqirenchaxun';
import { getBotAppChatroomMembers } from '@/services/pinyin2';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

type RobotListItem = Awaited<ReturnType<typeof getBotAppSubscribedBots>>['data']['data']['list'][number];
export default function AboutGroupChatRobot() {
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const intl = useIntl();
  const { roomId } = useLocalSearchParams<{
    roomId: string; // 群ID
    excludeIds: string; // 用于排除查询出来的群成员列表
  }>();
  const { refreshChatRoomDetail } = useGroupChatProvider();
  const [searchKey, setSearchKey] = useState<string>();
  const [selectedBotId, setSelectedBotId] = useState<string>();
  const { loading, runAsync } = useRequest(postBotAppChatroomRoomIdBotMemeber, {
    manual: true,
    debounceWait: 300,
  });
  const { data: botData } = useRequest(
    () =>
      getBotAppChatroomMembers({
        roomId,
        pageNo: 1,
        pageSize: 4,
        memberType: 'BOT',
      }),
    {
      debounceWait: 300,
      cacheKey: `BotAppChatroomMembers-${roomId}`,
    },
  );

  const selectedBotIds = useMemo(() => botData?.data?.data?.list.map((x) => x.memberId) || [], [botData]);

  const params = useMemo(
    () => ({
      roomId,
      botName: searchKey,
    }),
    [searchKey, roomId],
  );

  const renderItem = useCallback(
    ({ item }: { item: RobotListItem }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={selectedBotIds.length === 2 || selectedBotIds.includes(item.id)}
          style={[styles.optionItem, { borderColor: '#25212E' }]}
          onPress={() => {
            setSelectedBotId(item.id);
          }}>
          <View style={styles.itemLeftContent}>
            <Image
              contentFit="cover"
              placeholderContentFit="cover"
              placeholder={defaultCover}
              style={styles.avatar}
              source={{ uri: s3ImageTransform(item.botAvatar, 'small') }}
            />
            <View>
              <Text
                style={{
                  fontSize: pxToDp(16 * 2),
                  color: computedThemeColor.text,
                }}>
                {item.botName}
              </Text>
              <Text
                style={[
                  styles.status,
                  {
                    color: item?.botStatus ? computedThemeColor.primary : computedThemeColor.text_secondary,
                  },
                ]}>
                {item.botStatus}
              </Text>
            </View>
          </View>
          <View>
            <RadioCheckTwoTone
              color={
                item.id === selectedBotId || selectedBotIds.includes(item.id)
                  ? computedThemeColor.text_pink
                  : computedThemeColor.text_secondary
              }
              twoToneColor="#fff"
              width={pxToDp(24 * 2)}
              height={pxToDp(24 * 2)}
              checked={item.id === selectedBotId || selectedBotIds.includes(item.id)}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [selectedBotIds, computedThemeColor, selectedBotId],
  );

  return (
    <PageView style={styles.page}>
      <NavBar
        theme={computedTheme}
        title={intl.formatMessage({ id: 'AboutChat.AddAI' })}
        style={[{ backgroundColor: '#ffffff00' }]}
        more={
          <TouchableOpacity
            disabled={!selectedBotId || loading}
            style={{ paddingVertical: pxToDp(6), paddingHorizontal: pxToDp(24) }}
            onPress={() => {
              runAsync(
                { roomId },
                {
                  botId: selectedBotId!,
                },
              )
                .then((res: any) => {
                  if (res.data?.code !== 0) {
                    Toast.info(res.data?.msg || intl.formatMessage({ id: 'failed' }));
                  } else {
                    refreshChatRoomDetail();
                    router.back();
                  }
                })
                .catch((err) => {
                  console.log('err:', JSON.stringify(err, null, 2));
                  Toast.error(intl.formatMessage({ id: 'failed' }));
                });
            }}>
            <Text
              style={{
                color: selectedBotId ? computedThemeColor.text : computedThemeColor.text_secondary,
                fontSize: pxToDp(32),
              }}>
              {loading ? <ActivityIndicator color={computedThemeColor.primary} /> : intl.formatMessage({ id: 'Add' })}
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={{ flex: 1 }}>
        <View style={[styles.searchBar]}>
          <View style={styles.searchBarBox}>
            <SearchOutline width={pxToDp(40)} height={pxToDp(40)} color="#fff" />
            <TextInput
              value={searchKey}
              onChangeText={(v) => {
                setSearchKey(v);
              }}
              onSubmitEditing={() => {
                setSearchKey(searchKey);
              }}
              placeholder={intl.formatMessage({ id: 'Search.BotName' })}
              placeholderTextColor="#aaa"
              style={[styles.searchInput, { marginLeft: pxToDp(14) }]}
            />
          </View>
          {searchKey && (
            <TouchableOpacity
              style={[styles.iconWrapper]}
              onPress={() => {
                setSearchKey(undefined);
              }}>
              <CloseOutline width={pxToDp(28)} height={pxToDp(28)} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <List
          footerProps={{
            moreText: '',
            noMoreText: '',
          }}
          params={params}
          request={async (params) => {
            const res = await getBotAppSubscribedBots({ ...params });
            return {
              data: res?.data?.data?.list || [],
              total: res?.data?.data?.total || 0,
            };
          }}
          renderItem={renderItem}
        />
      </View>
    </PageView>
  );
}

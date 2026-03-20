import { useRequest } from 'ahooks';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import List from '@/components/List';
import keyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useConfigProvider } from '@/hooks/useConfig';
import { useLocale } from '@/hooks/useLocale';
import { postContentAppFollowRelation } from '@/services/agoraxin';
import { deleteBotAppBotIdUnsubscribe } from '@/services/dingyuejiqiren';
import { getBotAppRecommendBots } from '@/services/jiqirenchaxun';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function RecommendedFollow() {
  const intl = useIntl();
  const { locale } = useLocale();
  const { computedThemeColor } = useConfigProvider();
  const insets = useSafeAreaInsets();

  const [followedList, setFollowedList] = useState<string[]>([]);

  // 关注机器人
  const { runAsync: fetchPostFollow } = useRequest(
    async (id: string) => {
      setFollowedList((list) => [...list, id]);
      try {
        const params = { followingId: id, type: 'BOT' };
        const res = await postContentAppFollowRelation(params);
        if (res.data?.code !== 0) {
          setFollowedList((list) => list.filter((i) => i !== id));
        }
      } catch (err) {
        setFollowedList((list) => list.filter((i) => i !== id));
      }
    },
    { manual: true },
  );

  // 取消关注机器人
  const { runAsync: fetchPostCancelFollow } = useRequest(
    async (id: string) => {
      setFollowedList((list) => list.filter((i) => i !== id));
      try {
        const res = await deleteBotAppBotIdUnsubscribe({ id });
        if (res.data?.code !== 0) setFollowedList((list) => [...list, id]);
      } catch (err) {
        setFollowedList((list) => [...list, id]);
      }
    },
    { manual: true },
  );

  const renderItem = (item: API.BotListVO) => (
    <View key={item.botName} style={[styles.box, { backgroundColor: computedThemeColor.bg_secondary }]}>
      <Avatar img={item.botAvatar!} size={92} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.userinfo}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: computedThemeColor.text }]}>{item.botName}</Text>
            {/*<Text style={styles.username}>@{item.username}</Text>*/}
          </View>
          {followedList.includes(item.id!) ? (
            <TouchableOpacity
              style={[styles.followBtn, styles.followedBtn]}
              onPress={() => fetchPostCancelFollow(item.id!)}>
              <Text style={[styles.followBtnText, styles.followedBtnText]}>
                {intl.formatMessage({ id: 'unfollow' })}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.followBtn, { borderColor: computedThemeColor.primary }]}
              onPress={() => fetchPostFollow(item.id!)}>
              <Text style={[styles.followBtnText, { color: computedThemeColor.text }]}>
                {intl.formatMessage({ id: 'follow' })}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.desc, { color: computedThemeColor.text }]}>{item.recommendWords?.trim()}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={keyboardAvoidingViewBehavior} style={{ flex: 1 }}>
      <View
        style={[
          styles.page,
          { backgroundColor: computedThemeColor.bg_primary },
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + (Platform.OS === 'android' ? pxToDp(24) : 0),
          },
        ]}>
        <View style={{ marginTop: pxToDp(14 * 2), paddingHorizontal: pxToDp(16 * 2) }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: pxToDp(64), lineHeight: pxToDp(80), color: '#A07BED' }}>
                {intl.formatMessage({ id: 'recommend.title.1' })}
              </Text>
              <Text style={{ fontSize: pxToDp(64), lineHeight: pxToDp(80), color: '#A07BED' }}>
                {intl.formatMessage({ id: 'recommend.title.2' })}
              </Text>

              {locale === 'ru' ? (
                <Text style={[styles.caption, { color: computedThemeColor.text_secondary }]}>
                  {intl.formatMessage({ id: 'recommend.caption.1' })}{' '}
                  {intl.formatMessage({ id: 'recommend.caption.2' })}
                </Text>
              ) : (
                <>
                  <Text style={[styles.caption, { color: computedThemeColor.text_secondary }]}>
                    {intl.formatMessage({ id: 'recommend.caption.1' })}
                    {intl.formatMessage({ id: 'recommend.caption.2' })}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
        <View style={styles.content} />
        <View style={{ paddingHorizontal: pxToDp(16 * 2) }}>
          <Text
            style={{
              fontSize: pxToDp(32),
              color: computedThemeColor.text,
              marginBottom: pxToDp(20),
            }}>
            {intl.formatMessage({ id: 'recommend.subtitle' })}
          </Text>
        </View>

        <List
          footerProps={{ noMoreText: '' }}
          contentContainerStyle={{ paddingHorizontal: pxToDp(16 * 2) }}
          request={async ({ pageNo }) => {
            const res = await getBotAppRecommendBots({ pageNo, pageSize: 15 });
            return {
              data: res?.data?.data?.list || [],
              total: res?.data?.data?.total || 0,
            };
          }}
          renderItem={({ item }) => renderItem(item)}
        />

        <Button
          type="primary"
          borderType="square"
          style={{ marginHorizontal: pxToDp(16 * 2) }}
          onPress={() => router.push('/')}>
          {intl.formatMessage({ id: 'Continue' })}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

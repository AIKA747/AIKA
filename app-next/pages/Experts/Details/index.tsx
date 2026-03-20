import { useRequest } from 'ahooks';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { ActivityIndicator, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DotLoading from '@/components/DotLoading';
import GradientBg from '@/components/GradientBg';
import { PlayOutline, SecurityLockOutline, ShareOutline } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { placeholderImg } from '@/constants';
import { AFEventKey } from '@/constants/AFEventKey';
import { useAuth } from '@/hooks/useAuth';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import PayModal from '@/pages/Payments/PayModal';
import { postContentAppFollowRelation } from '@/services/agoraxin';
import { getBotAppBotId } from '@/services/jiqirenchaxun';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

export default function ExpertDetail() {
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const { userInfo, refreshUserInfo } = useAuth();

  const isExpired = userInfo?.expiredDate && new Date(userInfo?.expiredDate) < new Date();

  const { expertId } = useLocalSearchParams<{ expertId: string }>();

  const insets = useSafeAreaInsets();

  const {
    data: storyDetail,
    loading: loadingStoryDetail,
    refresh: refreshStoryDetail,
  } = useRequest(
    async () => {
      const resp = await getBotAppBotId({ id: expertId, botStatus: 'online' });
      return resp.data.data;
    },
    { manual: false, refreshDeps: [expertId], cacheKey: `expert-details-${expertId}` },
  );

  const [firstCapitalized, introduction] = useMemo(() => {
    return [storyDetail?.botIntroduce?.slice(0, 1), storyDetail?.botIntroduce?.slice(1)];
  }, [storyDetail?.botIntroduce]);

  const [payModalVisible, setPayModalVisible] = useState(false);
  const { refreshAsync: handleContinue, loading: loadingHandleContinue } = useRequest(
    () =>
      postContentAppFollowRelation({
        followingId: expertId,
        type: 'BOT',
      }),
    {
      manual: true,
      refreshDeps: [storyDetail, isExpired, expertId],
      onSuccess: (res) => {
        sendAppsFlyerEvent(AFEventKey.AFExpertChatStarted);
        router.push({
          pathname: '/main/experts/chat/[expertId]',
          params: { expertId },
        });
      },
    },
  );

  return (
    <PageView
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}
      source={
        storyDetail?.cover
          ? {
              uri: s3ImageTransform(
                {
                  [Theme.LIGHT]: storyDetail?.cover,
                  [Theme.DARK]: storyDetail?.cover,
                }[computedTheme] || placeholderImg,
                [750, 1334],
              ),
            }
          : placeholderImg
      }>
      <View
        style={[
          styles.container,
          {
            backgroundColor: 'rgba(255,255,255,0)',
          },
        ]}>
        <GradientBg
          colors={['#00000000', '#000000FF', '#000000FF']}
          locations={[0, 0.3, 1]}
          start={[0.5, 0]}
          end={[0.5, 1]}
          style={[
            styles.infoWrapper,
            {
              paddingBottom: insets.bottom,
            },
          ]}>
          <View style={[styles.info]}>
            {!introduction ? (
              <View style={[styles.infoLoading]}>
                <DotLoading style={[styles.infoLoadingIcon]} size={pxToDp(12)} color={computedThemeColor.text} />
              </View>
            ) : (
              <>
                <Text
                  style={[
                    styles.infoName,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}>
                  {storyDetail?.botName}
                </Text>
                <View style={[styles.infoTagsWrapper]}>
                  <ScrollView horizontal style={[styles.infoTags]}>
                    {storyDetail?.tags.split(',').map((tag: string) => {
                      return (
                        <View
                          key={tag}
                          style={[
                            styles.infoTagsTag,
                            {
                              backgroundColor: '#A07BED1A',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.infoTagsTagText,
                              {
                                color: '#A07BED',
                              },
                            ]}>
                            {tag}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
                <Text
                  style={[
                    styles.infoIntroduction,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}
                  numberOfLines={5}>
                  <Text
                    style={{
                      fontSize: pxToDp(64),
                    }}>
                    {firstCapitalized}
                  </Text>
                  {introduction}
                </Text>
              </>
            )}

            {!isExpired ? (
              <TouchableOpacity
                style={[
                  styles.infoButton,
                  {
                    borderColor: '#A07BED',
                  },
                ]}
                disabled={loadingHandleContinue}
                onPress={async () => {
                  handleContinue();
                }}>
                {loadingStoryDetail ? (
                  <ActivityIndicator color={computedThemeColor.primary} />
                ) : (
                  <PlayOutline
                    width={pxToDp(32)}
                    height={pxToDp(32)}
                    color={computedThemeColor.primary}
                    style={[styles.infoButtonIcon]}
                  />
                )}
                <Text
                  style={[
                    styles.infoButtonText,
                    {
                      color: computedThemeColor.primary,
                    },
                  ]}>
                  {intl.formatMessage({ id: 'Start' })}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.infoButton,
                  {
                    borderColor: '#A07BED',
                  },
                ]}
                onPress={async () => {
                  setPayModalVisible(true);
                }}>
                <SecurityLockOutline
                  width={pxToDp(32)}
                  height={pxToDp(32)}
                  color={computedThemeColor.primary}
                  style={[styles.infoButtonIcon]}
                />
                <Text
                  style={[
                    styles.infoButtonText,
                    {
                      color: computedThemeColor.primary,
                    },
                  ]}>
                  {intl.formatMessage({ id: 'Closed' })}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </GradientBg>
      </View>
      <NavBar
        title=""
        position="Sticky"
        more={
          <DropShadow
            style={[
              {
                shadowColor: '#301190',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.4,
                shadowRadius: 8,
              },
            ]}>
            <TouchableOpacity
              style={[styles.share]}
              onPress={async () => {
                const message = storyDetail?.botName + '\n' + storyDetail?.botIntroduce;
                try {
                  // https://reactnative.cn/docs/0.72/share
                  const result = await Share.share({
                    message,
                    // title: subject || '',
                    // url: `${getConfig().webDomain}/${locale}/product/${productDetail?.id}`,
                  });
                  if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                      // shared with activity type of result.activityType
                    } else {
                      // shared
                    }
                  } else if (result.action === Share.dismissedAction) {
                    // dismissed
                  }
                } catch (error) {
                  //
                }
              }}>
              <ShareOutline color={computedThemeColor.text} width={pxToDp(40)} height={pxToDp(40)} />
            </TouchableOpacity>
          </DropShadow>
        }
      />

      <PayModal
        from="unsubscribe"
        visible={payModalVisible}
        onClose={async (refresh) => {
          refreshStoryDetail();
          if (refresh) {
            await refreshUserInfo();
          }
          setPayModalVisible(false);
        }}
      />
    </PageView>
  );
}

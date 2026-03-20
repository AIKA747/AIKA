import { useRequest } from 'ahooks';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DotLoading from '@/components/DotLoading';
import GradientBg from '@/components/GradientBg';
import { LoadingOutline, PlayOutline, SecurityLockOutline, ShareOutline } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { placeholderImg } from '@/constants';
import { AFEventKey } from '@/constants/AFEventKey';
import { useAuth } from '@/hooks/useAuth';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import PayModal from '@/pages/Payments/PayModal';
import { getBotAppGameId, postBotAppGameThread } from '@/services/youxi';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

export default function GamesDetails() {
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const { userInfo, refreshUserInfo, isUserInfoLoading } = useAuth();

  const isExpired = useMemo(
    () => userInfo?.expiredDate && new Date(userInfo?.expiredDate) < new Date(),
    [userInfo?.expiredDate],
  );

  const { gameId } = useLocalSearchParams<{ gameId: string }>();

  const insets = useSafeAreaInsets();

  const { data: gameDetail, runAsync: runGameDetail } = useRequest(
    async () => {
      const resp = await getBotAppGameId({ id: gameId });
      return resp.data.data;
    },
    { manual: true, refreshDeps: [gameId], cacheKey: `game-detail-${gameId}` },
  );

  const [firstCapitalized, introduction] = useMemo(() => {
    return [gameDetail?.introduce?.slice(0, 1), gameDetail?.introduce?.slice(1)];
  }, [gameDetail?.introduce]);

  const [payModalVisible, setPayModalVisible] = useState(false);
  const { refreshAsync: handleContinue } = useRequest(
    async () => {
      if (!gameDetail?.id) return;

      const resp = await postBotAppGameThread({ gameId: gameDetail?.id });
      if (!resp.data.data) return;
      sendAppsFlyerEvent(AFEventKey.AFGameTestStarted);
      router.push({
        pathname: '/main/games/chat/[gameId]',
        params: { gameId: gameDetail?.id, gameThreadId: resp.data.data },
      });
    },
    {
      manual: true,
      refreshDeps: [gameDetail, isExpired],
    },
  );

  useFocusEffect(
    useCallback(() => {
      runGameDetail();
    }, [runGameDetail]),
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
        gameDetail?.cover || gameDetail?.coverDark
          ? {
              uri: s3ImageTransform(
                {
                  [Theme.LIGHT]: gameDetail?.cover,
                  [Theme.DARK]: gameDetail?.coverDark,
                }[computedTheme] || '',
                [750, 1344],
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
          // colors={['#000000FF', '#000000FF', '#00000000']}
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
                  {gameDetail?.gameName}
                </Text>
                <View style={[styles.infoTagsWrapper]}>
                  <ScrollView horizontal style={[styles.infoTags]}>
                    {[].map((tag) => {
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
                onPress={async () => {
                  handleContinue();
                }}>
                <PlayOutline
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
                {isUserInfoLoading ? (
                  <LoadingOutline
                    width={pxToDp(32)}
                    height={pxToDp(32)}
                    color={computedThemeColor.primary}
                    style={[styles.infoButtonIcon]}
                  />
                ) : (
                  <SecurityLockOutline
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
                const message = gameDetail?.gameName + '\n' + gameDetail?.introduce;
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
          if (refresh) {
            await refreshUserInfo();
          }
          setPayModalVisible(false);
        }}
      />
    </PageView>
  );
}

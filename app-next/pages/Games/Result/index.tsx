import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity, Platform, ImageBackground, ScrollView, Share } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddCircleOutline, ArrowsActionForwardOutline } from '@/components/Icon';
import { AFEventKey } from '@/constants/AFEventKey';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getItem } from '@/hooks/useStorageState/utils';
import { getBotAppGameId } from '@/services/youxi';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';
import { GameResult } from './types';

export default function GamesResult() {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor, computedTheme } = useConfigProvider();

  const { gameId, resultKey } = useLocalSearchParams<{
    gameId: string;
    gameThreadId: string;
    resultKey: string;
  }>();

  const { data: gameDetail, runAsync: runGameDetail } = useRequest(
    async () => {
      const resp = await getBotAppGameId({ id: gameId });

      return resp.data.data;
    },
    { manual: true, refreshDeps: [gameId] },
  );

  const { data: gameResultDetail, runAsync: runGameResultDetail } = useRequest(
    async () => {
      return await getItem<GameResult>(resultKey);
    },
    { manual: true, refreshDeps: [gameId] },
  );

  useFocusEffect(
    useCallback(() => {
      sendAppsFlyerEvent(AFEventKey.AFGameResultViewed);
      runGameDetail();
      runGameResultDetail();
    }, [runGameDetail, runGameResultDetail]),
  );

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
          paddingBottom: Platform.OS === 'ios' ? pxToDp(32) : 0,
          paddingTop: insets.top,
        },
      ]}>
      <View style={[styles.container]}>
        <ScrollView style={[styles.info]}>
          <Text
            style={[
              styles.title,
              {
                color: computedThemeColor.text,
                // color: 'red',
              },
            ]}>
            {gameDetail?.gameName}
          </Text>

          <Image style={[styles.ribbon]} source={require('./ribbon.png')} contentFit="cover" />
          <Text
            style={[
              styles.desc,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {gameResultDetail?.summary}
          </Text>

          <ImageBackground
            style={[styles.imageWrapper]}
            imageStyle={[styles.image]}
            source={{
              uri: s3ImageTransform(gameResultDetail?.cover || '', [686, 600]),
            }}
            resizeMode="cover">
            <Image
              style={[styles.imageMask]}
              source={
                {
                  [Theme.LIGHT]: require('./mask.light.png'),
                  [Theme.DARK]: require('./mask.dark.png'),
                }[computedTheme]
              }
              contentFit="cover"
            />
          </ImageBackground>

          <Markdown
            style={{
              body: {
                color: computedThemeColor.text,
                margin: 0,
                padding: 0,
                paddingHorizontal: pxToDp(32),
              },
            }}>
            {gameResultDetail?.description || ''}
          </Markdown>
          {/* <Text
            style={[
              styles.descTitle,
              {
                color: computedThemeColor.text,
              },
            ]}
          >
            Traits
          </Text>
          <Text
            style={[
              styles.desc,
              {
                color: computedThemeColor.text,
              },
            ]}
          >
            You are a mysterious and determined explorer. Facts, logic, and achieving goals are your
            priorities. You tend to prioritize tasks over emotions and are unafraid to go against
            the current. You are a mysterious and determined e
          </Text>
          <Text
            style={[
              styles.descTitle,
              {
                color: computedThemeColor.text,
              },
            ]}
          >
            Your Role
          </Text>
          <Text
            style={[
              styles.desc,
              {
                color: computedThemeColor.text,
              },
            ]}
          >
            You are a mysterious and determined explorer. Facts, logic, and achieving goals are your
            priorities. You tend to prioritize tasks over emotions and are unafraid to go against
            the current. You are a mysterious and determined e
          </Text>
           */}
          <View style={[{ marginBottom: pxToDp(32) }]} />
        </ScrollView>
        <View style={[styles.bottom]}>
          <TouchableOpacity
            style={[styles.infoButtonShare]}
            onPress={async () => {
              const message = gameDetail?.gameName + '\n' + gameResultDetail?.summary;
              try {
                // https://reactnative.cn/docs/0.72/share
                const result = await Share.share({
                  message,
                  // title: subject || '',
                  // url: `${getConfig().webDomain}/${locale}/product/${productDetail?.id}`,
                });
                if (result.action === Share.sharedAction) {
                  sendAppsFlyerEvent(AFEventKey.AFGameResultShared);
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
            <AddCircleOutline
              width={pxToDp(48)}
              height={pxToDp(48)}
              color={computedThemeColor.text_secondary}
              style={[styles.infoButtonShareIcon]}
            />
            <Text
              style={[
                styles.infoButtonShareText,
                {
                  color: '#80878E',
                },
              ]}>
              {intl.formatMessage({ id: 'ShareTheResult' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.infoButtonFinish,
              {
                borderColor: '#A07BED',
              },
            ]}
            onPress={async () => {
              router.back();
            }}>
            <ArrowsActionForwardOutline color={computedThemeColor.primary} style={[styles.infoButtonFinishIcon]} />
            <Text
              style={[
                styles.infoButtonFinishText,
                {
                  color: computedThemeColor.primary,
                },
              ]}>
              {intl.formatMessage({ id: 'Finish' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

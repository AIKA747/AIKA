import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DotLoading from '@/components/DotLoading';
import GradientBg from '@/components/GradientBg';
import { PlayOutline, SecurityLockOutline, ShareOutline } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { placeholderImg } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { useStoryProvider } from '@/hooks/useStory';
import PayModal from '@/pages/Payments/PayModal';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

export default function FairyTaleSummary() {
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const { fetchStoryDetailAsync, storyDetail, onClearStory } = useStoryProvider();
  const { userInfo, refreshUserInfo } = useAuth();

  const isExpired = useMemo(
    () => userInfo?.expiredDate && new Date(userInfo?.expiredDate) < new Date(),
    [userInfo?.expiredDate],
  );

  const { storyId } = useLocalSearchParams<{ storyId: string }>();

  const insets = useSafeAreaInsets();

  const [firstCapitalized, introduction] = useMemo(() => {
    return [storyDetail?.introduction?.slice(0, 1), storyDetail?.introduction?.slice(1)];
  }, [storyDetail?.introduction]);

  const [payModalVisible, setPayModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchStoryDetailAsync?.(storyId);
    }, [fetchStoryDetailAsync, storyId]),
  );

  useEffect(() => {
    return () => {
      // 清除故事详情
      onClearStory?.();
    };
  }, [onClearStory]);

  return (
    <PageView
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}
      source={
        storyDetail?.cover || storyDetail?.coverDark
          ? {
              uri: s3ImageTransform(
                {
                  [Theme.LIGHT]: storyDetail?.cover,
                  [Theme.DARK]: storyDetail?.coverDark,
                }[computedTheme] || '',
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
                  {storyDetail?.storyName}
                </Text>
                <View style={[styles.infoTagsWrapper]}>
                  <ScrollView horizontal style={[styles.infoTags]}>
                    {storyDetail?.category.map((tag) => {
                      // {[
                      //   { id: '1', name: '000' },
                      //   { id: '2', name: '000' },
                      //   { id: '3', name: 'zz000z' },
                      // ].map((tag) => {
                      return (
                        <View
                          key={tag.id}
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
                            {tag.name}
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
                  router.push({
                    pathname: '/main/story/details/[storyId]',
                    params: { storyId: storyDetail?.id || '' },
                  });
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
                <SecurityLockOutline
                  height={pxToDp(32)}
                  width={pxToDp(32)}
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
        theme={Theme.LIGHT}
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
                const message = storyDetail?.storyName + '\n' + storyDetail?.introduction;
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
              <ShareOutline color="#fff" width={pxToDp(40)} height={pxToDp(40)} />
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

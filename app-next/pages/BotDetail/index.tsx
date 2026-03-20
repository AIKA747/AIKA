import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import CheckboxGroup from '@/components/CheckboxGroup';
import { MenuDotsFilled, StarFilled, StarOutline } from '@/components/Icon';
import { useConfirmModal } from '@/components/Modal';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { getGenderObj } from '@/constants/Gender';
import { Gender } from '@/constants/types';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { deleteBotAppBotIdUnsubscribe, postBotAppSubscription } from '@/services/dingyuejiqiren';
import { putBotAppBotIdRelease } from '@/services/jiqirencaozuo';
import { getBotAppBotId } from '@/services/jiqirenchaxun';
import { formatCompactNumber } from '@/utils/formatCompactNumber';
import pxToDp from '@/utils/pxToDp';

import CommentModal from './CommentModal';
import Creator from './Creator';
import OperationModal from './OperationModal';
import Rating from './Rating';
import styles from './styles';

export default function BotDetail() {
  const intl = useIntl();
  const { computedThemeColor: theme } = useConfigProvider();
  const insets = useSafeAreaInsets();

  const { userInfo } = useAuth();
  const { botId, from } = useLocalSearchParams<{
    botId: string;
    from?: 'chat' | 'list';
  }>();

  const { el, show } = useConfirmModal({});

  const {
    data: botDetail,
    loading,
    runAsync: runBotDetail,
  } = useRequest(
    async () => {
      const resp = await getBotAppBotId({
        id: botId,
        botStatus: 'online',
      });

      return resp.data.data;
    },
    {
      manual: true,
      refreshDeps: [botId],
    },
  );

  const selfCreation = botDetail?.creator + '' === userInfo?.userId;

  const { data: botDetailUnRelease, runAsync: runBotDetailUnRelease } = useRequest(
    async () => {
      if (!selfCreation) {
        return;
      }
      const resp = await getBotAppBotId({
        id: botId,
        botStatus: 'unrelease',
      });

      return resp.data.data;
    },
    {
      manual: false,
      refreshDeps: [botId, selfCreation],
    },
  );

  useEffect(() => {
    if (botDetailUnRelease && botDetailUnRelease.hasUpdated) {
      // 有未发布的新版本
      show({
        text: intl.formatMessage({
          id: 'bot.detail.release.confirm.text',
        }),
        onOk: async () => {
          await putBotAppBotIdRelease({ id: botId });
          await runBotDetailUnRelease();
        },
        onCancel: () => {},
      });
    }
  }, [botDetailUnRelease, botId, intl, runBotDetailUnRelease, show]);

  const refreshKey = useMemo(() => {
    return Date.now() + '';
  }, [botDetail]);

  useFocusEffect(
    useCallback(() => {
      runBotDetail();
    }, [runBotDetail]),
  );

  const { runAsync: runSubscribe } = useRequest(
    async (subscribed: boolean) => {
      // 没订阅就订阅
      if (!subscribed) {
        const resp = await postBotAppSubscription({ botId });
        if (resp.data.code === 0) {
        }
      } else {
        const resp = await deleteBotAppBotIdUnsubscribe({ id: botId });
        if (resp.data.code === 0) {
        }
      }
      await runBotDetail();
    },
    {
      manual: true,
      refreshDeps: [botId, runBotDetail],
    },
  );

  const [operationModalVisible, setOperationModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);

  return (
    <PageView loading={loading} style={[styles.page, { backgroundColor: theme.bg_primary }]}>
      <ImageBackground
        resizeMode="cover"
        resizeMethod="resize"
        source={require('@/assets/images/profile/profile-bg.png')}
        style={{
          paddingTop: pxToDp(108) + insets.top,
          paddingHorizontal: pxToDp(32),
          paddingBottom: pxToDp(42),
          gap: pxToDp(24),
        }}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.78)',
            paddingTop: insets.top,
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        />
        <View style={styles.botDetailTop}>
          <Avatar
            img={botDetail?.avatar}
            style={styles.botDetailAvatar}
            bordered
            innerBorder
            shape="square"
            borderColor="#ffffff40"
            innerBorderColor="#ffffff40"
          />
          <View>
            <View style={styles.botDetailName}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: pxToDp(20) }}>
                {/* TODO mybot 彩带标签*/}
                <Text style={styles.botDetailNameLeftText}>{botDetail?.botName}</Text>
                <Text style={{ fontSize: pxToDp(28), color: theme.text_secondary }}>
                  ({getGenderObj()[botDetail?.gender as Gender] || ''})
                  {/* {botDetail?.botSource === 'userCreated'
                  ? ` |  @${botDetail?.creatorName || '-'}`
                  : ` |  @Official`} */}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: pxToDp(30) }}>
              <View style={styles.botDetailScore}>
                <Text style={styles.botDetailScoreTitle}>{intl.formatMessage({ id: 'Favorites' })}</Text>
                <Text style={styles.botDetailScoreText}>{formatCompactNumber(botDetail?.subscriberTotal || 0)}</Text>
              </View>
              <View
                style={[
                  styles.botDetailScore,
                  {
                    marginLeft: pxToDp(120),
                  },
                ]}>
                <Text style={styles.botDetailScoreTitle}>{intl.formatMessage({ id: 'Rating' })}</Text>
                <Text style={styles.botDetailScoreText}>{botDetail?.rating ? botDetail.rating.toFixed(1) : '-'}</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: pxToDp(40),
            gap: pxToDp(32),
          }}>
          {/* 自己的机器人不需要关注 */}
          {!selfCreation && (
            <>
              {botDetail?.subscribed ? (
                <Button
                  icon={<StarFilled width={pxToDp(32)} height={pxToDp(32)} color={theme.primary} />}
                  type="primary"
                  size="small"
                  wrapperStyle={{ flex: 1 }}
                  onPress={async () => await runSubscribe(true)}
                  style={
                    {
                      // backgroundColor: '#464951',
                    }
                  }>
                  {intl.formatMessage({ id: 'bot.detail.RemoveFavorites' })}
                </Button>
              ) : (
                <Button
                  icon={<StarOutline width={pxToDp(32)} height={pxToDp(32)} color={theme.primary} />}
                  type="primary"
                  size="small"
                  wrapperStyle={{ flex: 1 }}
                  onPress={async () => await runSubscribe(false)}>
                  {intl.formatMessage({ id: 'bot.detail.AddFavorites' })}
                </Button>
              )}
            </>
          )}
          {from !== 'chat' && (
            <Button
              type="primary"
              size="small"
              wrapperStyle={{ flex: 1 }}
              onPress={() => {
                // TODO: 重构待实现
                // router.push({
                //   pathname: '/main/botChat',
                //   params: {
                //     botId,
                //   },
                // });
              }}>
              {intl.formatMessage({ id: 'StartChat' })}
            </Button>
          )}
        </View>
      </ImageBackground>
      <NavBar
        position="Sticky"
        style={[{ backgroundColor: '#ffffff00' }]}
        more={
          <TouchableOpacity
            style={{
              width: pxToDp(68),
              height: pxToDp(68),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setOperationModalVisible(true)}>
            <MenuDotsFilled width={pxToDp(40)} height={pxToDp(40)} color="#fff" />
          </TouchableOpacity>
        }
      />
      <ScrollView>
        <View style={styles.container}>
          <Text
            style={{
              opacity: 0.5,
              color: '#fff',
              fontSize: pxToDp(24),
              marginTop: pxToDp(50),
            }}>
            {botDetail?.updatedAt && `Last update ${dayjs(botDetail?.updatedAt).format('YYYY-MM-DD')}`}
          </Text>
          <Text style={styles.botDetailTitle}>{intl.formatMessage({ id: 'bot.detail.Introduction' })}</Text>
          <Text style={styles.botDetailIntro}>{botDetail?.botIntroduce}</Text>
          <Text style={styles.botDetailTitle}>{intl.formatMessage({ id: 'bot.detail.Personality' })}</Text>

          <CheckboxGroup
            style={styles.botDetailPersonality}
            mode="tag"
            options={
              botDetail?.conversationStyle
                ? [
                    {
                      key: '1',
                      label: botDetail?.conversationStyle || '',
                    },
                  ]
                : []

              // TODO personality 这个值还没有
              // botDetail?.personality?.split(',').map((item) => {
              //   return {
              //     key: item,
              //     label: item,
              //   };
              // }) || []
            }
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: pxToDp(80),
            }}>
            <Text style={[styles.botDetailTitle, { marginTop: 0 }]}>{intl.formatMessage({ id: 'Rating' })}</Text>
            {botDetail?.rating ? (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/main/ratingList',
                    params: {
                      botId,
                      rating: botDetail?.rating ? (botDetail.rating || 0).toFixed(1) : '-',
                    },
                  });
                }}>
                <Text style={styles.botDetailIntro}>{intl.formatMessage({ id: 'SeeAll' })}</Text>
              </TouchableOpacity>
            ) : undefined}
          </View>
          <Rating botId={botDetail?.id} color={theme.primary} refreshKey={refreshKey} />
          <View style={styles.commentBox}>
            {botDetail?.commented && (
              <Button
                type="default"
                size="small"
                onPress={() => {
                  setCommentModalVisible(true);
                }}>
                {intl.formatMessage({ id: 'Comment' })}
              </Button>
            )}
          </View>
          {/* builtIn，userCreated */}
          {botDetail?.botSource === 'userCreated' && botDetail?.creator && (
            <>
              <Text style={styles.botDetailTitle}>{intl.formatMessage({ id: 'Creator' })}</Text>
              <Creator userId={botDetail?.creator} />
            </>
          )}
        </View>
      </ScrollView>

      {botDetail && (
        <OperationModal
          bot={botDetail}
          visible={operationModalVisible}
          onClose={() => {
            setOperationModalVisible(false);
          }}
        />
      )}

      <CommentModal
        bot={botDetail!}
        visible={commentModalVisible}
        onClose={async (refresh) => {
          setCommentModalVisible(false);
          if (refresh) {
            await runBotDetail();
          }
        }}
      />
      {el}
    </PageView>
  );
}

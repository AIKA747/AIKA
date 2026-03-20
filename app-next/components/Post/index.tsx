import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types';
import { useRouter } from 'expo-router';
import { useVideoPlayer } from 'expo-video';
import LottieView from 'lottie-react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AdaptiveImage from '@/components/AdaptiveImage';
import AnimatedCounter, { AnimatedCounterRef } from '@/components/AnimatedCounter';
import HighlightedTags from '@/components/HighlightedTags';
import { ArrowLeftOutline, ChatOutline, HeartFilled, HeartOutline, MenuDotsFilled } from '@/components/Icon';
import ImageView from '@/components/ImageView';
import Modal from '@/components/Modal';
import { PostMoreAction } from '@/components/Post/More/types';
import ReportMask from '@/components/Post/ReportMask';
import ReportModal from '@/components/Post/ReportModal';
import ThumbUserItem from '@/components/Post/ThumbUserItem';
import Toast from '@/components/Toast';
import { VideoPlayer } from '@/components/VideoPlayer';
import { placeholderImg } from '@/constants';
import { AFEventKey } from '@/constants/AFEventKey';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { Theme } from '@/hooks/useConfig/types';
import useOnDoublePress from '@/hooks/useOnDoublePress';
import { getContentAppPostThumbUserList, postContentAppThumb } from '@/services/agoraxin';
import { deleteContentAppPostsId, getContentAppPostsPrivate } from '@/services/tiezi';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import { formatDateTime } from '@/utils/formatDateTime';
import { getRussianLike } from '@/utils/formatRussianNumber';
import pxToDp, { deviceWidthDp } from '@/utils/pxToDp';

import Avatar from '../Avatar';

import More from './More';
import styles from './styles';
import VideoCard from './VideoCard';

// openapi 生成的 ts 类型有问题，自己定义一下
export type PostData = Awaited<ReturnType<typeof getContentAppPostsPrivate>>['data']['data']['list'][number] & {
  thumbed?: boolean;
};

type PostProps = {
  data: PostData;
  style?: StyleProp<ViewStyle>;
  showHeader?: boolean;
  showBack?: boolean;
  showMoreBtn?: boolean | { disabled?: boolean };
  // 是否展示所有内容。 false - 展示所有
  contentElliptical?: boolean;
  // 用于禁用 点赞和评论的操作功能
  disableActions?: boolean;
  contentEllipticalLineNum?: number;
  handleDelete?: (id: string | number) => void;
  handleUpdate?: (data: { id: number; thumbed: boolean; likes: number; reposts: number; reportId?: number }) => void;
  /**
   * 如果在聊天评论页面，则不再跳转
   */
  isInChat?: boolean;
  playingId?: number;
  navBarMoreItems?: PostMoreAction[];
  isImageAspectRatioPreserved?: boolean;
  callback?: (type?: PostMoreAction) => void;
  onPlayerReady: (id: number, player: ReturnType<typeof useVideoPlayer>) => void;
  onPressPlay: (id: number) => void;
};

const defaultSettings = {
  autoPlay: false,
  autoPlayInterval: 2000,
  autoPlayReverse: false,
  height: deviceWidthDp - pxToDp(32 * 2),
  loop: false,
  pagingEnabled: true,
  snapEnabled: true,
  vertical: false,
  width: deviceWidthDp,
};

function Post(props: PostProps) {
  const {
    data,
    style,
    showHeader = true,
    showBack = false,
    showMoreBtn = false,
    contentElliptical = true,
    contentEllipticalLineNum = 4,
    isInChat = false,
    navBarMoreItems = [],
    callback,
    isImageAspectRatioPreserved = false,
    handleUpdate,
    handleDelete,
    disableActions,
    playingId,
    onPlayerReady,
    onPressPlay,
  } = props;

  const ImageComponent = isImageAspectRatioPreserved ? AdaptiveImage : Image;

  const intl = useIntl();
  const router = useRouter();
  const { userInfo } = useAuth();
  const insets = useSafeAreaInsets();
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const { onDoublePress } = useOnDoublePress();
  const ref = useRef<ICarouselInstance>(null);
  const animation = useRef<LottieView>(null);
  const lottiePlay = useRef<boolean>(false);
  const animatedCounterRef = useRef<AnimatedCounterRef>(null);
  const [hasMoreContent, setHasMoreContent] = useState<boolean>(false);
  const [showLikeModal, setShowLikeModal] = useState<boolean>(false);
  const [openReportModal, setOpenReportModal] = useState<boolean>(false);
  const [openMoreModal, setOpenMoreModal] = useState<{ open: boolean; nativeEvent?: object }>({
    open: false,
  });
  const [numberOfLines, setNumberOfLines] = useState<number>(contentEllipticalLineNum);

  const {
    data: thumbData,
    runAsync: getThumbData,
    refresh: refreshThumbData,
  } = useRequest(() => getContentAppPostThumbUserList({ postId: data.id, pageNo: 1, pageSize: 9999 }), {
    debounceWait: 300,
    refreshDeps: [data],
    manual: true,
  });
  const { runAsync: fetchLike, loading: likeLoading } = useRequest(postContentAppThumb, {
    manual: true,
    debounceWait: 300,
  });

  useEffect(() => {
    animation.current?.reset();
  }, []);

  const moreItems = useMemo(() => {
    if (userInfo?.userId === data.author) {
      const menu = navBarMoreItems.filter((item) => item !== PostMoreAction.Report && item !== PostMoreAction.Hide);
      if (menu.findIndex((x) => x === PostMoreAction.Delete) === -1) {
        menu.push(PostMoreAction.Delete);
      }
      return menu;
    }
    return navBarMoreItems;
  }, [navBarMoreItems, data, userInfo]);

  const handleFetchLike = useCallback(async () => {
    // 防止频繁点击
    if (lottiePlay.current) return;
    const { id, thumbed } = data;

    try {
      handleUpdate?.({
        id,
        thumbed: !thumbed,
        likes: !thumbed ? +data.likes + 1 : +data.likes - 1,
        reposts: data.reposts,
        reportId: data.reportId,
      });
      if (!thumbed) {
        lottiePlay.current = true;
        animation.current?.play();
        // animatedCounterRef.current?.increment();
        sendAppsFlyerEvent(AFEventKey.AFAgoraPostLiked);
      } else {
        lottiePlay.current = false;
        // animatedCounterRef?.current?.decrement();
      }
      const res = await fetchLike({ postId: data.id, thumb: !thumbed });
      if (res.data.code !== 0) {
        res.data?.msg && Toast.error(res.data.msg);
        throw new Error(res.data?.msg);
      }
      lottiePlay.current = false;
      refreshThumbData();
    } catch (err) {
      handleUpdate?.({
        id: data.id,
        thumbed: !!thumbed,
        likes: thumbed ? +data.likes + 1 : +data.likes - 1,
        reposts: data.reposts,
        reportId: data.reportId,
      });
    }
  }, [handleUpdate, refreshThumbData, data, fetchLike]);

  const handleRoute = useCallback(
    (data: PostData) => {
      if (disableActions) {
        return;
      }
      if (data.type === 'USER') {
        if (data?.author === userInfo?.userId) router.push('/profile');
        else router.push({ pathname: '/main/user-profile/[userId]', params: { userId: data.author } });
      } else if (data.type === 'BOT') {
        router.push({ pathname: '/main/botDetail', params: { botId: data.author } });
      }
    },
    [disableActions, userInfo, router],
  );

  const renderMoreActionBtn = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[{ width: pxToDp(48), height: pxToDp(48), justifyContent: 'center', alignItems: 'center' }]}
      onPress={(event) => {
        setOpenMoreModal({ open: moreItems?.length > 0, nativeEvent: event?.nativeEvent });
      }}>
      <MenuDotsFilled width={pxToDp(46)} height={pxToDp(46)} color={computedThemeColor.text_secondary} />
    </TouchableOpacity>
  );

  const coverContentStyle = useMemo((): StyleProp<ViewStyle> => {
    if (data.video) {
      const fileProperty = JSON.parse(data?.thread[0]?.fileProperty || '[{"width": 16, "height": 9}]');
      return {
        aspectRatio: fileProperty[0].width / fileProperty[0].height,
      };
    } else {
      return {};
    }
  }, [data]);

  const getCoverContent = useCallback(() => {
    if (data.thread?.[0].images && data.thread?.[0].images.length > 1) {
      return (
        <View
          id="carousel-component"
          data-set={{ kind: 'basic-layouts', name: 'left-align' }}
          style={{ flex: 1, aspectRatio: 1 }}>
          <Carousel
            {...defaultSettings}
            ref={ref}
            data={data.thread[0].images}
            style={{ width: '100%' }}
            width={deviceWidthDp * 0.6}
            onSnapToItem={(index) => console.log('current index:', index)}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  borderRadius: pxToDp(12 * 2),
                  marginRight: pxToDp(24),
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ImageComponent
                  source={item}
                  placeholder={placeholderImg}
                  style={styles.contentImg}
                  size="middle"
                  contentFit="cover"
                />
              </View>
            )}
          />
        </View>
      );
    }
    return (
      <View style={{ width: '100%', height: '100%', position: 'relative' }}>
        {data.video ? (
          <VideoCard
            item={data}
            isActive={playingId === data.id}
            onPressPlay={onPressPlay}
            onPlayerReady={onPlayerReady}
          />
        ) : (
          <ImageComponent source={data.cover} placeholder={placeholderImg} style={styles.contentImg} size="middle" />
        )}
      </View>
    );
  }, [ImageComponent, data, onPlayerReady, onPressPlay, playingId]);

  const renderHeader = (showActionBtn: boolean = true, index?: number) => {
    // 列表只有第一个头像显示返回
    // TODO 没对齐如何解决
    const innerShowBack = showBack && (index === 0 || index === undefined);

    return (
      <View style={styles.header}>
        {innerShowBack ? (
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftOutline color="#ffffff" width={pxToDp(44)} height={pxToDp(44)} />
          </TouchableOpacity>
        ) : undefined}
        <TouchableOpacity onPress={() => handleRoute(data)}>
          <Avatar shape="square" img={data.avatar} isCurrentUser={data?.author === userInfo?.userId} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerContent} onPress={() => handleRoute(data)}>
          <Text style={[styles.nickname, { color: computedThemeColor.text }]} numberOfLines={1} ellipsizeMode="tail">
            {data.nickname}
          </Text>
          <Text style={[styles.date, { color: computedTheme === Theme.LIGHT ? computedThemeColor.text : '#80878E' }]}>
            {formatDateTime(data?.createdAt)}
          </Text>
        </TouchableOpacity>
        {/* more */}
        {showActionBtn && renderMoreActionBtn()}
      </View>
    );
  };

  const renderThreadContent = useCallback(
    (item: PostData['thread'][number], index: number) => {
      if (item?.video) {
        const getFileProperty = (): ImagePickerAsset[] => {
          try {
            if (item.fileProperty) {
              let filePropertyRaw: ImagePickerAsset[] = JSON.parse(item.fileProperty!);
              // 当在当前聊天室接收消息时，直接使用的是 websocket 返回的消息， 经过二次序列化，这里判断是否已反序列化为 object
              if (typeof filePropertyRaw === 'string') filePropertyRaw = JSON.parse(filePropertyRaw);
              return filePropertyRaw as ImagePickerAsset[];
            }
            return {} as ImagePickerAsset[];
          } catch {
            console.warn('Voice - Invalid fileProperty:', item.fileProperty, '\nthread title:', item.title);
            return {} as ImagePickerAsset[];
          }
        };
        return (
          <VideoPlayer playerId={index} source={item.video} fileProperty={getFileProperty()[0]} controls={false} />
        );
      } else {
        return !item.images?.length ? null : item.images.length === 1 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (item.images?.length) {
                ImageView.show({
                  backgroundColor: computedThemeColor.bg_primary,
                  closeColor: computedThemeColor.text,
                  images: item.images.map((x) => ({
                    uri: x,
                  })),
                });
              }
            }}>
            <ImageComponent
              width={data.thread.length > 1 ? pxToDp(590) : deviceWidthDp - pxToDp(64)}
              source={item.images[0]}
              placeholder={placeholderImg}
              style={styles.contentImg}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }}>
            <Carousel
              {...defaultSettings}
              ref={ref}
              data={item.images}
              style={{ width: '100%' }}
              width={deviceWidthDp * 0.6}
              onSnapToItem={(index) => console.log('current index:', index)}
              renderItem={({ item: image, index: i }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    borderRadius: pxToDp(12 * 2),
                    marginRight: pxToDp(24),
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (item.images?.length) {
                      ImageView.show({
                        imageIndex: i,
                        backgroundColor: computedThemeColor.bg_primary,
                        closeColor: computedThemeColor.text,
                        images: item.images.map((x) => ({
                          uri: x,
                        })),
                      });
                    }
                  }}>
                  <ImageComponent
                    source={image}
                    placeholder={placeholderImg}
                    style={styles.contentImg}
                    size="middle"
                    contentFit="cover"
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        );
      }
    },
    [ImageComponent, computedThemeColor.bg_primary, computedThemeColor.text, data.thread.length],
  );

  return (
    <Animated.View
      key={data.id}
      layout={LinearTransition}
      exiting={FadeOut}
      style={[
        {
          width: '100%',
          overflow: 'hidden',
        },
      ]}>
      {data?.reportId && data?.reportId > 0 ? (
        <ReportMask
          onRemove={() => {
            handleDelete?.(data.id);
            deleteContentAppPostsId({ id: String(data.id) }).then((res) => {
              if (res.data.code === 0) {
                callback?.(PostMoreAction.Delete);
              }
            });
          }}
          onShowPost={() => {
            // setShowReportPost(false);
            handleUpdate?.({
              id: data.id,
              thumbed: data.thumbed,
              likes: data.likes,
              reposts: data.reposts,
              reportId: -1,
            });
          }}
          style={style}
        />
      ) : (
        <View style={style}>
          {showHeader && renderHeader(moreItems?.length > 0)}
          <View style={{ position: 'relative' }}>
            {contentElliptical ? (
              <TouchableOpacity
                activeOpacity={1}
                disabled={showBack}
                onPress={() => {
                  onDoublePress({
                    onClick: () => {
                      router.push({
                        pathname: '/main/agora-details/[postId]',
                        params: {
                          postId: data.id,
                          id: data.id,
                        },
                      });
                    },
                    onDoubleClick: handleFetchLike,
                  });
                }}>
                {/* 帖文图片 */}
                {!!data.cover && (
                  <View
                    style={[
                      {
                        position: 'relative',
                        borderRadius: pxToDp(12 * 2),
                        aspectRatio: 1,
                        overflow: 'hidden',
                      },
                      coverContentStyle,
                    ]}>
                    <LottieView
                      autoPlay={false}
                      loop={false}
                      ref={animation}
                      // duration={4.5}
                      // speed={0.5}
                      style={[
                        {
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          width: pxToDp(300),
                          height: pxToDp(300),
                          backgroundColor: 'transparent',
                          borderRadius: pxToDp(12 * 2),
                          transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
                          zIndex: 999,
                        },
                      ]}
                      onAnimationLoaded={() => {
                        animation.current?.reset();
                      }}
                      onAnimationFinish={() => {
                        setTimeout(() => {
                          animation.current?.reset();
                          lottiePlay.current = false;
                        }, 1000);
                      }}
                      // Find more Lottie files at https://lottiefiles.com/featured
                      source={require('@/assets/animation/1748944260588.json')}
                    />
                    {getCoverContent()}
                  </View>
                )}

                {/* 帖文文本内容 */}
                {!!data.summary && (
                  <>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={numberOfLines}
                      style={[styles.contentText, { color: computedThemeColor.text }]}>
                      <HighlightedTags text={data.summary} />
                    </Text>

                    {/* 该 Text content  隐藏，用于判断是否更多内容 */}
                    <Text
                      ellipsizeMode="tail"
                      style={[styles.contentText, styles.contentHidden, { color: computedThemeColor.text }]}
                      numberOfLines={numberOfLines + 1}
                      onTextLayout={(e) => setHasMoreContent(e.nativeEvent.lines.length > numberOfLines)}>
                      <HighlightedTags text={data.summary} />
                    </Text>

                    {hasMoreContent && showMoreBtn && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={(showMoreBtn as { disabled?: boolean })?.disabled ?? false}
                        onPress={() => {
                          setNumberOfLines(Number.MAX_SAFE_INTEGER);
                        }}>
                        <Text style={[styles.readMore, { color: computedThemeColor.primary }]}>
                          {intl.formatMessage({ id: 'agora.post.readMore' })}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </TouchableOpacity>
            ) : (
              data.thread?.map((item, index, arr) => (
                <View key={index}>
                  {index !== 0 && renderHeader(false, index)}
                  <View style={{ paddingLeft: arr.length > 1 ? pxToDp(108) : 0 }}>
                    {renderThreadContent(item, index)}
                    {!!item.content && (
                      <Text style={[styles.contentText, { color: computedThemeColor.text }]}>
                        <HighlightedTags text={item.content} />
                      </Text>
                    )}

                    {index !== arr.length - 1 && <View style={styles.verticalLine} />}
                  </View>
                </View>
              ))
            )}
          </View>
          {/*点赞、评论*/}
          <View style={[styles.bottom, { marginTop: pxToDp(showHeader ? 16 : 24) }]}>
            <View style={{ flexDirection: 'row', gap: pxToDp(12) }}>
              {/* like */}
              <View style={styles.bottomBtn}>
                <TouchableOpacity disabled={likeLoading || disableActions} onPress={handleFetchLike}>
                  {data.thumbed ? (
                    <HeartFilled width={pxToDp(50)} height={pxToDp(50)} color={computedThemeColor.text_pink} />
                  ) : (
                    <HeartOutline width={pxToDp(50)} height={pxToDp(50)} color={computedThemeColor.text_secondary} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ minWidth: pxToDp(30), alignItems: 'flex-start' }}
                  onPress={() => {
                    if (data.likes) {
                      setShowLikeModal(!!data.likes);
                      getThumbData();
                    }
                  }}>
                  <AnimatedCounter
                    ref={animatedCounterRef}
                    value={data.likes}
                    fontSize={pxToDp(28)}
                    digitHeight={pxToDp(36)}
                    color={computedThemeColor.text_secondary}
                  />
                </TouchableOpacity>
              </View>

              {/* comment */}
              <TouchableOpacity
                style={styles.bottomBtn}
                disabled={disableActions}
                onPress={() => {
                  if (isInChat) {
                    return;
                  }
                  router.push({
                    pathname: '/main/agora-details/[postId]',
                    params: {
                      postId: data.id,
                      id: data.id,
                    },
                  });
                }}>
                <ChatOutline
                  style={styles.bottomBtnIcon}
                  height={pxToDp(46)}
                  width={pxToDp(46)}
                  color={computedThemeColor.text_secondary}
                />
                {!!data.reposts && (
                  <Text
                    style={[
                      styles.bottomBtnText,
                      {
                        color: data.reposts > 0 ? computedThemeColor.text_secondary : 'transparent',
                      },
                    ]}>
                    {data.reposts}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* more */}
            {!showHeader && showMoreBtn && renderMoreActionBtn()}
          </View>
        </View>
      )}
      <More
        visible={openMoreModal.open}
        navBarMoreItems={moreItems}
        post={data}
        nativeEvent={openMoreModal?.nativeEvent}
        onClose={(type) => {
          setOpenMoreModal({ open: false });
          setOpenReportModal(type === PostMoreAction.Report);
          callback?.(type);
        }}
      />
      <Modal
        fullWidth
        maskBlur={false}
        position="BOTTOM"
        visible={showLikeModal}
        maskClosable
        onClose={() => setShowLikeModal(false)}
        title={
          <Text
            style={[
              {
                fontSize: pxToDp(28),
                lineHeight: pxToDp(32),
                color: computedThemeColor.text,
                marginTop: pxToDp(12),
              },
            ]}>
            {intl.locale === 'ru'
              ? getRussianLike(data.likes)
              : intl.locale === 'en'
                ? `${intl.formatMessage({ id: 'agora.btn.likes' }, { n: data.likes })}${data.likes > 1 ? 's' : ''}`
                : intl.formatMessage({ id: 'agora.btn.likes' }, { n: data.likes })}
          </Text>
        }>
        <View
          style={{
            paddingHorizontal: pxToDp(32),
            paddingBottom: insets.bottom ?? pxToDp(32),
            borderTopColor: '#342E3F',
            borderWidth: pxToDp(1),
            minHeight: pxToDp(320),
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {thumbData?.data?.data?.list?.map((item) => (
              <ThumbUserItem
                key={item.userId}
                refetch={refreshThumbData}
                onClose={() => {
                  setShowLikeModal(false);
                }}
                item={item}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
      <ReportModal
        postId={data.id}
        visible={openReportModal}
        onClose={(value) => {
          setOpenReportModal(false);
          if (value) {
            handleUpdate?.({
              id: data.id,
              thumbed: data.thumbed,
              likes: data.likes,
              reposts: data.reposts,
              reportId: value,
            });
          }
        }}
      />
    </Animated.View>
  );
}
export { More, ReportModal };
export default memo(Post);

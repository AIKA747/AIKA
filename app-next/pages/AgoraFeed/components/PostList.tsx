import { ViewToken } from '@shopify/flash-list';
import { useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { createVideoPlayer, getCurrentVideoCacheSize, setVideoCacheSizeAsync, useVideoPlayer } from 'expo-video';
import { VideoSource } from 'expo-video/src/VideoPlayer.types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import Post, { PostData } from '@/components/Post';
import { PostMoreAction } from '@/components/Post/More/types';
import Skeleton from '@/components/Skeleton';
import { AFEventKey } from '@/constants/AFEventKey';
import { useConfigProvider } from '@/hooks/useConfig';
import {
  getContentAppPostId,
  getContentAppPostsFeed,
  getContentAppPostsFollow,
  getContentAppPostsPrivate,
} from '@/services/tiezi';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';

type FetchType = typeof getContentAppPostsFeed | typeof getContentAppPostsFollow | typeof getContentAppPostsPrivate;

const contentContainerStyle = {
  paddingHorizontal: pxToDp(32),
  // paddingVertical: pxToDp(24),
  paddingTop: pxToDp(32),
};

function PostList(props: { type: 'feed' | 'follow' | 'private' }) {
  const totalRef = useRef<number>(0);

  const listRef = useRef<ListRef<PostData>>(null);
  const {
    refreshConfig,
    setRefreshConfig,
    synchronizeAgoraData,
    onSynchronizeAgoraData,
    clearSynchronizeAgoraData,
    eventEmitter,
  } = useConfigProvider();

  const globalSearchParams = useGlobalSearchParams();
  const pushedIdRef = useRef<string>(undefined);
  const [playingId, setPlayingId] = useState<number>();
  // playersRef 用来存放当前可访问的 player 实例：Map<id, Player>
  const playersRef = useRef<Map<number, ReturnType<typeof useVideoPlayer>>>(new Map());

  // preloadPlayers: 用于 createVideoPlayer 预缓冲的临时 players，需要手动 release
  const preloadPlayersRef = useRef<Map<number, ReturnType<typeof useVideoPlayer>>>(new Map());

  eventEmitter?.useSubscription((value) => {
    if (value.method === 'home_page_back_top') {
      listRef.current?.scrollToTop();
    }
  });

  // --- 管理缓存大小（可选）: 这里设置为 500MB（示例），并在 mount 时配置 ---
  useEffect(() => {
    (async () => {
      try {
        // 500MB
        await setVideoCacheSizeAsync(500 * 1024 * 1024);
        const size = getCurrentVideoCacheSize();
        console.log('当前 video cache size bytes:', size);
      } catch (e) {
        console.warn('设置 video cache 大小失败', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (globalSearchParams.postId) pushedIdRef.current = globalSearchParams.postId as string;
  }, [globalSearchParams]);
  useFocusEffect(
    useCallback(() => {
      if (!pushedIdRef.current) return;
      getContentAppPostId({ id: pushedIdRef.current })
        .then((res) => {
          listRef.current?.handleUpdate('id', pushedIdRef.current!, (res.data?.data || {}) as any);
        })
        .finally(() => (pushedIdRef.current = undefined));
    }, []),
  );

  // 当组件失焦时暂停正在播放的视频；组件重新获得焦点时恢复
  useFocusEffect(
    useCallback(() => {
      const current = playingId ? playersRef.current.get(playingId) : null;
      // 恢复（如果之前有正在播放的）
      if (current) {
        try {
          current.play();
        } catch (e) {
          console.warn('resume on focus failed', e);
        }
      }
      return () => {
        if (current) {
          try {
            current.pause();
          } catch (e) {
            console.warn('pause on blur failed', e);
          }
        }
      };
    }, [playingId]),
  );

  useEffect(() => {
    if (
      (props.type === 'feed' && refreshConfig?.homePage?.feedRefresh) ||
      (props.type === 'private' && refreshConfig?.homePage?.privateRefresh) ||
      (props.type === 'follow' && refreshConfig?.homePage?.followRefresh)
    ) {
      listRef.current?.refresh();
      setRefreshConfig((v) => {
        return {
          ...v,
          homePage: {
            ...v?.homePage,
            privateRefresh: false,
            followRefresh: false,
            feedRefresh: false,
          },
        };
      });
    }
  }, [refreshConfig?.homePage, props.type, setRefreshConfig]);

  let fetchList: FetchType = getContentAppPostsFeed;
  if (props.type === 'follow') fetchList = getContentAppPostsFollow;
  if (props.type === 'private') fetchList = getContentAppPostsPrivate;

  // 父组件拿到子组件的 player 后会回调到这里
  const onPlayerReady = useCallback((id: number, player: ReturnType<typeof useVideoPlayer>) => {
    if (player) {
      playersRef.current.set(id, player);
    } else {
      playersRef.current.delete(id);
    }
  }, []);

  // 用户按播放按钮（或你用别的策略自动播放）时调用
  const onPressPlay = useCallback(
    (id: number) => {
      // 如果点中的是当前正在播放的，切换 pause/play
      const players = playersRef.current;
      const clickedPlayer = players.get(id);
      if (!clickedPlayer) {
        // 可能还没 ready
        console.warn('player not ready yet for id', id);
        return;
      }
      const current = playingId ? players.get(playingId) : null;
      if (playingId === id) {
        // 切换暂停/播放
        // 这里简单地用 pause (如果想实现切换，请使用事件监听状态)
        clickedPlayer.pause();
        setPlayingId(undefined);
      } else {
        // 暂停以前的
        if (current) {
          try {
            current.pause();
          } catch (e) {
            console.warn('pause previous failed', e);
          }
        }
        // 播放新的
        try {
          clickedPlayer.play();
          setPlayingId(id);
        } catch (e) {
          console.warn('play new failed', e);
        }
      }
    },
    [playingId],
  );

  const handleRequest = useCallback(
    async ({
      pageNo,
      pageSize,
    }: {
      pageNo: number;
      pageSize: number;
    }): Promise<{ data: PostData[]; total: number }> => {
      try {
        clearSynchronizeAgoraData();
        if (props.type === 'feed') {
          if (pageNo === 2) {
            sendAppsFlyerEvent(AFEventKey.AFAgoraFeedScrolledLoad2);
          }
          if (pageNo === 5) {
            sendAppsFlyerEvent(AFEventKey.AFAgoraFeedScrolledLoad5);
          }
          if (pageNo === 10) {
            sendAppsFlyerEvent(AFEventKey.AFAgoraFeedScrolledLoadover10);
          }
        }
        const res = await fetchList({ pageNo, pageSize } as any);
        totalRef.current = +res?.data?.data?.total || 0;
        return { data: res?.data?.data?.list || [], total: totalRef.current } as any;
      } catch (err) {
        return { data: [], total: totalRef.current || 0 };
      }
    },
    [clearSynchronizeAgoraData, fetchList, props.type],
  );

  const handleUpdate = (data: { id: number; thumbed: boolean; likes: number; reposts?: number; reportId?: number }) => {
    listRef.current?.handleUpdate('id', data.id, {
      thumbed: data.thumbed,
      likes: data.likes,
      reposts: data.reposts,
      reportId: data.reportId,
    });
  };

  useEffect(() => {
    for (const data of synchronizeAgoraData) {
      handleUpdate(data as any);
    }
  }, [synchronizeAgoraData]);

  const getNavBarMoreItems = useCallback(() => {
    switch (props.type) {
      case 'private':
        return [PostMoreAction.Share, PostMoreAction.Delete];
      case 'follow':
        return [PostMoreAction.Report, PostMoreAction.Share, PostMoreAction.Hide];
      default:
        return [PostMoreAction.Report, PostMoreAction.Share, PostMoreAction.Hide];
    }
  }, [props.type]);

  const renderItem = useCallback(
    ({ item, index }: { item: PostData & { loading?: boolean }; index: number }) => {
      return (
        <Skeleton.Card
          style={{ marginBottom: pxToDp(24) }}
          loading={item?.loading}
          active
          avatar={{
            shape: 'square',
          }}
          title
          image
          paragraph>
          <Post
            data={item}
            style={{ marginBottom: pxToDp(48) }}
            playingId={playingId}
            onPlayerReady={onPlayerReady}
            onPressPlay={onPressPlay}
            handleUpdate={(data) => {
              onSynchronizeAgoraData({ ...data });
            }}
            handleDelete={(id: number | string) => {
              listRef.current?.handleDelete('id', id);
            }}
            showMoreBtn={{ disabled: true }}
            navBarMoreItems={getNavBarMoreItems()}
            isImageAspectRatioPreserved
            callback={(type) => {
              if (type === PostMoreAction.Delete) {
                listRef.current?.refresh();
                setRefreshConfig((v) => {
                  return {
                    ...v,
                    homePage: {
                      ...v?.homePage,
                      feedRefresh: true,
                      followRefresh: true,
                      privateRefresh: true,
                    },
                  };
                });
              }
            }}
          />
        </Skeleton.Card>
      );
    },
    [getNavBarMoreItems, onPlayerReady, onPressPlay, onSynchronizeAgoraData, playingId, setRefreshConfig],
  );

  // 当前聚焦的视频在屏幕中心
  const onViewableItemsChanged = useRef(
    ({ viewableItems, data = [] }: { viewableItems: ViewToken<PostData>[]; data: PostData[] }) => {
      if (viewableItems.length === 0) return;
      const centerItem = viewableItems[Math.floor(viewableItems.length / 2)]?.item;
      if (!centerItem) return;

      // 切换播放视频
      if (centerItem.video && playingId !== centerItem.id) {
        const prev = playingId ? playersRef.current.get(playingId) : null;
        const next = playersRef.current.get(centerItem.id);
        prev?.pause();
        next?.play();
        setPlayingId(centerItem.id);
      } else {
        setPlayingId(undefined);
      }

      // 简单预加载下一条
      const nextIndex = data.findIndex((d) => d.id === centerItem.id) + 1;
      if (nextIndex < data.length) {
        const nextItem = data[nextIndex];
        if (nextItem.video && !preloadPlayersRef.current.has(nextItem.id)) {
          const src: VideoSource = { uri: nextItem.video, useCaching: true };
          const pre = createVideoPlayer(src);
          preloadPlayersRef.current.set(nextItem.id, pre);
        }
      }
    },
  ).current;

  // 卸载时清理所有 preloaded players
  useEffect(() => {
    return () => {
      preloadPlayersRef.current.forEach((p) => {
        try {
          p.release();
        } catch (e) {
          // ignore
        }
      });
      preloadPlayersRef.current.clear();
      // playersRef 中的 useVideoPlayer 创建的 player 会随组件卸载自动释放（由 hook 管理）
    };
  }, []);

  return (
    <List<PostData>
      ref={listRef}
      footerProps={{
        noMoreText: '',
      }}
      pageSize={10}
      request={handleRequest}
      renderItem={renderItem}
      contentContainerStyle={contentContainerStyle}
      showFirstScreenSkeleton
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 60, // 当项 60% 可见时视为可见
      }}
    />
  );
}

export default React.memo(PostList);

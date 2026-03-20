import { ViewToken } from '@shopify/flash-list';
import { useFocusEffect } from 'expo-router';
import { createVideoPlayer, useVideoPlayer } from 'expo-video';
import { VideoSource } from 'expo-video/src/VideoPlayer.types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import Post, { PostData } from '@/components/Post';
import { PostMoreAction } from '@/components/Post/More/types';
import { useConfigProvider } from '@/hooks/useConfig';
import { getContentAppPostsPrivate } from '@/services/tiezi';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

function PostsScene({ userId, navBarMoreItems }: { userId?: string; navBarMoreItems?: PostMoreAction[] }) {
  const { setRefreshConfig, synchronizeAgoraData, onSynchronizeAgoraData } = useConfigProvider();
  const listRef = useRef<ListRef<PostData>>(null);
  const [playingId, setPlayingId] = useState<number>();
  // playersRef 用来存放当前可访问的 player 实例：Map<id, Player>
  const playersRef = useRef<Map<number, ReturnType<typeof useVideoPlayer>>>(new Map());

  // preloadPlayers: 用于 createVideoPlayer 预缓冲的临时 players，需要手动 release
  const preloadPlayersRef = useRef<Map<number, ReturnType<typeof useVideoPlayer>>>(new Map());

  const handleUpdate = useCallback((data: { id: number; thumbed: boolean; likes: number; reposts?: number }) => {
    listRef.current?.handleUpdate('id', data.id, {
      thumbed: data.thumbed,
      likes: data.likes,
      reposts: data.reposts,
    });
  }, []);

  useEffect(() => {
    for (const data of synchronizeAgoraData) {
      handleUpdate(data as any);
    }
  }, [synchronizeAgoraData, handleUpdate]);

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

  const renderItem = useCallback(
    ({ item }: { item: PostData }) => {
      return (
        <Post
          key={item.id}
          data={item}
          style={{ marginBottom: pxToDp(48) }}
          showMoreBtn={{ disabled: true }}
          navBarMoreItems={navBarMoreItems || [PostMoreAction.Share, PostMoreAction.Delete]}
          isImageAspectRatioPreserved
          handleUpdate={(data) => {
            onSynchronizeAgoraData({ ...data });
          }}
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
          playingId={playingId}
          onPlayerReady={onPlayerReady}
          onPressPlay={onPressPlay}
        />
      );
    },
    [navBarMoreItems, onPlayerReady, onPressPlay, onSynchronizeAgoraData, playingId, setRefreshConfig],
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

  return (
    <View style={{ flex: 1 }}>
      <List
        ref={listRef}
        footerProps={{
          noMoreText: '',
        }}
        request={async (params) => {
          const res = await getContentAppPostsPrivate({
            pageNo: params.pageNo,
            pageSize: params.pageSize,
            userId,
          });
          return {
            data: res.data.data.list || [],
            total: res.data.data.total || 0,
          };
        }}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
}

export default React.memo(PostsScene);

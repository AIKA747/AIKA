import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { VideoSource } from 'expo-video/src/VideoPlayer.types';
import React, { FC, memo, useEffect, useMemo } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import { VolumeOffOutline, VolumeOnOutline } from '@/components/Icon';
import { PostData } from '@/components/Post';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

// --- VideoCard: 每个列表项 ---
// 注意：VideoCard 会创建并维护自己的 player（useVideoPlayer）并通过 onPlayerReady 回调把 player 传回父组件
const VideoCard: FC<{
  item: PostData;
  isActive: boolean; // 是否应该处于播放状态（由父组件控制）
  onPlayerReady: (id: number, player: ReturnType<typeof useVideoPlayer>) => void;
  onPressPlay: (id: number) => void;
}> = ({ item, isActive, onPlayerReady, onPressPlay }) => {
  const { computedThemeColor } = useConfigProvider();
  // 使用 VideoSource 对象，启用 useCaching 让 expo-video 内建缓存工作
  const videoSource: VideoSource = useMemo(() => ({ uri: item.video, useCaching: true }), [item]);

  // useVideoPlayer 会在组件 mount 时创建 player 并在 unmount 时释放
  const player = useVideoPlayer(videoSource, (player) => {
    // 可在这里设置默认播放参数
    player.loop = false;
    player.volume = 0;
    // 将 player 通知父组件
    onPlayerReady(item.id, player);
  });

  const { volume } = useEvent(player, 'volumeChange', { volume: player.volume });

  // 监听播放状态变化并把 isPlaying 显示出来（示例）
  // 如果父组件将 isActive 设为 true/false，我们在这里调用 player.play()/pause()
  useEffect(() => {
    if (!player) return;
    if (isActive) {
      // play
      try {
        player.play();
      } catch (e) {
        console.warn('player.play() failed', e);
      }
    } else {
      try {
        player.pause();
      } catch (e) {
        console.warn('player.pause() failed', e);
      }
    }
  }, [isActive, player]);
  return (
    <View style={styles.card}>
      <View style={styles.videoContainer}>
        {/* VideoView 显示 player */}
        {player ? (
          <VideoView
            player={player}
            style={styles.video}
            nativeControls={false}
            allowsPictureInPicture
            pointerEvents="none"
            contentFit="cover"
          />
        ) : (
          <View style={[styles.video, styles.placeholder]}>
            <ActivityIndicator color={computedThemeColor.primary} size={pxToDp(32)} />
          </View>
        )}
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: pxToDp(20),
          bottom: 20,
          backgroundColor: computedThemeColor.text_secondary + 80,
          borderRadius: '50%',
          padding: pxToDp(18),
        }}
        onPress={(e) => {
          e.stopPropagation();
          console.log('volume:', volume);
          if (volume === 0) {
            player.volume = 1;
          } else {
            player.volume = 0;
          }
        }}>
        {volume === 0 ? (
          <VolumeOffOutline color={computedThemeColor.text} width={pxToDp(36)} height={pxToDp(36)} />
        ) : (
          <VolumeOnOutline color={computedThemeColor.text} width={pxToDp(36)} height={pxToDp(36)} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default memo(VideoCard);

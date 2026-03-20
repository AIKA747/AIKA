import { useEvent } from 'expo';
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types';
import { useVideoPlayer, VideoView } from 'expo-video';
import { VideoSource } from 'expo-video/src/VideoPlayer.types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { FullScreenOutline, PauseCircleFilled, PauseFilled, PlayCircleFilled, PlayFilled } from '@/components/Icon';
import { showModal } from '@/components/Modal';
import { MediaViewer as VideoFullscreen } from '@/components/VideoPlayer/VideoFullscreen';
import { useConfigProvider } from '@/hooks/useConfig';
import { useVideoProvider } from '@/hooks/useVideo';
import { formatMilliseconds } from '@/utils/formatDateTime';
import pxToDp from '@/utils/pxToDp';

const SCREEN_WIDTH = pxToDp(300);
export function VideoPlayer({
  source,
  playerId,
  fileProperty,
  controls = false,
}: {
  playerId: number;
  source: VideoSource;
  controls?: boolean;
  fileProperty?: ImagePickerAsset;
}) {
  const { computedThemeColor } = useConfigProvider();
  const { registerPlayer, play, pause, replay } = useVideoProvider();
  const videoRef = useRef<VideoView>(null);
  const progressRef = useRef<View | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0); // 毫秒
  // 控制图标透明度
  const opacity = useSharedValue(1);
  // 进度条
  const progress = useSharedValue(0); // 0~1
  // 拖拽中标记（避免 timeUpdate 抢占显示）
  const isSeekingRef = useRef(false);

  const player = useVideoPlayer(source, (player) => {
    player.loop = false;
    player.timeUpdateEventInterval = 250; // 每250ms更新一次时间
    registerPlayer(playerId, player);
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  const fadeOutAfterDelay = useCallback(() => {
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 });
    }, 3000);
  }, [opacity]);

  useEffect(() => {
    let animationFrameId = 0;
    const updateCurrentTime = () => {
      if (isPlaying) {
        // 主要在播放时更新
        setCurrentTime(player.currentTime);
        setDuration(player.duration);
        const p = player.currentTime / player.duration;
        // 平滑更新视觉进度
        progress.value = withTiming(Math.max(0, Math.min(1, p)), { duration: 120 });
      }
      animationFrameId = requestAnimationFrame(updateCurrentTime);
    };

    if (isPlaying) {
      updateCurrentTime();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, player, progress]);

  useEffect(() => {
    if (player.duration != null && player.currentTime >= player.duration) {
      opacity.value = withTiming(1, { duration: 300 });
      console.log('播放完毕了');
    }
  }, [opacity, player.currentTime, player.duration]);

  const togglePlayPause = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation();
      if (isPlaying) {
        // 当前正在播放 -> 暂停
        console.log('当前正在播放 -> 暂停');
        pause(playerId);
        // player.pause();
        opacity.value = withTiming(1, { duration: 300 }); // 显示按钮
      } else {
        // 当前是暂停 -> 播放
        console.log('当前是暂停 -> 播放', playerId);
        if (player.duration && player.currentTime >= player.duration) {
          progress.value = 0;
          replay(playerId);
          // player.replay();
        } else {
          play(playerId);
          // player.play();
        }
        opacity.value = withTiming(1, { duration: 300 }, (finished) => {
          if (finished) {
            scheduleOnRN(fadeOutAfterDelay);
          }
        });
      }
    },
    [
      isPlaying,
      pause,
      playerId,
      opacity,
      player.duration,
      player.currentTime,
      progress,
      replay,
      play,
      fadeOutAfterDelay,
    ],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // JS 侧的 seek 函数（必须在 JS 线程执行）
  const seekTo = (timeSec: number) => {
    if (!player) return;
    // 精确 seek 最可靠的方式是直接设置 currentTime（社区/文档示例中有此用法）
    try {
      // 某些 platform 可能用 replay() / play() 组合，但直接赋 currentTime 足够精确
      player.currentTime = timeSec;
      // player.seekBy(timeSec);
      // player.pause();
      setCurrentTime(timeSec);
    } catch (err) {
      console.warn('seek error', err);
    }
  };

  // 手势：Pan 用来拖动进度；onStart 标记正在拖动，onUpdate 更新 progress（UI），onEnd 做真正的 seek
  const pan = Gesture.Pan()
    .onStart(() => {
      isSeekingRef.current = true;
    })
    .onUpdate((event) => {
      // event 中不同平台可能包含不同字段（x / absoluteX / translationX）
      // 我们先尝试 event.x / event.absoluteX，再退回到 translation（相对移动 + 已有 left）
      let newProgress = event.x / SCREEN_WIDTH;
      if (newProgress < 0) newProgress = 0;
      if (newProgress > 1) newProgress = 1;
      progress.value = newProgress;
    })
    .onEnd(() => {
      // 结束拖动 -> 真正 seek 到时间
      if (duration > 0) {
        const newTime = progress.value * duration;
        scheduleOnRN(seekTo, newTime);
      }
    });

  // 已播放部分的样式
  const playedStyle = useAnimatedStyle(() => ({
    backgroundColor: computedThemeColor.primary,
    width: `${progress.value * 100}%`,
  }));

  // 拖动小圆点
  const handleStyle = useAnimatedStyle(() => ({
    backgroundColor: computedThemeColor.primary,
    transform: [
      { translateX: progress.value * SCREEN_WIDTH - 8 }, // 小圆点偏移
    ],
  }));

  const getSourceUri = useCallback(() => {
    if (typeof source === 'object') {
      return source?.uri || '';
    }
    return String(source);
  }, [source]);

  return (
    <Pressable style={styles.contentContainer} onPress={togglePlayPause}>
      <VideoView
        ref={videoRef}
        style={[styles.video, { aspectRatio: fileProperty ? fileProperty.width / fileProperty.height : '16/9' }]}
        player={player}
        fullscreenOptions={{
          enable: true,
          autoExitOnRotate: true,
        }}
        allowsPictureInPicture={false}
        nativeControls={false}
        pointerEvents="none"
        contentFit="cover"
        // contentPosition={}
        // surfaceType="surfaceView"
      />
      {/* 透明遮罩层 */}
      {controls ? (
        <Animated.View style={[styles.overlay, animatedStyle]}>
          {isPlaying ? (
            <PauseCircleFilled color="#fff" width={pxToDp(84)} height={pxToDp(84)} />
          ) : (
            <PlayCircleFilled color="#fff" width={pxToDp(84)} height={pxToDp(84)} />
          )}
        </Animated.View>
      ) : (
        <Animated.View style={[styles.controlsContainer, animatedStyle]}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'flex-start',
              gap: pxToDp(24),
            }}>
            <Pressable onPress={togglePlayPause}>
              {isPlaying ? (
                <PauseFilled color="#fff" width={pxToDp(40)} height={pxToDp(40)} />
              ) : (
                <PlayFilled color="#fff" width={pxToDp(40)} height={pxToDp(40)} />
              )}
            </Pressable>
            <View style={[styles.progress]}>
              <GestureDetector gesture={pan}>
                <View ref={progressRef} style={styles.progressContainer}>
                  {/* 背景条 */}
                  <View style={styles.progressTrack} />
                  {/* 已播放条 */}
                  <Animated.View style={[styles.progressPlayed, playedStyle]} />
                  {/* 拖动圆点 */}
                  <Animated.View style={[styles.progressHandle, handleStyle]} />
                </View>
              </GestureDetector>
              <Animated.View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Animated.Text style={styles.progressText}>{formatMilliseconds(currentTime * 1000)} / </Animated.Text>
                <Animated.Text style={styles.progressText}>
                  {formatMilliseconds(fileProperty?.duration || player.duration || 0)}
                </Animated.Text>
              </Animated.View>
            </View>
          </View>
          <Pressable
            onPress={() => {
              pause(playerId);
              // player.pause();
              showModal((onClose) => {
                return <VideoFullscreen uri={getSourceUri()} fileProperty={fileProperty} onClose={onClose} />;
              });
            }}>
            <FullScreenOutline color="#fff" width={pxToDp(40)} height={pxToDp(40)} />
          </Pressable>
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pxToDp(10),
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    padding: pxToDp(12),
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0, .65)',
    gap: pxToDp(24),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: pxToDp(24),
  },
  progressContainer: {
    width: pxToDp(300),
    height: 20,
    justifyContent: 'center',
  },
  progressTrack: {
    position: 'absolute',
    height: pxToDp(4),
    backgroundColor: '#666',
    width: '100%',
    borderRadius: 2,
  },
  progressPlayed: {
    position: 'absolute',
    height: pxToDp(4),
    borderRadius: 2,
  },
  progressHandle: {
    position: 'absolute',
    width: pxToDp(24),
    height: pxToDp(24),
    borderRadius: pxToDp(24),
    top: pxToDp(7),
  },
  progressText: {
    fontSize: pxToDp(20),
    color: '#fff',
  },
});

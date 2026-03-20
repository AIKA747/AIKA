import { useFocusEffect } from '@react-navigation/native';
import { type VideoSource, useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, StatusBar, BackHandler, Platform, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useVideoPlayback } from '@/hooks/useVideoPlayback';

import { LoadingSpinner } from './LoadingSpinner';
import { VideoControls } from './VideoControls';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoScreenProps {
  source: VideoSource;
  onClose: () => void;
  autoPlay?: boolean;
  title?: string;
  startTime?: number;
}

export function VideoScreen({ source, onClose, autoPlay = false, title, startTime = 0 }: VideoScreenProps) {
  const videoRef = useRef<VideoView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const controlsOpacity = useSharedValue(1);
  const { setActivePlayer, clearActivePlayer } = useVideoPlayback();

  // 初始化播放器
  const player = useVideoPlayer(source, (player) => {
    player.loop = false;
    player.timeUpdateEventInterval = 250;

    // 设置初始播放位置
    if (startTime > 0) {
      player.currentTime = startTime;
    }
  });

  // 管理全局播放状态
  useEffect(() => {
    setActivePlayer(player);

    return () => {
      clearActivePlayer();
      player.pause();
    };
  }, [player, setActivePlayer, clearActivePlayer]);

  // 处理 Android 返回按钮
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        onClose();
        return true;
      };

      if (Platform.OS === 'android') {
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => subscription.remove();
      }
    }, [onClose]),
  );

  // 通过检查视频时长来判断是否加载完成，并检测错误
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    let errorCheckCount = 0;

    const checkVideoLoaded = () => {
      // 如果视频时长大于0，说明视频已加载
      if (player.duration > 0) {
        setIsLoading(false);
        setIsVideoReady(true);
        setHasError(false);
        return true;
      }

      // 检查是否出现错误情况
      errorCheckCount++;

      // 如果多次检查后仍然没有时长信息，可能出现了错误
      if (errorCheckCount > 50) {
        // 大约5秒后
        setIsLoading(false);
        setHasError(true);
        return true;
      }

      return false;
    };

    // 初始检查
    if (checkVideoLoaded()) {
      return;
    }

    // 设置轮询检查视频状态
    interval = setInterval(() => {
      if (checkVideoLoaded()) {
        clearInterval(interval);
        clearTimeout(timeout);
      }
    }, 100);

    // 设置超时，避免无限等待
    timeout = setTimeout(() => {
      clearInterval(interval);
      if (!isVideoReady) {
        setIsLoading(false);
        setHasError(true);
      }
    }, 10000); // 10秒超时

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [player, isVideoReady]);

  // 监听播放状态变化
  useEffect(() => {
    const checkPlayingStatus = () => {
      // 如果视频开始播放，说明已加载完成
      if (player.playing && !isVideoReady) {
        setIsLoading(false);
        setIsVideoReady(true);
      }
    };

    const interval = setInterval(checkPlayingStatus, 500);
    return () => clearInterval(interval);
  }, [player, isVideoReady]);

  // 自动播放处理
  useEffect(() => {
    if (autoPlay && isVideoReady && !hasError) {
      const timer = setTimeout(() => {
        player.play();

        // 自动隐藏控制条
        setTimeout(() => {
          controlsOpacity.value = withTiming(0, { duration: 500 });
        }, 3000);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoPlay, isVideoReady, hasError, player, controlsOpacity]);

  const toggleControls = useCallback(() => {
    controlsOpacity.value = withTiming(controlsOpacity.value === 0 ? 1 : 0, { duration: 300 });
  }, [controlsOpacity]);

  const handlePlay = useCallback(() => {
    if (isVideoReady) {
      player.play();

      // 播放后自动隐藏控制条
      setTimeout(() => {
        controlsOpacity.value = withTiming(0, { duration: 500 });
      }, 3000);
    }
  }, [player, isVideoReady, controlsOpacity]);

  const handlePause = useCallback(() => {
    player.pause();
    // 暂停时显示控制条
    controlsOpacity.value = withTiming(1, { duration: 300 });
  }, [player, controlsOpacity]);

  // 进度跳转 - 使用 currentTime 属性
  const handleSeek = useCallback(
    (time: number) => {
      if (isVideoReady) {
        player.currentTime = time;
      }
    },
    [player, isVideoReady],
  );

  // 重播 - 使用 currentTime 属性
  const handleReplay = useCallback(() => {
    if (isVideoReady) {
      player.currentTime = 0;
      player.play();

      // 重播后自动隐藏控制条
      setTimeout(() => {
        controlsOpacity.value = withTiming(0, { duration: 500 });
      }, 3000);
    }
  }, [player, isVideoReady, controlsOpacity]);

  // 重试加载视频 - 由于没有 reload 方法，我们建议父组件重新渲染此组件
  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setIsVideoReady(false);

    // 尝试重新初始化播放器
    // 注意: expo-video 没有 reload 方法，我们需要重新初始化播放器
    // 这通常通过重新渲染组件或使用 key 属性来实现
    // 这里我们假设父组件会重新渲染 VideoScreen
  }, []);

  // 控制条动画样式
  const controlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  if (hasError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>视频加载失败</Text>
          <Text style={styles.errorSubText}>请检查网络连接或视频链接</Text>
          <View style={styles.errorButtons}>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.buttonText}>重试</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar hidden />

      <View style={styles.videoContainer}>
        <VideoView
          ref={videoRef}
          style={styles.video}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
          contentFit="contain"
          // 移除了不存在的 onError 事件
        />

        {/* 加载指示器 */}
        {isLoading && <LoadingSpinner />}

        {/* 控制条覆盖层 */}
        <Animated.View style={[styles.controlsOverlay, controlsStyle]}>
          <VideoControls
            player={player}
            title={title}
            isVideoReady={isVideoReady}
            isLoading={isLoading}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
            onReplay={handleReplay}
            onClose={onClose}
            onToggleControls={toggleControls}
          />
        </Animated.View>

        {/* 点击区域 - 切换控制条显示 */}
        <View style={styles.tapArea} onTouchEnd={toggleControls} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  tapArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: '#8E8E93',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

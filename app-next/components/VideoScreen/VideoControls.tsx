// components/VideoControls.tsx
import Slider from '@react-native-community/slider';
import { type VideoPlayer } from 'expo-video';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 简单的图标组件
const PlayIcon = ({ size, color }: { size: number; color: string }) => (
  <Text style={{ fontSize: size, color }}>▶</Text>
);

const PauseIcon = ({ size, color }: { size: number; color: string }) => (
  <Text style={{ fontSize: size, color }}>⏸</Text>
);

const ReplayIcon = ({ size, color }: { size: number; color: string }) => (
  <Text style={{ fontSize: size, color }}>↺</Text>
);

const CloseIcon = ({ size, color }: { size: number; color: string }) => (
  <Text style={{ fontSize: size, color }}>×</Text>
);

interface VideoControlsProps {
  player: VideoPlayer;
  title?: string;
  isVideoReady: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onReplay: () => void;
  onClose: () => void;
  onToggleControls: () => void;
}

export function VideoControls({
  player,
  title,
  isVideoReady,
  isLoading,
  onPlay,
  onPause,
  onSeek,
  onReplay,
  onClose,
  onToggleControls,
}: VideoControlsProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);

  // 更新时间进度
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateProgress = () => {
      if (player && isVideoReady && !isSeeking) {
        setCurrentTime(player.currentTime);
        setDuration(player.duration);
      }
    };

    if (isVideoReady) {
      interval = setInterval(updateProgress, 250);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [player, isVideoReady, isSeeking]);

  const handleSeekStart = useCallback(() => {
    if (!isVideoReady) return;
    setIsSeeking(true);
  }, [isVideoReady]);

  const handleSeek = useCallback(
    (value: number) => {
      if (!isVideoReady) return;
      setSeekTime(value * duration);
    },
    [duration, isVideoReady],
  );

  const handleSeekEnd = useCallback(
    (value: number) => {
      if (!isVideoReady) return;
      const newTime = value * duration;
      onSeek(newTime);
      setCurrentTime(newTime);
      setIsSeeking(false);
    },
    [duration, onSeek, isVideoReady],
  );

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  const progress = duration > 0 ? (isSeeking ? seekTime / duration : currentTime / duration) : 0;
  const displayTime = isSeeking ? seekTime : currentTime;
  const isPlaying = player.playing;
  const isEnded = duration > 0 && currentTime >= duration;

  return (
    <View style={styles.controls}>
      {/* 顶部栏 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <CloseIcon size={24} color="#fff" />
        </TouchableOpacity>
        {title && (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
        <View style={styles.placeholder} />
      </View>

      {/* 中央播放按钮 */}
      <View style={styles.centerControls}>
        {isLoading ? (
          <Text style={styles.loadingText}>加载中...</Text>
        ) : !isVideoReady ? (
          <Text style={styles.loadingText}>准备中...</Text>
        ) : isEnded ? (
          <TouchableOpacity onPress={onReplay} style={styles.largeButton}>
            <ReplayIcon size={48} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={isPlaying ? onPause : onPlay} style={styles.largeButton} disabled={!isVideoReady}>
            {isPlaying ? <PauseIcon size={48} color="#fff" /> : <PlayIcon size={48} color="#fff" />}
          </TouchableOpacity>
        )}
      </View>

      {/* 底部控制条 */}
      {isVideoReady && (
        <View style={styles.bottomBar}>
          <Text style={styles.timeText}>{formatTime(displayTime)}</Text>

          <Slider
            style={styles.slider}
            value={progress}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="rgba(255,255,255,0.4)"
            thumbTintColor="#fff"
            onSlidingStart={handleSeekStart}
            onValueChange={handleSeek}
            onSlidingComplete={handleSeekEnd}
            disabled={!isVideoReady}
          />

          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    height: 80,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeButton: {
    padding: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});

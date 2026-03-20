import Slider from '@react-native-community/slider';
import { useRequest } from 'ahooks';
import { useEvent } from 'expo';
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { CloseOutline, LoadingOutline, PauseFilled, PlayFilled } from '@/components/Icon';
import { DownloadFilled } from '@/components/Icon/download-filled';
import Toast from '@/components/Toast';
import { useConfigProvider } from '@/hooks/useConfig';
import { getIntl } from '@/hooks/useLocale';
import { bytesToMB, convertVideoUrlRegex } from '@/utils';
import downloadCacheFile, { downloadCacheFileCheck } from '@/utils/downloadCacheFile';
import { formatMilliseconds } from '@/utils/formatDateTime';
import pxToDp from '@/utils/pxToDp';

const { width, height } = Dimensions.get('window');

interface ViewerProps {
  uri: string;
  fileProperty?: ImagePickerAsset;
  onClose: () => void;
}

const playbackRates = [
  { value: 1, label: 'x 1' },
  { value: 1.5, label: 'x 1.5' },
  { value: 2, label: 'x 2' },
];
export function MediaViewer({ uri, fileProperty, onClose }: ViewerProps) {
  const intl = getIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor } = useConfigProvider();
  const [playbackRateIndex, setPlaybackRateIndex] = useState<number>(0);

  const [position, setPosition] = useState<number>(0); // 毫秒
  const [mainPosition, setMainPosition] = useState<number>(0); // 毫秒
  const [duration, setDuration] = useState<number>(0); // 毫秒
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  const [isOriginalFile, setIsOriginalFile] = useState<boolean>(true);
  const controlsOpacity = useSharedValue(1);
  const showCenterOpacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const bgOpacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const progressWidth = useSharedValue(0);

  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
  });

  const { loading, runAsync: downloadFile } = useRequest(() => handleDownloadFile(), {
    debounceWait: 300,
    manual: true,
    onSuccess: () => {
      setIsOriginalFile(true);
    },
  });
  const { isPlaying, oldIsPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  // 使用 requestAnimationFrame 来更新进度
  useEffect(() => {
    let animationFrameId = 0;
    const update = () => {
      if (!isSeeking) {
        setPosition(player.currentTime * 1000);
        setDuration(player.duration * 1000);
      }
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [player, isSeeking]);

  useEffect(() => {
    const load = async () => {
      const orgUrl = convertVideoUrlRegex(uri);
      console.log('orgUrl:', orgUrl);
      const localPath = await downloadCacheFileCheck({ httpUrl: orgUrl.replace('/out/', '/') });
      if (localPath) {
        setIsOriginalFile(true);
        await player.replaceAsync(localPath);
        console.log('加载的是本地视频');
      } else {
        setIsOriginalFile(uri.startsWith('file://'));
      }
      player.play();
    };
    load();
  }, [player, uri]);

  const toggleControls = useCallback(() => {
    controlsOpacity.value = withTiming(controlsOpacity.value === 1 ? 0 : 1, {
      duration: 300,
    });
  }, [controlsOpacity]);

  const controlsStyle = useAnimatedStyle(() => {
    if (translateY.value > 2) {
      return {
        opacity: 0,
      };
    }
    return {
      opacity: controlsOpacity.value,
    };
  });

  const showCenterStyle = useAnimatedStyle(() => {
    return {
      opacity: showCenterOpacity.value,
    };
  });

  const sliderTimeStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(showCenterOpacity.value > 0 ? 0 : 1),
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0,0,0,${bgOpacity.value})`,
  }));

  const innerContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const downloadBgProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value * 100}%`,
    };
  });

  const handleSeek = useCallback(
    (time: number) => {
      showCenterOpacity.value = withTiming(0);
      if (player) {
        console.log('time:', time, oldIsPlaying);
        const str = String(duration);
        const timeStr = String(time);
        const len = str.substring(str.lastIndexOf('.') + 1, str.length).length;
        const timeLen = timeStr.substring(timeStr.lastIndexOf('.') + 1, timeStr.length).length;
        setIsSeeking(false);
        setPosition(time);
        setMainPosition(time);
        player.currentTime = time; // 跳转
        // player.seekBy(time);
        if (oldIsPlaying) {
          player.play();
        }
      }
    },
    [duration, oldIsPlaying, player, showCenterOpacity],
  );

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = event.translationY;
      bgOpacity.value = interpolate(Math.abs(event.translationY), [0, 300], [1, 0.3]);
      // 根据拖动距离计算新的缩放比例
      scale.value = interpolate(Math.abs(event.translationY), [0, 200], [1, 0.5]);
    })
    .onEnd((event) => {
      if (Math.abs(event.translationY) > 100) {
        scheduleOnRN(onClose);
      } else {
        translateY.value = withSpring(0);
        bgOpacity.value = withTiming(1);
        scale.value = withTiming(1);
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = scale.value === 1 ? withSpring(2) : withSpring(1);
    });

  const handleDownloadFile = useCallback(async () => {
    const orgUrl = convertVideoUrlRegex(uri);
    const httpUrl = orgUrl.replace('/out/', '/');
    const localPath = await downloadCacheFileCheck({ httpUrl });
    console.log('localPath:', localPath);
    if (localPath === '') {
      const params = {
        httpUrl,
        localUrl: '',
        onProgress: ({ percent }: any) => {
          console.log('percent:', percent);
          // onProgress?.(percent);
        },
      };
      if (httpUrl.startsWith('file://')) {
        params.localUrl = httpUrl;
      }
      try {
        const res = await downloadCacheFile(params);
        console.log('res:', res);
        if (res) {
          Toast.success(intl.formatMessage({ id: 'succeed' }));
          await player.replaceAsync(res);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    } else {
      Toast.info(intl.formatMessage({ id: 'FileExists' }) + localPath);
    }
  }, [intl, player, uri]);

  useEffect(() => {
    // 3秒之后主动隐藏 操作按钮
    const timer = setTimeout(() => {
      toggleControls();
    }, 3000);
    if (isSeeking) {
      if (timer) {
        clearTimeout(timer);
      }
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isSeeking, toggleControls]);

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[{ flex: 1 }, innerContainerStyle]}>
          <GestureDetector gesture={doubleTapGesture}>
            <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={toggleControls}>
              <Animated.View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <VideoView
                  player={player}
                  style={{ width: '100%', height: '100%' }}
                  nativeControls={false}
                  pointerEvents="none"
                  fullscreenOptions={{
                    enable: true,
                    autoExitOnRotate: true,
                  }}
                />
              </Animated.View>
            </TouchableOpacity>
          </GestureDetector>
        </Animated.View>
      </GestureDetector>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
          },
          showCenterStyle,
        ]}>
        <Animated.Text style={[{ fontSize: pxToDp(60), color: computedThemeColor.text_white }]}>
          {formatMilliseconds(mainPosition)} / {formatMilliseconds(fileProperty?.duration || duration || 0)}
        </Animated.Text>
      </Animated.View>
      <Animated.View style={[styles.topBar, controlsStyle]}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            width: pxToDp(60),
            height: pxToDp(60),
            borderRadius: pxToDp(60),
            backgroundColor: 'rgba(70,70,70,0.85)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CloseOutline width={pxToDp(30)} height={pxToDp(30)} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.bottomBar, { marginBottom: insets.bottom }, controlsStyle]}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ marginBottom: pxToDp(8) }}
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                if (player.duration != null && player.currentTime >= player.duration) {
                  // setProgress(0);
                  player.replay();
                }
                player.play();
              }
            }}>
            {isPlaying ? (
              <PauseFilled color="#fff" width={pxToDp(60)} height={pxToDp(60)} />
            ) : (
              <PlayFilled width={pxToDp(60)} height={pxToDp(60)} color="#fff" />
            )}
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Animated.Text style={[styles.time, sliderTimeStyle]}>
                {formatMilliseconds(position)} / {formatMilliseconds(fileProperty?.duration || duration || 0)}
              </Animated.Text>
              <TouchableOpacity
                activeOpacity={1}
                style={{ paddingVertical: pxToDp(12), paddingHorizontal: pxToDp(16) }}
                onPress={() => {
                  setPlaybackRateIndex((v) => {
                    if (v === playbackRates.length - 1) {
                      player.playbackRate = playbackRates[0].value;
                      return 0;
                    } else {
                      player.playbackRate = playbackRates[v + 1].value;
                      return v + 1;
                    }
                  });
                }}>
                <Text style={styles.time}>
                  {playbackRateIndex === 0
                    ? intl.formatMessage({ id: 'Speed' })
                    : playbackRates[playbackRateIndex].label}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={fileProperty?.duration || duration || 0}
                value={position}
                minimumTrackTintColor={computedThemeColor.text_white}
                maximumTrackTintColor={computedThemeColor.text_secondary}
                thumbTintColor={computedThemeColor.text_white}
                onSlidingStart={() => {
                  if (isPlaying) {
                    player.pause();
                  }
                  showCenterOpacity.value = withTiming(1);
                  setIsSeeking(true);
                }}
                onSlidingComplete={handleSeek}
                onValueChange={(time: number) => {
                  setMainPosition(time);
                  player.currentTime = time; // 跳转
                  // player.seekBy(time);
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {!isOriginalFile ? (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                handleDownloadFile();
              }}>
              <Animated.View
                style={[
                  {
                    width: '30%',
                    height: pxToDp(100),
                    backgroundColor: computedThemeColor.text_secondary,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                  },
                  downloadBgProgressStyle,
                ]}
              />
              <View style={{ paddingHorizontal: pxToDp(24), paddingVertical: pxToDp(14) }}>
                <Text style={styles.actionText}>
                  {intl.formatMessage({ id: 'FullVideo' })} {bytesToMB(fileProperty?.fileSize || 0)}MB
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              await downloadFile();
            }}>
            <View style={[styles.actionBtn, { padding: pxToDp(18) }]}>
              {loading ? (
                <LoadingOutline width={pxToDp(40)} height={pxToDp(40)} color="#fff" />
              ) : (
                <DownloadFilled width={pxToDp(40)} height={pxToDp(40)} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#000',
    zIndex: 1000,
  },
  media: {
    width,
    height,
  },
  topBar: {
    position: 'absolute',
    top: pxToDp(100),
    left: pxToDp(40),
    zIndex: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: pxToDp(24),
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: pxToDp(26),
    gap: pxToDp(24),
  },
  slider: {
    flex: 1,
  },
  time: {
    color: '#fff',
    fontSize: pxToDp(22),
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  actionBtn: {
    backgroundColor: 'rgba(70,70,70,0.85)',
    borderRadius: pxToDp(100),
    overflow: 'hidden',
    opacity: 0.65,
  },
  actionText: {
    color: '#fff',
    fontSize: pxToDp(22),
  },
});

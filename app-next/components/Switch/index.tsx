import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useConfigProvider } from '@/hooks/useConfig';

import styles from './styles';
import { SwitchProps } from './types';

export default function Switch({
  style,
  value,
  onChange,
  loading,
  trackColors = { on: '#C60C93', off: '#80878E' },
  ...restProps
}: SwitchProps) {
  const isOn = useSharedValue(false);
  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const { computedThemeColor } = useConfigProvider();

  useEffect(() => {
    isOn.value = value || false;
  }, [isOn, value]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(Number(isOn.value), [0, 1], [trackColors.off, trackColors.on]);
    const colorValue = withTiming(color, { duration: 400 });

    return {
      backgroundColor: colorValue,
      borderRadius: height.value / 2,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(isOn.value), [0, 1], [0, width.value - height.value]);
    const translateValue = withTiming(moveValue, { duration: 400 });

    return {
      backgroundColor: computedThemeColor.text_white,
      transform: [{ translateX: translateValue }],
      borderRadius: height.value / 2,
    };
  });

  return (
    <Pressable
      disabled={loading}
      onPress={() => {
        onChange?.(!value);
      }}>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
          width.value = e.nativeEvent.layout.width;
        }}
        style={[styles.container, style, trackAnimatedStyle]}
        {...restProps}>
        <Animated.View style={[styles.circle, thumbAnimatedStyle]}>
          {loading && <ActivityIndicator size="small" color={computedThemeColor.primary} />}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

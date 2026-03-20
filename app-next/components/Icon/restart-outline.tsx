import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {
  loading?: boolean;
}

export const RestartOutline = (props: IProps) => {
  const { loading, ...rest } = props;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      // 创建循环旋转动画
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinValue.stopAnimation(); // 重置旋转角度
    }
    return () => {
      spinValue.stopAnimation();
    };
  }, [loading, spinValue]);

  // 将动画值映射到旋转角度 (0° ~ 360°)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...rest}>
        <Path
          fill="currentColor"
          d="M18.364 3.058a.75.75 0 0 1 .75.75V8.05a.75.75 0 0 1-.75.75h-4.243a.75.75 0 0 1 0-1.5h2.36a7.251 7.251 0 1 0 2.523 3.822.75.75 0 1 1 1.45-.387 8.75 8.75 0 1 1-2.84-4.447v-2.48a.75.75 0 0 1 .75-.75"
          clipRule="evenodd"
          fillRule="evenodd"
        />
      </Svg>
    </Animated.View>
  );
};

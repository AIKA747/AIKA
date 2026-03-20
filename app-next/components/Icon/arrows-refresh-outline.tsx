import React, { useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {
  loading?: boolean;
}

export const ArrowsRefreshOutline = (props: IProps) => {
  const { loading, ...rest } = props;
  const spinValue = new Animated.Value(0);

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
  }, [loading]);

  // 将动画值映射到旋转角度 (0° ~ 360°)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...rest}>
        <Path
          fill="currentColor"
          d="M2.93 11.2c.072-4.96 4.146-8.95 9.149-8.95a9.16 9.16 0 0 1 7.814 4.357.75.75 0 0 1-1.277.786 7.66 7.66 0 0 0-6.537-3.643c-4.185 0-7.575 3.328-7.648 7.448l.4-.397a.75.75 0 0 1 1.057 1.065l-1.68 1.666a.75.75 0 0 1-1.056 0l-1.68-1.666A.75.75 0 1 1 2.528 10.8zm16.856-.733a.75.75 0 0 1 1.055 0l1.686 1.666a.75.75 0 1 1-1.054 1.067l-.41-.405c-.07 4.965-4.161 8.955-9.18 8.955a9.2 9.2 0 0 1-7.842-4.356.75.75 0 1 1 1.277-.788 7.7 7.7 0 0 0 6.565 3.644c4.206 0 7.61-3.333 7.68-7.453l-.408.403a.75.75 0 1 1-1.055-1.067z"
          clipRule="evenodd"
          fillRule="evenodd"
        />
      </Svg>
    </Animated.View>
  );
};

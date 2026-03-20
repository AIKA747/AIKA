import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { ClipPath, Defs, G, Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {
  loading?: boolean;
}

export const LoadingOutline = (props: IProps) => {
  const { loading = true, ...rest } = props;
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
        <G clipPath="url(#a)">
          <Path
            fill="currentColor"
            d="M12 22c-1.35 0-2.66-.263-3.892-.785A10 10 0 0 1 4.93 19.07 9.97 9.97 0 0 1 2 12a.703.703 0 0 1 1.407 0 8.58 8.58 0 0 0 2.517 6.078A8.55 8.55 0 0 0 12 20.593a8.58 8.58 0 0 0 6.078-2.517A8.55 8.55 0 0 0 20.593 12a8.5 8.5 0 0 0-.675-3.346 8.6 8.6 0 0 0-1.841-2.732A8.55 8.55 0 0 0 12 3.406.703.703 0 1 1 12 2c1.35 0 2.66.263 3.893.785A10 10 0 0 1 19.07 4.93 9.98 9.98 0 0 1 21.998 12c0 1.35-.264 2.66-.786 3.893a9.9 9.9 0 0 1-2.141 3.177A9.98 9.98 0 0 1 12 22"
          />
        </G>
        <Defs>
          <ClipPath id="a">
            <Path fill="currentColor" d="M2 2h20v20H2z" />
          </ClipPath>
        </Defs>
      </Svg>
    </Animated.View>
  );
};

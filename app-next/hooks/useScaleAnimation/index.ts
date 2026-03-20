import { Animated, useAnimatedValue } from 'react-native';

type ScaleHook = {
  scale: Animated.Value; // 用于绑定到 transform
  scaleUp: (duration?: number, toValue?: number) => void;
  scaleDown: (duration?: number, toValue?: number) => void;
};

export function useScaleAnimation(initialScale: number = 0): ScaleHook {
  const scale = useAnimatedValue(initialScale);

  const scaleUp = (toValue: number = 1) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 1.5,
      bounciness: 0.5,
    }).start();
  };

  const scaleDown = (toValue: number = 0) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return { scale, scaleUp, scaleDown };
}

import { Animated, useAnimatedValue } from 'react-native';

type FadeHook = {
  opacity: Animated.Value; // 用于绑定到 style
  fadeIn: (duration?: number) => void;
  fadeOut: (duration?: number) => void;
};

export function useFadeAnimation(initialVisible: number = 500): FadeHook {
  const opacity = useAnimatedValue(0);

  const fadeIn = (duration: number = initialVisible) => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (duration: number = initialVisible) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return { opacity, fadeIn, fadeOut };
}

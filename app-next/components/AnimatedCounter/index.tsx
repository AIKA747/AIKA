import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

export type AnimatedCounterRef = {
  increment: (num?: number) => void;
  decrement: (num?: number) => void;
};
// 类型定义
type DigitAnimationProps = {
  currentDigit: number;
  nextDigit: number;
  direction: 'up' | 'down';
  height: number;
  fontSize: number;
  opacity?: number;
  color?: string;
  isAnimating: boolean;
  onAnimationComplete?: () => void;
};

type CounterProps<T> = {
  value?: T;
  fontSize?: number;
  digitHeight?: number;
  color?: string;
};

// 数字动画组件（修复版）
const DigitAnimation: React.FC<DigitAnimationProps> = ({
  currentDigit,
  nextDigit,
  direction,
  height,
  fontSize,
  color,
  opacity,
  isAnimating,
  onAnimationComplete,
}) => {
  const { computedThemeColor } = useConfigProvider();
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    if (isAnimating) {
      animationProgress.value = 0;
      animationProgress.value = withTiming(
        1,
        {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished && onAnimationComplete) {
            scheduleOnRN(onAnimationComplete);
          }
        },
      );
    }
  }, [isAnimating, animationProgress, onAnimationComplete]);

  // 当前数字的动画样式
  const currentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [0, direction === 'up' ? -height : height],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }],
    };
  });

  // 下一个数字的动画样式
  const nextAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [direction === 'up' ? height : -height, 0],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={[styles.digitContainer, { height, width: fontSize * 0.6 }]}>
      {/* 当前数字 - 动画中会移出 */}
      <Animated.View style={[styles.animatedDigit, currentAnimatedStyle, { height }]}>
        <Text style={[styles.digit, { color: color ?? computedThemeColor.text, opacity, fontSize, height }]}>
          {currentDigit}
        </Text>
      </Animated.View>

      {/* 下一个数字 - 动画中会移入 */}
      <Animated.View style={[styles.animatedDigit, nextAnimatedStyle, { height }]}>
        <Text style={[styles.digit, { color: color ?? computedThemeColor.text, opacity, fontSize, height }]}>
          {nextDigit}
        </Text>
      </Animated.View>

      {/* 静态显示的数字 - 当不需要动画时显示 */}
      {!isAnimating && (
        <View style={[styles.animatedDigit, { height }]}>
          <Text style={[styles.digit, { color: color ?? computedThemeColor.text, opacity, fontSize, height }]}>
            {currentDigit}
          </Text>
        </View>
      )}
    </View>
  );
};

// 计数器组件（修复版）
const AnimatedCounter = (
  { fontSize = pxToDp(48), digitHeight = pxToDp(60), color, value = 0 }: CounterProps<number>,
  ref: ForwardedRef<AnimatedCounterRef>,
) => {
  const { computedThemeColor } = useConfigProvider();
  const isAnimatingRef = useRef(false);
  const [currentValue, setCurrentValue] = useState<number>(value);
  const [displayValue, setDisplayValue] = useState<number>(value);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down'>('up');
  const [animatingDigits, setAnimatingDigits] = useState<number[]>([]);
  const [completedAnimations, setCompletedAnimations] = useState<number>(0);

  // 数字处理函数
  const getDigits = (num: number): number[] => {
    return Math.abs(num).toString().split('').map(Number);
  };
  // 开始动画
  const startAnimation = useCallback(
    (newValue: number, direction: 'up' | 'down') => {
      setAnimationDirection(direction);
      setAnimatingDigits(getDigits(currentValue));
      setCurrentValue(newValue);
    },
    [currentValue],
  );

  // 增加数值
  const increment = useCallback(
    (num = 1) => {
      const newValue = currentValue + num;
      startAnimation(newValue, 'up');
    },
    [currentValue, startAnimation],
  );

  // 减少数值
  const decrement = useCallback(
    (num = 1) => {
      if (currentValue <= 0) return;
      const newValue = Math.max(0, currentValue - num);
      startAnimation(newValue, 'down');
    },
    [currentValue, startAnimation],
  );

  // 当所有数字动画完成时
  const handleAnimationComplete = useCallback(() => {
    setCompletedAnimations((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (isAnimatingRef.current) return;
    if (value > currentValue) {
      isAnimatingRef.current = true;
      increment();
    }
    if (value < currentValue) {
      isAnimatingRef.current = true;
      decrement();
    }
  }, [value, currentValue, increment, decrement]);

  // 当所有数字动画完成后更新显示值
  useEffect(() => {
    if (animatingDigits.length > 0 && completedAnimations === animatingDigits.length) {
      // 动画完成，更新最终显示
      setDisplayValue(currentValue);

      // 重置动画状态
      setAnimatingDigits([]);
      setCompletedAnimations(0);

      // 允许下一次动画
      isAnimatingRef.current = false;
    }
  }, [completedAnimations, animatingDigits, currentValue]);

  // 获取当前显示的数字数组
  const prevDigits = useMemo(() => getDigits(displayValue), [displayValue]);
  const nextDigits = useMemo(() => getDigits(currentValue), [currentValue]);

  const animatingMap = prevDigits.map((d, i) => d !== nextDigits[i]);

  // 补齐位数，确保数组长度一致
  const maxLength = useMemo(() => Math.max(prevDigits.length, nextDigits.length), [prevDigits, nextDigits]);
  const paddedCurrent = useMemo(
    () =>
      prevDigits.length < maxLength ? [...Array(maxLength - prevDigits.length).fill(0), ...prevDigits] : prevDigits,
    [prevDigits, maxLength],
  );

  const paddedNext = useMemo(
    () =>
      nextDigits.length < maxLength ? [...Array(maxLength - nextDigits.length).fill(0), ...nextDigits] : nextDigits,
    [nextDigits, maxLength],
  );

  useImperativeHandle(ref, () => {
    return {
      increment,
      decrement,
    };
  }, [increment, decrement]);

  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        {paddedCurrent.map((digit, index) => {
          const nextDigit = paddedNext[index];
          // const shouldAnimate = animatingDigits.length > 0 && digit !== nextDigit;
          const shouldAnimate = animatingMap[index];

          return (
            <View key={index} style={styles.digitWrapper}>
              {shouldAnimate ? (
                <DigitAnimation
                  currentDigit={digit}
                  nextDigit={nextDigit}
                  direction={animationDirection}
                  height={digitHeight}
                  fontSize={fontSize}
                  color={color ?? computedThemeColor.text} // 为了不显示 0
                  opacity={digit === 0 && index === 0 ? 0 : 1}
                  isAnimating={shouldAnimate}
                  onAnimationComplete={handleAnimationComplete}
                />
              ) : (
                <View style={[styles.digitContainer, { height: digitHeight }]}>
                  <Text
                    style={[
                      styles.digit,
                      {
                        height: digitHeight,
                        fontSize,
                        color: currentValue === 0 ? 'transparent' : color,
                      },
                    ]}>
                    {digit}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitWrapper: {
    overflow: 'hidden',
  },
  digitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  animatedDigit: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digit: {
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
const AnimatedCounterComp: <T>(
  props: CounterProps<T> & {
    ref?: Ref<AnimatedCounterRef>;
  },
) => ReactNode = forwardRef(AnimatedCounter) as unknown as any;
export default AnimatedCounterComp;

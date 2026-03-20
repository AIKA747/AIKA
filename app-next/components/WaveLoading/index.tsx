import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import pxToDp from '@/utils/pxToDp';

import { DotLoadingProps } from './types';

const duration = 600;

export default function WaveLoading(props: DotLoadingProps) {
  const { size = pxToDp(4), color = '#80878E', repeat = 7, style, run = false } = props;
  const gap = pxToDp(2);
  const height = pxToDp(32);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refList = [useRef(new Animated.Value(0.5)), useRef(new Animated.Value(0.4)), useRef(new Animated.Value(0.8))];
  useEffect(() => {
    const timerList: NodeJS.Timeout[] = [];
    const animationList: Animated.CompositeAnimation[] = [];
    if (!run) {
      animationList.forEach((item) => {
        item.reset();
      });
      timerList.forEach((item) => {
        clearTimeout(item);
      });
      return;
    }

    refList.map((animRef, index) => {
      // 怎么用delay来祝贺
      const timer = setTimeout(
        () => {
          const animation = Animated.loop(
            Animated.timing(animRef.current, {
              toValue: 1,
              duration,
              easing: Easing.linear,
              useNativeDriver: false,
            }),
          );
          animation.start();
          animationList.push(animation);
        },
        (duration / refList.length) * index,
      );
      timerList.push(timer);
    });
    return () => {
      timerList.forEach((item) => {
        clearTimeout(item);
      });
      animationList.forEach((item) => {
        item.stop();
      });
    };
  }, [refList, run]);

  return (
    <View
      style={[
        {
          width:
            // 每个柱子宽度相加
            size * 3 * repeat +
            // 每个柱子左右间距相加
            gap * 2 * 3 * repeat,
          height,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
        },
        style,
      ]}>
      {new Array(repeat).fill(0).map((_) => {
        return refList.map((item, index) => {
          let random = Math.random();
          if (random < 0.8) random = 0.8;

          const translateY = item.current.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, height * random, 0],
          });
          return (
            <Animated.View
              key={index}
              style={[
                {
                  width: size,
                  height: translateY,
                  backgroundColor: color,
                  borderRadius: size,
                  marginHorizontal: gap,
                  // transform: [{ translateY }],
                },
              ]}
            />
          );
        });
      })}
    </View>
  );
}

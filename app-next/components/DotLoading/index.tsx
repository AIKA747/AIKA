import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import pxToDp from '@/utils/pxToDp';

import { DotLoadingProps } from './types';

const duration = 600;

export default function DotLoading({ size = pxToDp(10), color = '#FFF', style }: DotLoadingProps) {
  const anim0Ref = useRef(new Animated.Value(0));
  const anim1Ref = useRef(new Animated.Value(0));
  const anim2Ref = useRef(new Animated.Value(0));
  const refList = [anim0Ref, anim1Ref, anim2Ref];
  useEffect(() => {
    refList.map((animRef, index) => {
      // 怎么用delay来祝贺
      setTimeout(
        () => {
          Animated.loop(
            Animated.timing(animRef.current, {
              toValue: 1,
              duration,
              easing: Easing.linear,
              useNativeDriver: false,
            }),
          ).start();
        },
        (duration / refList.length) * index,
      );
    });
  }, [refList]);

  return (
    <View
      style={[
        {
          width: size * 6,
          height: size * 4,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      {refList.map((item, index) => {
        const translateY = item.current.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [-size, size, -size],
        });
        return (
          <Animated.View
            key={index}
            style={[
              {
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: size,
                marginHorizontal: pxToDp(5),
                transform: [{ translateY }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

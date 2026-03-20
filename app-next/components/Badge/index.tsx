import React, { useRef } from 'react';
import { Text, View } from 'react-native';

import AnimatedCounter, { AnimatedCounterRef } from '@/components/AnimatedCounter';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles, { StyleCount } from './styles';
import { BadgeProps } from './types';

/**
 * 注意区分有无children两种情况
 */
export default function Badge(props: BadgeProps) {
  const { computedThemeColor } = useConfigProvider();
  const { color, children, style, count, overflowCount = 99, offset, showDot } = props;

  const animatedCounterRef = useRef<AnimatedCounterRef>(null);

  const countEl = (
    <View
      style={[
        StyleCount.container,
        {
          backgroundColor: computedThemeColor.primary,
        },
        !children ? undefined : StyleCount.absolute, // 没有children时将使用一般定位
        !children ? style : undefined, // 没有children时将作用于数字区域
        offset
          ? {
              right: offset.x,
              top: offset.y,
            }
          : undefined,
      ]}>
      {count > overflowCount ? (
        <Text
          style={[
            StyleCount.text,
            {
              color: computedThemeColor.text,
            },
          ]}>
          {`${overflowCount}+`}
        </Text>
      ) : (
        <AnimatedCounter
          ref={animatedCounterRef}
          value={count}
          fontSize={pxToDp(20)}
          digitHeight={pxToDp(24)}
          color={computedThemeColor.text}
        />
      )}
    </View>
  );

  //红点
  const dotEl = (
    <View
      style={[
        StyleCount.containerDot,
        StyleCount.absolute,
        {
          backgroundColor: color || computedThemeColor.primary,
        },

        offset
          ? {
              right: offset.x,
              top: offset.y,
            }
          : undefined,
      ]}
    />
  );

  const wrapperEl = showDot ? dotEl : countEl;
  if (!children) {
    return wrapperEl;
  }
  return (
    <View style={[styles.container, style, { position: 'relative' }]}>
      {children}
      {count ? wrapperEl : undefined}
    </View>
  );
}

import React, { PropsWithChildren, ReactElement } from 'react';
import { Platform, StyleSheet, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';
import { useConfigProvider } from '@/hooks/useConfig';

type Props = PropsWithChildren<{
  header: ReactElement;
  headerHeight: number;
  style?: StyleProp<ViewStyle> | undefined;
  minHeader?: ReactElement;
  headerBackgroundColor?: string;
}>;

export default function ParallaxScrollView({
  children,
  header,
  headerHeight = 0,
  style,
  minHeader,
  headerBackgroundColor,
}: Props) {
  const { computedThemeColor } = useConfigProvider();
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const offsetY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75],
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-headerHeight, 0, headerHeight], [2, 1, 1]),
        },
      ],
      opacity: interpolate(offsetY.value, [0, headerHeight - 200 - insets.top], [1, 0], Extrapolation.CLAMP),
    };
  });

  const navbarAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(offsetY.value, [0, headerHeight - 150 - insets.top], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      zIndex: 1,
    };
  });

  return (
    <ThemedView style={[styles.container, style]}>
      <Animated.View style={[{ position: 'absolute', top: 0, width: '100%' }, navbarAnimatedStyle]}>
        {minHeader}
      </Animated.View>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        contentContainerStyle={{ paddingBottom: 0 }}
        // 这里可以添加一些其他的属性
        {...Platform.select({
          android: {
            nestedScrollEnabled: true,
            scrollEnabled: false,
          },
          default: {},
        })}>
        <Animated.View
          style={[
            styles.header,
            {
              maxHeight: headerHeight,
              backgroundColor: headerBackgroundColor || computedThemeColor.bg_primary,
            },
            headerAnimatedStyle,
          ]}>
          {header}
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});

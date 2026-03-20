import React from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { PlushFilled } from '@/components/Icon';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import { mainButtonStyles, styles } from './styles';
import { FloatingActionButtonItemProps, FloatingActionButtonProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

const FloatingActionButtonItem = ({ isExpanded, index, item, onClose }: FloatingActionButtonItemProps) => {
  const { icon, label, color, onPress } = item;
  const animatedStyles = useAnimatedStyle(() => {
    const moveValue = isExpanded.value ? OFFSET * index : 0;
    const translateValue = withSpring(-moveValue, SPRING_CONFIG);
    const delay = index * 100;

    const scaleValue = isExpanded.value ? 1 : 0;

    return {
      transform: [
        { translateY: translateValue },
        {
          scale: withDelay(delay, withTiming(scaleValue)),
        },
      ],
    };
  });
  return (
    <AnimatedPressable
      activeOpacity={0.9}
      style={[animatedStyles, styles.button, { zIndex: index }]}
      onPress={(e) => {
        e.stopPropagation();
        onPress?.(e);
        onClose?.();
      }}>
      {label && <Animated.Text style={[styles.label, { position: 'absolute', right: OFFSET }]}>{label}</Animated.Text>}
      <Animated.View style={[styles.icon, styles.shadow, { backgroundColor: color ?? '#82cab2' }]}>
        {icon ? icon : <Animated.Text style={styles.label}>{label}</Animated.Text>}
      </Animated.View>
    </AnimatedPressable>
  );
};

const FloatingActionButton = ({ position = 'bottom-right', items, icon }: FloatingActionButtonProps) => {
  const isExpanded = useSharedValue(false);
  const { computedThemeColor } = useConfigProvider();

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

  const plusIconStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(Number(isExpanded.value), [0, 0], [0, 0]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? '45deg' : '0deg';

    return {
      transform: [{ translateX: translateValue }, { rotate: withTiming(rotateValue) }],
    };
  });
  return (
    <Animated.View style={[styles.buttonContainer]}>
      <AnimatedPressable
        activeOpacity={0.9}
        onPress={handlePress}
        style={[
          plusIconStyle,
          styles.shadow,
          mainButtonStyles.button,
          { backgroundColor: computedThemeColor.primary },
        ]}>
        {icon ?? <PlushFilled width={pxToDp(42)} height={pxToDp(42)} color="#ffffff" />}
      </AnimatedPressable>
      {items.map((item, index) => (
        <FloatingActionButtonItem
          key={`action-item-${index}`}
          isExpanded={isExpanded}
          index={index + 1}
          item={item}
          onClose={handlePress}
        />
      ))}
    </Animated.View>
  );
};

export default FloatingActionButton;

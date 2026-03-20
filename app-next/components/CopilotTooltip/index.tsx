import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useCopilot } from 'react-native-copilot';

import { HandOutline, RightOutline } from '@/components/Icon';
import pxToDp from '@/utils/pxToDp';

import { styles } from './styles';
import type { TooltipProps } from './types';

export const CopilotTooltip = ({ labels }: TooltipProps) => {
  const { stop, goToNth, currentStep } = useCopilot();
  const router = useRouter();

  const handleNext = useCallback(() => {
    if (currentStep?.order === 1) {
      void stop();
      router.push('/boarding/chats');
    } else if (currentStep?.order === 2) {
      void stop();
      router.push('/boarding/sphere');
    } else if (currentStep?.order === 6) {
      void stop();
      router.push({
        pathname: '/boarding/fairyTales',
      });
    } else if (currentStep?.order === 7) {
      void stop();
      router.push({
        pathname: `/boarding/fairyTalesDetails`,
      });
    } else if (currentStep?.order === 8) {
      void stop();
      router.push({
        pathname: '/boarding/fairyTalesChat',
      });
    } else if (currentStep?.order === 9) {
      void stop();
    } else {
      void goToNth((currentStep?.order || 0) + 1);
    }
  }, [currentStep, goToNth, router, stop]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.tooltipContainer}
      onPress={() => {
        handleNext();
      }}>
      <View style={styles.tooltipHeader}>
        <Text testID="stepName" style={styles.tooltipName}>
          {currentStep?.name}
        </Text>
        <View>
          <RightOutline color={'#fff'} />
        </View>
      </View>
      <Text testID="stepDescription" style={styles.tooltipText}>
        {currentStep?.text}
      </Text>
    </TouchableOpacity>
  );
};
export const CopilotTooltipMask = ({ direction }: { direction?: 'top' | 'left' | 'right' | 'button' }) => {
  const directionStyle: StyleProp<ViewStyle> = useMemo(() => {
    switch (direction) {
      case 'left':
        return {
          transform: [{ rotate: '-90deg' }, { scaleX: -1 }],
        };
      case 'right':
        return {
          transform: [{ rotate: '90deg' }],
        };
      case 'button':
        return {
          transform: [{ rotate: '180deg' }],
        };
      default:
        return {};
    }
  }, [direction]);
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={[
          {
            padding: pxToDp(20),
            backgroundColor: '#fff',
            borderRadius: pxToDp(24),
            boxShadow: '0px 0px 31.3px 0px #301190',
          },
          directionStyle,
        ]}>
        <HandOutline width={pxToDp(44)} height={pxToDp(44)} color={'#C60C93'} />
      </View>
    </View>
  );
};

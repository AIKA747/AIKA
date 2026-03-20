import React, { useEffect, useMemo } from 'react';
import { Text } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import RootSiblings from 'react-native-root-siblings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckboxTwoTone, CloseCircleOutline, DangerTriangleOutline, InfoCircleOutline } from '@/components/Icon';
import FontFamily from '@/constants/FontFamily';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp, { deviceWidthDp } from '@/utils/pxToDp';

import { ToastProps } from './types';

// TODO 动画
function Toast(props: ToastProps) {
  const { content, type, duration = 3000, onClose } = props;
  const { computedThemeColor } = useConfigProvider();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [duration, onClose]);

  const wrapperStyle = useMemo(() => {
    let backgroundColor = computedThemeColor.toast_success_bg;
    let borderColor = computedThemeColor.toast_success_border;
    switch (type) {
      case 'error':
        backgroundColor = computedThemeColor.toast_error_bg;
        borderColor = computedThemeColor.toast_error_border;
        break;
      case 'info':
        backgroundColor = computedThemeColor.toast_info_bg;
        borderColor = computedThemeColor.toast_info_border;
        break;
      case 'warning':
        backgroundColor = computedThemeColor.toast_warning_bg;
        borderColor = computedThemeColor.toast_warning_border;
        break;
      default:
        backgroundColor = computedThemeColor.toast_success_bg;
        borderColor = computedThemeColor.toast_success_border;
        break;
    }
    return {
      backgroundColor,
      borderColor,
    };
  }, [computedThemeColor, type]);
  const textColor = useMemo(() => {
    switch (type) {
      case 'error':
        return computedThemeColor.text_error;
      case 'info':
        return computedThemeColor.text_info;
      case 'warning':
        return computedThemeColor.text_warning;
      default:
        return computedThemeColor.text_success;
    }
  }, [computedThemeColor, type]);
  const Icon = ({
    name,
    size,
    ...rest
  }: {
    name: ToastProps['type'];
    size: number;
    color: string;
    style?: StyleProp<ViewStyle> | undefined;
  }) => {
    switch (name) {
      case 'error':
        return <CloseCircleOutline width={size} height={size} {...rest} />;
      case 'warning':
        return <DangerTriangleOutline width={size} height={size} {...rest} />;
      case 'info':
        return <InfoCircleOutline width={size} height={size} {...rest} />;
      default:
        return <CheckboxTwoTone width={size} height={size} checked twoToneColor="#fff" {...rest} />;
    }
  };
  return (
    <Animated.View
      pointerEvents="box-none"
      accessibilityRole="alert"
      accessible={true}
      entering={SlideInUp}
      exiting={SlideOutUp}
      style={[
        {
          position: 'absolute',
          top: insets.top,
          left: pxToDp(16 * 2),
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: pxToDp(15 * 2),
          borderRadius: pxToDp(14 * 2),
          borderWidth: pxToDp(2),
          width: deviceWidthDp - pxToDp(16 * 2) * 2,
          zIndex: 9999,
        },
        wrapperStyle,
      ]}>
      <Icon style={[{ marginRight: pxToDp(28) }]} size={pxToDp(48)} name={type} color={textColor} />
      <Text
        style={[
          {
            flex: 1,
            color: textColor,
            fontSize: pxToDp(32),
            lineHeight: pxToDp(42),
            fontFamily: FontFamily.InterMedium,
          },
        ]}
        numberOfLines={3}
        ellipsizeMode="tail">
        {content}
      </Text>
    </Animated.View>
  );
}
function show(props: ToastProps) {
  let instance = { destroy: () => {} };
  const onClose = () => {
    props?.onClose?.();
    instance?.destroy();
  };
  instance = new RootSiblings(<Toast {...props} onClose={onClose} />);
  return instance;
}

function hide(toast: any) {
  if (toast instanceof RootSiblings) {
    toast.destroy();
  } else {
    console.warn(`Toast.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof toast}\` instead.`);
  }
}

function _formatToastProps(props: string | Omit<ToastProps, 'type'>) {
  if (typeof props === 'string') {
    return {
      content: props,
    };
  }
  return { ...props };
}

function success(props: string | Omit<ToastProps, 'type'>) {
  return show({ type: 'success', ..._formatToastProps(props) });
}
function error(props: string | Omit<ToastProps, 'type'>) {
  console.log('error:', props);
  return show({ type: 'error', ..._formatToastProps(props) });
}
function info(props: string | Omit<ToastProps, 'type'>) {
  return show({ type: 'info', ..._formatToastProps(props) });
}
function warning(props: string | Omit<ToastProps, 'type'>) {
  return show({ type: 'warning', ..._formatToastProps(props) });
}

export default Object.assign(Toast, { success, info, error, warning, hide });

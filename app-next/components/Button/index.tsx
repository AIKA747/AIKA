import React, { useCallback, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { LoadingOutline } from '@/components/Icon';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles, {
  StyleBorderCircle,
  StyleBorderSquare,
  StyleSizeLarge,
  StyleSizeMiddle,
  StyleSizeSmall,
  StyleTypeConfirm,
  StyleTypeDefault,
  StyleTypeDisabled,
  StyleTypeGhost,
  StyleTypeLink,
  StyleTypePrimary,
  StyleTypeText,
} from './styles';
import { ButtonProps } from './types';

export default function Button({
  icon,
  iconAfter,
  type = 'default',
  disabled = false,
  size = 'middle',
  borderType = 'square',
  onPress,
  children,
  style,
  wrapperStyle,
  textStyle,
  loading = false,
  ...resetProps
}: ButtonProps) {
  const { computedThemeColor } = useConfigProvider();
  const StyleType = {
    default: StyleTypeDefault,
    text: StyleTypeText,
    ghost: StyleTypeGhost,
    confirm: StyleTypeConfirm,
    primary: StyleTypePrimary,
    link: StyleTypeLink,
    disabled: StyleTypeDisabled,
  }[disabled ? 'disabled' : type];

  const ColorType = {
    default: StyleType.text.color,
    text: StyleType.text.color,
    ghost: StyleType.text.color,
    confirm: StyleType.text.color,
    primary: StyleType.text.color,
    link: StyleType.text.color,
    disabled: StyleType.text.color,
  }[disabled ? 'disabled' : type];

  const StyleBorder = {
    circle: StyleBorderCircle,
    square: StyleBorderSquare,
  }[borderType];

  // const colorsType = {
  //   default: ['#00000000', '#00000000', '#00000000'],
  //   text: ['#00000000', '#00000000', '#00000000'],
  //   ghost: [computedThemeColor.bg, computedThemeColor.bg, computedThemeColor.bg],
  //   confirm: ['#181818', '#181818', '#181818'],
  //   primary: ['#C60C93', '#A07BED', '#301190'],
  //   link: ['#fff', '#fff', '#fff'],
  //   disabled: ['#595b60', '#595b60', '#595b60'],
  // }[disabled ? 'disabled' : type];

  const StyleSize = {
    large: StyleSizeLarge,
    middle: StyleSizeMiddle,
    small: StyleSizeSmall,
  }[size];

  // onPress是Promise时可以显示loading
  const [innerLoading, setInnerLoading] = useState(false);

  const onInnerPress = useCallback(async () => {
    setInnerLoading(true);
    try {
      await onPress?.();
    } catch {
      // noting
    }
    setInnerLoading(false);
  }, [onPress]);

  const loadingMerge = loading || innerLoading;

  const innerIcon = useMemo(() => {
    if (loadingMerge) {
      return <LoadingOutline width={pxToDp(40)} height={pxToDp(40)} color={StyleType.text.color} />;
    }
    return icon;
  }, [loadingMerge, icon, StyleType.text.color]);

  const innerChildren = (
    <View
      {...resetProps}
      style={[
        styles.container,
        StyleType.container,
        StyleBorder.container,
        StyleSize.container,
        {
          opacity: loadingMerge ? 0.8 : 1,
          // backgroundColor: 'red',
        },
        style,
      ]}
      // colors={colorsType}
      // locations={[0, 0.5, 1]}
      // start={[0, 1]}
      // end={[1, 0]}
    >
      {type === 'primary' && (
        <View
          style={[
            {
              borderWidth: pxToDp(2),
              borderColor: computedThemeColor.primary,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: StyleBorder.container.borderRadius,
            },
            disabled ? { borderWidth: 0 } : undefined,
          ]}
        />
      )}
      {innerIcon}
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.text,
            StyleType.text,
            StyleSize.text,
            {
              color: ColorType,
            },
            textStyle,
          ]}>
          {children}
        </Text>
      ) : (
        children
      )}
      {iconAfter}
    </View>
  );

  return (
    <TouchableOpacity
      disabled={disabled || !onPress}
      style={[styles.touchableOpacity, wrapperStyle]}
      onPress={loadingMerge ? undefined : onInnerPress}>
      {innerChildren}
    </TouchableOpacity>
  );
}

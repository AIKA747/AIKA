import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

import { ArrowLeftOutline } from '@/components/Icon';
import { useConfigProvider } from '@/hooks/useConfig';
import { Theme } from '@/hooks/useConfig/types';
import { getIntl } from '@/hooks/useLocale';
import pxToDp from '@/utils/pxToDp';

import styles, { positionStylesNormal, positionStylesSticky } from './styles';
import { NavBarProps } from './types';

export default function NavBar({
  position = 'Normal',
  title,
  more,
  onBack,
  style,
  theme,
  isShowShadow = false,
  ...restProps
}: NavBarProps) {
  const intl = getIntl();
  const insets = useSafeAreaInsets();
  const { computedTheme } = useConfigProvider();
  const innerTheme = theme || computedTheme;

  const positionStyles = {
    Normal: positionStylesNormal,
    Sticky: positionStylesSticky,
  }[position];
  const onInnerBack = () => {
    if (onBack) {
      onBack();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }
  };
  const inner = (
    <View
      style={[
        styles.container,
        positionStyles.container,
        { paddingTop: insets.top + pxToDp(8), paddingBottom: pxToDp(8) },
        style,
      ]}
      {...restProps}>
      <TouchableOpacity style={[styles.icon]} onPress={onInnerBack}>
        <ArrowLeftOutline
          color={innerTheme === Theme.LIGHT && title === intl.formatMessage({ id: 'Back' }) ? '#000000' : '#80878E'}
          width={pxToDp(44)}
          height={pxToDp(44)}
        />
      </TouchableOpacity>
      <View style={[styles.title]}>
        {typeof title === 'string' ? (
          <Text
            style={[
              styles.titleText,
              {
                color:
                  innerTheme === Theme.LIGHT && title === intl.formatMessage({ id: 'Back' }) ? '#000000' : '#ffffff',
              },
            ]}
            onPress={title === intl.formatMessage({ id: 'Back' }) ? onInnerBack : undefined}>
            {title}
          </Text>
        ) : (
          title
        )}
      </View>
      <View style={[styles.moreWrap]}>{more}</View>
    </View>
  );
  if (position === 'Sticky' || !isShowShadow) {
    return inner;
  }
  return (
    <Shadow
      startColor="rgba(0, 0, 0, 0.03)"
      distance={isShowShadow ? 10 : 0}
      sides={{
        start: false,
        end: false,
        top: false,
        bottom: true,
      }}
      style={[
        styles.Shadow,
        {
          // backgroundColor: 'red',
        },
      ]}>
      {inner}
    </Shadow>
  );
}

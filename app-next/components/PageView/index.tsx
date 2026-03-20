import React from 'react';
import { ImageBackground, ImageBackgroundProps, View } from 'react-native';

import DotLoading from '@/components/DotLoading';
import NavBar from '@/components/NavBar';
import { ThemedView } from '@/components/ThemedView';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

const imageBg = require('@/assets/images/page.bg.png');

function PageView(
  props: ImageBackgroundProps & {
    showMask?: true;
    loading?: boolean;
  },
) {
  const { children, style, source = imageBg, showMask = false, loading, ...retProps } = props;
  const { computedThemeColor, computedTheme } = useConfigProvider();
  return (
    <ImageBackground
      source={source}
      resizeMethod="scale"
      resizeMode="cover"
      style={[{ backgroundColor: computedThemeColor.bg_primary }, style]}
      {...retProps}>
      <View
        style={[
          {
            width: '100%',
            height: '100%',
            backgroundColor: showMask
              ? computedTheme === Theme.LIGHT
                ? 'rgba(255,255,255,0.6)'
                : 'rgba(0,0,0,0.6)'
              : undefined,
          },
        ]}>
        {loading ? (
          <ThemedView>
            <NavBar theme={computedTheme} style={[{ backgroundColor: '#ffffff00' }]} />
            <ThemedView style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <DotLoading size={pxToDp(10)} color={computedThemeColor.text} />
            </ThemedView>
          </ThemedView>
        ) : (
          children
        )}
      </View>
    </ImageBackground>
  );
}

export default PageView;

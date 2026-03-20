import { Image, ImageLoadEventData } from 'expo-image'; // 使用 expo-image 的 Image 组件
import { Image as ExpoImage } from 'expo-image/build/Image';
import { ImageContentFit } from 'expo-image/build/Image.types';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ImageStyle, View } from 'react-native';

import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp, { deviceWidthDp } from '@/utils/pxToDp';
import s3ImageTransform, { SizeOption } from '@/utils/s3ImageTransform';

const AdaptiveImage = ({
  source,
  style,
  width,
  placeholder,
  quality = 100,
  format = 'auto',
  size = 750,
  contentFit = 'contain',
}: {
  source: ExpoImage['props']['source'];
  style?: ImageStyle;
  width?: number;
  size?: SizeOption;
  quality?: 100 | 50 | 10;
  placeholder?: ExpoImage['props']['placeholder'];
  format?: 'auto' | 'webp' | 'png' | 'jpg' | 'jpeg' | 'gif';
  contentFit?: ImageContentFit;
}) => {
  const [imageSize, setImageSize] = useState({
    width: width || deviceWidthDp - pxToDp(64),
    height: width || deviceWidthDp - pxToDp(64),
  });
  const [isLoading, setIsLoading] = useState(false);
  const { computedThemeColor } = useConfigProvider();

  const memoizedSource = useMemo(
    () => (typeof source === 'string' && source.startsWith('http') ? { uri: s3ImageTransform(source, size) } : source),
    [source, size],
  );

  // 动态计算图片尺寸
  const calcDimensions = useCallback(
    (naturalWidth: number, naturalHeight: number) => {
      const targetWidth = width ? Math.min(width, deviceWidthDp - pxToDp(64)) : deviceWidthDp - pxToDp(64);
      const scale = targetWidth / naturalWidth;
      return {
        width: targetWidth,
        height: naturalHeight * scale,
      };
    },
    [width],
  );

  // 图片加载完成回调
  const handleLoad = useCallback(
    (event: ImageLoadEventData) => {
      const { width, height } = event.source;
      setImageSize(calcDimensions(width, height));
    },
    [calcDimensions],
  );

  return (
    <View style={[{ position: 'relative' }, imageSize]}>
      {/* expo-image 组件 */}
      <Image
        source={memoizedSource}
        placeholder={placeholder}
        cachePolicy="memory"
        style={[
          style,
          {
            backgroundColor: computedThemeColor.bg_secondary, // 加载时的背景色
          },
          imageSize, // 动态应用计算后的宽高
        ]}
        placeholderContentFit="cover"
        contentFit={contentFit} // 保持比例完整显示
        onLoad={handleLoad}
        onLoadStart={() => {
          setIsLoading(true);
        }}
        onLoadEnd={() => {
          setIsLoading(false);
        }}
        onError={(error) => {
          console.error('图片加载失败:', memoizedSource, error);
          setIsLoading(false);
        }}
        transition={null} // 渐变过渡效果
      />
      {/* 加载占位 */}
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: width || deviceWidthDp - pxToDp(64),
            height: width || deviceWidthDp - pxToDp(64),
            justifyContent: 'center',
          }}>
          <ActivityIndicator color={computedThemeColor.primary} size="large" />
        </View>
      )}
    </View>
  );
};

export default React.memo(AdaptiveImage);

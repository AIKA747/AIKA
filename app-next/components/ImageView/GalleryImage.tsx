import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ActivityIndicator, useWindowDimensions, View } from 'react-native';
import { fitContainer } from 'react-native-zoom-toolkit';

import { useConfigProvider } from '@/hooks/useConfig';

type GalleryImageProps = {
  uri: string;
  index: number;
};

const GalleryImage: React.FC<GalleryImageProps> = ({ uri }) => {
  const { width, height } = useWindowDimensions();
  const { computedThemeColor } = useConfigProvider();
  const [loading, setLoading] = useState(false);
  const [resolution, setResolution] = useState<{
    width: number;
    height: number;
  }>({
    width: 1,
    height: 1,
  });

  const size = fitContainer(resolution.width / resolution.height, { width, height });

  return (
    <>
      {loading && (
        <View
          style={[
            {
              position: 'absolute',
              top: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: computedThemeColor.bg_primary,
            },
            size,
          ]}>
          <ActivityIndicator size="small" color={computedThemeColor.primary} />
        </View>
      )}
      <Image
        source={{ uri }}
        style={size}
        onLoadStart={() => {
          setLoading(true);
        }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        contentFit="contain"
        onLoad={(e) => {
          setResolution({
            width: e.source.width,
            height: e.source.height,
          });
        }}
      />
    </>
  );
};

export default GalleryImage;

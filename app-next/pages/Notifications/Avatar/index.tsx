import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

import { placeholderUser } from '@/constants';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import { AvatarProps } from './types';

// TODO 多个头像的布局
const Avatar = (props: AvatarProps) => {
  const { computedTheme } = useConfigProvider();
  const { size = pxToDp(88), images, shape = 'circle' } = props;
  return (
    <View
      style={[
        {
          width: size,
          height: size,
        },
      ]}>
      {images.length === 1 ? (
        <Image
          source={s3ImageTransform(images[0], 'small')}
          style={{
            width: `${100}%`,
            height: `${100}%`,
            borderRadius: shape === 'circle' ? size : pxToDp(size / 5),
            backgroundColor: '#ccc',
            borderWidth: computedTheme === Theme.LIGHT ? pxToDp(4) : 0,
            borderColor: '#9BA1A8',
          }}
          placeholder={placeholderUser}
          contentFit="cover"
          placeholderContentFit="cover"
        />
      ) : undefined}
      {images.length > 1 ? (
        <>
          <Image
            source={s3ImageTransform(images[0], 'small')}
            style={{
              width: `${73}%`,
              height: `${73}%`,
              borderRadius: shape === 'circle' ? size : pxToDp(size / 5),
              backgroundColor: '#ccc',
              borderWidth: computedTheme === Theme.LIGHT ? pxToDp(4) : 0,
              borderColor: '#9BA1A8',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
            placeholder={placeholderUser}
            contentFit="cover"
            placeholderContentFit="cover"
          />
          <Image
            source={s3ImageTransform(images[1], 'small')}
            style={{
              width: `${73}%`,
              height: `${73}%`,
              borderRadius: shape === 'circle' ? size : pxToDp(size / 5),
              backgroundColor: '#ccc',
              borderWidth: computedTheme === Theme.LIGHT ? pxToDp(4) : 0,
              borderColor: '#9BA1A8',
              position: 'absolute',
              right: 0,
              bottom: 0,
            }}
            placeholder={placeholderUser}
            contentFit="cover"
            placeholderContentFit="cover"
          />
        </>
      ) : undefined}
    </View>
  );
};

export default React.memo(Avatar);

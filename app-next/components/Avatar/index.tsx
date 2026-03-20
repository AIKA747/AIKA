import { Image } from 'expo-image';
import { ImageSource } from 'expo-image/build/Image.types';
import React, { useMemo } from 'react';
import { ColorValue, ImageStyle, View, ViewStyle } from 'react-native';

import { placeholderUser } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

type AvatarProps<T extends boolean | undefined = false> = {
  img: string | undefined;
  size?: number;
  bordered?: T;
  borderColor?: T extends true ? ColorValue : never;
  innerBorderColor?: T extends true ? ColorValue : never;
  style?: T extends true ? ViewStyle : ImageStyle;
  shape?: 'square' | 'circle';
  innerBorder?: T;
  placeholder?: ImageSource | string | number | ImageSource[] | string[] | null;
  quality?: 100 | 50 | 10;
  isCurrentUser?: boolean; // 是否是当前登录用户的头像
  format?: 'auto' | 'webp' | 'png' | 'jpg' | 'jpeg' | 'gif';
};

function Avatar<T extends boolean | undefined = false>(props: AvatarProps<T>) {
  const {
    img,
    size = 88,
    bordered = false,
    innerBorder = false,
    borderColor = '#A07BED',
    innerBorderColor = '#A07BED60',
    style,
    shape = 'circle',
    placeholder,
    format = 'auto',
    quality = 100,
    isCurrentUser = false,
  } = props;

  const { userInfo } = useAuth();

  const source = useMemo(
    () => ({
      uri: s3ImageTransform((isCurrentUser ? userInfo?.avatar : img) || '', [size, size]),
    }),
    [img, size, isCurrentUser, userInfo],
  );

  if (!bordered) {
    return (
      <Image
        source={source}
        style={[
          {
            width: pxToDp(size),
            height: pxToDp(size),
            borderRadius: shape === 'circle' ? pxToDp(size / 2) : pxToDp(16),
          },
          !img ? { backgroundColor: '#ccc' } : undefined,
          style as ImageStyle,
        ]}
        placeholder={placeholder || placeholderUser}
        contentFit="cover"
        placeholderContentFit="cover"
        transition={100}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatarBox,
        {
          width: pxToDp(size),
          height: pxToDp(size),
          borderRadius: shape === 'circle' ? pxToDp(size / 2) : pxToDp(16 * 1.5),
          borderColor,
        },
        style as ViewStyle,
      ]}>
      <View
        style={[
          innerBorder
            ? {
                flex: 1,
                width: '100%',
                aspectRatio: 1,
                backgroundColor: innerBorderColor,
                padding: pxToDp(8),
                borderRadius: shape === 'circle' ? pxToDp(size / 2) : pxToDp(16),
              }
            : {},
        ]}>
        <Image
          source={source}
          placeholder={placeholder || placeholderUser}
          style={[
            styles.img,
            { borderRadius: shape === 'circle' ? pxToDp(size / 2) : pxToDp(16) },
            !img ? { backgroundColor: '#ccc' } : undefined,
          ]}
          contentFit="cover"
          placeholderContentFit="cover"
          transition={null}
        />
      </View>
    </View>
  );
}

export default Avatar;

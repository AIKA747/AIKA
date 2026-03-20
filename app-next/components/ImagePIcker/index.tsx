import { useAudioPlayer } from 'expo-audio';
import { AudioSource } from 'expo-audio/src/Audio.types';
import { Image } from 'expo-image';
import { uuid } from 'expo-modules-core';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, TouchableOpacity, View } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import GradientBg from '@/components/GradientBg';
import {
  CameraAddOutline,
  GalleryRemoveOutline,
  GalleryUploadOutline,
  LoadingOutline,
  MinusOutline,
  VideoUploadOutline,
} from '@/components/Icon';
import { placeholderImg } from '@/constants';
import { useConfigProvider } from '@/hooks/useConfig';
import { compressFileToTargetSize } from '@/utils/compressFiletoTargetSize';
import pxToDp from '@/utils/pxToDp';
import uploadAsync from '@/utils/uploadAsync';

import styles, { ItemNewAvatar } from './styles';
import { ImageItem, ImagePIckerProps } from './types';
import getImage from './utils/getImage';

const Video = ({ source, style }: { source: AudioSource; style?: StyleProp<ViewStyle> | undefined }) => {
  const player = useAudioPlayer(source);
  return (
    <View style={style}>
      <Button title="Play Sound" onPress={() => player.play()} />
    </View>
  );
};

const ImagePIcker = ({
  mediaType = 'images',
  multi = false,
  model = 'image',
  maxLength = 1,
  value,
  onChange,
  style,
  borderType = 'gradient',
  compressTargetSize,
  ...restProps
}: ImagePIckerProps) => {
  const { computedThemeColor } = useConfigProvider();
  const valueRef = useRef<NonNullable<typeof value>>([]);
  useEffect(() => {
    // 深拷贝
    valueRef.current = value ? JSON.parse(JSON.stringify(value)) : [];
  }, [value]);

  const onUploadPress = useCallback(
    async ({ key = uuid.v4() }: { key?: string }) => {
      const result = await getImage({
        maxLength,
        value: valueRef.current || [],
        mediaType,
      });
      const fileUrl = result?.assets?.[0]?.uri;
      if (!result || result.canceled || !fileUrl) {
        return;
      }

      // 更新uploading状态
      const v = valueRef.current.find((x) => x.key === key);
      const newV: ImageItem = {
        key,
        url: result.assets[0].uri,
        status: 'uploading',
      };
      if (!v) {
        valueRef.current.push(newV);
      } else {
        Object.assign(v, newV);
      }
      onChange?.([...valueRef.current]);

      // 上传
      try {
        const compressedFileUrl = compressTargetSize
          ? await compressFileToTargetSize(fileUrl, compressTargetSize)
          : fileUrl;
        const url = await uploadAsync({ fileUrl: compressedFileUrl });
        const v = valueRef.current.find((x) => x.key === key);
        // 可能在上传过程中已经删除了
        if (!v) return;
        if (url) {
          v.url = url;
          v.status = 'done';
        } else {
          v.status = 'error';
        }
      } catch (e) {
        console.log(e);
        // 网络错误
        const v = valueRef.current.find((x) => x.key === key);
        // 可能在上传过程中已经删除了
        if (!v) return;
        v.status = 'error';
      }
      onChange?.([...valueRef.current]);
    },
    [compressTargetSize, maxLength, mediaType, onChange],
  );

  const showNewItem = maxLength === undefined || (value?.length || 0) < maxLength;

  const uploadButton = useMemo(() => {
    const btn = (
      <TouchableOpacity
        style={[
          ItemNewAvatar.avatarEmpty,
          {
            backgroundColor: borderType === 'linear' ? computedThemeColor.bg_primary : computedThemeColor.bg_secondary,
          },
        ]}
        onPress={() => {
          onUploadPress({});
        }}>
        <CameraAddOutline
          style={[ItemNewAvatar.avatarEmptyAdd]}
          width={pxToDp(88)}
          height={pxToDp(88)}
          color={borderType === 'linear' ? computedThemeColor.primary : computedThemeColor.text}
        />
      </TouchableOpacity>
    );

    switch (borderType) {
      case 'linear':
        return (
          <View style={[ItemNewAvatar.bg, ItemNewAvatar.linearBtn, { borderColor: computedThemeColor.primary }]}>
            {btn}
          </View>
        );
      case 'gradient':
        return <GradientBg style={[ItemNewAvatar.bg]}>{btn}</GradientBg>;
      default:
        return <View style={[ItemNewAvatar.bg]}>{btn}</View>;
    }
  }, [borderType, computedThemeColor, onUploadPress]);

  const getAvatarPreview = useCallback(
    (item: ImageItem) => {
      const children = (
        <View
          style={[
            ItemNewAvatar.avatar,
            {
              backgroundColor: computedThemeColor.bg_secondary,
            },
          ]}>
          <Image style={[ItemNewAvatar.avatarImage]} source={item.url} contentFit="cover" />
          {item.status === 'uploading' && (
            <View
              style={[
                styles.itemLoading,
                {
                  height: pxToDp(200 - 14),
                  width: pxToDp(200 - 14),
                  backgroundColor: computedThemeColor.text,
                },
              ]}>
              <LoadingOutline width={pxToDp(80)} height={pxToDp(80)} color={computedThemeColor.primary} />
            </View>
          )}
          {item.status === 'error' && (
            <View
              style={[
                styles.itemLoading,
                {
                  height: pxToDp(200 - 14),
                  width: pxToDp(200 - 14),
                  backgroundColor: computedThemeColor.text,
                },
              ]}>
              {/*image_error*/}
              <GalleryRemoveOutline color="#fff" width={pxToDp(40)} height={pxToDp(40)} />
            </View>
          )}
        </View>
      );
      switch (borderType) {
        case 'linear':
          return (
            <View style={[ItemNewAvatar.bg, ItemNewAvatar.linearBtn, { borderColor: computedThemeColor.primary }]}>
              {children}
            </View>
          );
        case 'gradient':
          return <GradientBg style={[ItemNewAvatar.bg]}>{children}</GradientBg>;
        default:
          return <View>{children}</View>;
      }
    },
    [borderType, computedThemeColor],
  );

  return (
    <View style={[styles.container, style]} {...restProps}>
      {showNewItem && model === 'avatar' ? <View style={[ItemNewAvatar.bgWrapper]}>{uploadButton}</View> : undefined}
      {model === 'avatar'
        ? value?.map((item) => {
            return (
              <View key={item.key} style={[ItemNewAvatar.bgWrapper]}>
                {getAvatarPreview(item)}
              </View>
            );
          })
        : undefined}
      {model === 'image'
        ? value?.map((item, index) => {
            return (
              <View key={item.key} style={styles.item}>
                {mediaType === 'videos' ? (
                  <Video
                    style={[
                      styles.itemImage,
                      {
                        borderColor: computedThemeColor.text,
                      },
                    ]}
                    source={{
                      uri: item.url,
                    }}
                  />
                ) : (
                  <Image
                    style={[
                      styles.itemImage,
                      {
                        borderColor: computedThemeColor.text,
                      },
                    ]}
                    source={item.url || ''}
                    contentFit="cover"
                    placeholder={placeholderImg}
                    placeholderContentFit="cover"
                    transition={1000}
                  />
                )}
                {item.status === 'uploading' && (
                  <View
                    style={[
                      styles.itemLoading,
                      {
                        backgroundColor: computedThemeColor.text,
                      },
                    ]}>
                    <LoadingOutline width={pxToDp(80)} height={pxToDp(80)} color={computedThemeColor.primary} />
                  </View>
                )}
                {item.status === 'error' && (
                  <View
                    style={[
                      styles.itemLoading,
                      {
                        backgroundColor: computedThemeColor.text,
                      },
                    ]}>
                    {/*image_error*/}
                    <GalleryRemoveOutline color="#fff" width={pxToDp(40)} height={pxToDp(40)} />
                  </View>
                )}
                <TouchableOpacity
                  style={[
                    styles.itemDelete,
                    {
                      backgroundColor: computedThemeColor.text_gray,
                    },
                  ]}
                  onPress={() => {
                    value.splice(index, 1);
                    onChange?.([...value]);
                  }}>
                  <MinusOutline color="#000" width={pxToDp(20)} height={pxToDp(20)} />
                </TouchableOpacity>
              </View>
            );
          })
        : undefined}
      {showNewItem && model === 'image' ? (
        <TouchableOpacity
          style={[
            styles.itemNew,
            {
              borderColor: computedThemeColor.text,
            },
          ]}
          onPress={() => {
            onUploadPress({});
          }}>
          {/* TODO 统一svg图标 */}
          {mediaType === 'videos' ? (
            <VideoUploadOutline width={pxToDp(60)} height={pxToDp(60)} color={computedThemeColor.text} />
          ) : (
            <GalleryUploadOutline width={pxToDp(60)} height={pxToDp(60)} color={computedThemeColor.text} />
          )}
        </TouchableOpacity>
      ) : undefined}
    </View>
  );
};

export default ImagePIcker;

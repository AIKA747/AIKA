import { Image } from 'expo-image';
import { uuid } from 'expo-modules-core';
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import DropShadow from 'react-native-drop-shadow';

import GradientBg from '@/components/GradientBg';
import { CameraAddOutline, CameraRotateOutline, LoadingOutline } from '@/components/Icon';
import { ImageItem } from '@/components/ImagePIcker/types';
import getImage from '@/components/ImagePIcker/utils/getImage';
import { useConfigProvider } from '@/hooks/useConfig';
import { compressFileToTargetSize } from '@/utils/compressFiletoTargetSize';
import pxToDp from '@/utils/pxToDp';
import uploadAsync from '@/utils/uploadAsync';

import { AvatarUploadStyles } from './styles';

export default function AvatarUpload({ value, onChange }: { value?: ImageItem; onChange: (value: ImageItem) => void }) {
  const { computedThemeColor } = useConfigProvider();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUploadAvatar = useCallback(async () => {
    const result = await getImage({
      maxLength: 1,
      value: [],
      mediaType: 'images',
      quality: 0.5,
    });
    const fileUrl = result?.assets?.[0]?.uri;
    if (!result || result.canceled || !fileUrl) {
      return;
    }

    const avatarImage: ImageItem = {
      key: uuid.v4(),
      url: result.assets[0].uri,
      status: 'uploading',
    };

    onChange(avatarImage);

    setIsLoading(true);
    // 上传
    try {
      const compressedFileUrl = await compressFileToTargetSize(fileUrl, 1);
      const url = await uploadAsync({ fileUrl: compressedFileUrl });
      // 可能在上传过程中已经删除了
      if (url) {
        avatarImage.url = url;
        avatarImage.status = 'done';
      } else {
        avatarImage.status = 'error';
      }
    } catch (e) {
      console.log(e);
      // 网络错误
      avatarImage.status = 'error';
    }
    setIsLoading(false);
    onChange(avatarImage);
  }, [onChange]);

  return (
    <View style={[AvatarUploadStyles.container]}>
      <View style={[AvatarUploadStyles.bgWrapper]}>
        <GradientBg style={[AvatarUploadStyles.bg]}>
          {value?.url ? (
            <View
              style={[
                AvatarUploadStyles.avatar,
                {
                  backgroundColor: computedThemeColor.bg_secondary,
                },
              ]}>
              {isLoading ? (
                <LoadingOutline width={pxToDp(60)} height={pxToDp(60)} color={computedThemeColor.text} />
              ) : (
                <Image style={[AvatarUploadStyles.avatarImage]} source={value?.url} contentFit="cover" />
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={[
                AvatarUploadStyles.avatarEmpty,
                {
                  backgroundColor: computedThemeColor.bg_secondary,
                },
              ]}
              onPress={handleUploadAvatar}>
              <CameraAddOutline
                width={pxToDp(98)}
                height={pxToDp(98)}
                style={[AvatarUploadStyles.avatarEmptyAdd]}
                color={computedThemeColor.text_black}
              />
            </TouchableOpacity>
          )}
        </GradientBg>

        {value?.url ? (
          <View style={[AvatarUploadStyles.avatarReloadWrapper]}>
            <DropShadow
              style={[
                {
                  shadowColor: '#301190',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.8,
                  shadowRadius: 5,
                },
              ]}>
              <TouchableOpacity style={[AvatarUploadStyles.avatarReloadWrapper2]} onPress={handleUploadAvatar}>
                <CameraRotateOutline
                  style={AvatarUploadStyles.avatarReload}
                  width={pxToDp(48)}
                  height={pxToDp(48)}
                  color={computedThemeColor.text_black}
                />
              </TouchableOpacity>
            </DropShadow>
          </View>
        ) : undefined}
      </View>
    </View>
  );
}

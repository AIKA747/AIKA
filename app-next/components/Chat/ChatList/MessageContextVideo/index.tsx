import { Image } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';

import { PlayCircleOutline } from '@/components/Icon';
import { showModal } from '@/components/Modal';
import { MediaViewer as VideoFullscreen } from '@/components/VideoPlayer/VideoFullscreen';
import { placeholderImg } from '@/constants';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { MessageContextVideoProps } from './types';
import { formatMilliseconds } from '@/utils/formatDateTime';

export default function MessageContextVideo({ messageItem }: MessageContextVideoProps) {
  const { media, fileProperty } = messageItem;
  const { computedThemeColor } = useConfigProvider();
  const [thumbnails, setThumbnails] = useState<string>();

  const getFileProperty = useCallback((): ImagePickerAsset => {
    try {
      if (fileProperty) {
        let filePropertyRaw: ImagePickerAsset = JSON.parse(fileProperty!);
        // 当在当前聊天室接收消息时，直接使用的是 websocket 返回的消息， 经过二次序列化，这里判断是否已反序列化为 object
        if (typeof filePropertyRaw === 'string') filePropertyRaw = JSON.parse(filePropertyRaw);
        return filePropertyRaw as ImagePickerAsset;
      }
      return {} as ImagePickerAsset;
    } catch {
      console.warn('Voice - Invalid fileProperty:', fileProperty, '\nmsgId:', messageItem.msgId);
      return {} as ImagePickerAsset;
    }
  }, [fileProperty, messageItem]);

  const getCover = useCallback(async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(media!, {
        time: 2000,
        quality: 0.5,
      });
      setThumbnails(uri);
    } catch (e) {
      console.log('error:', media, e);
      setThumbnails(placeholderImg);
    }
  }, [media]);

  useEffect(() => {
    if (media) {
      getCover();
    }
  }, [getCover, media]);

  const handlePress = () => {
    showModal((onClose) => {
      console.log('getFileProperty():', getFileProperty());
      return <VideoFullscreen uri={media || ''} fileProperty={getFileProperty()} onClose={onClose} />;
    });
  };
  const thumbnailStyle = useCallback((): { width: number; height: number } => {
    const { width, height } = getFileProperty();
    // 16:9
    if (width > height) {
      return {
        width: pxToDp(400),
        height: pxToDp(226),
      };
    }
    return {
      width: pxToDp(226),
      height: pxToDp(400),
    };
  }, [getFileProperty]);

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, { width: thumbnailStyle().width, height: thumbnailStyle().height }]}>
        <Image
          source={thumbnails}
          placeholder={placeholderImg}
          placeholderContentFit="cover"
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        <View style={styles.playIcon}>
          <PlayCircleOutline color="#fff" width={pxToDp(84)} height={pxToDp(84)} />
        </View>
        <View style={{ justifyContent: 'flex-end', position: 'absolute', bottom: 0, right: 0, padding: pxToDp(6) }}>
          <Text style={[styles.text, { color: computedThemeColor.text_secondary }]}>
            {formatMilliseconds(getFileProperty().duration ?? 0)}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

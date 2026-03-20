import dayjs from 'dayjs';
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AdaptiveImage from '@/components/AdaptiveImage';
import ForwardedText from '@/components/Chat/ChatList/ForwardedText';
import { DownloadOutline, LoadingOutline } from '@/components/Icon';
import ImageView from '@/components/ImageView';
import NavBar from '@/components/NavBar';
import Toast from '@/components/Toast';
import { placeholderImg } from '@/constants';
import GroupMsg from '@/database/models/group-msg';
import { queryGroupImages } from '@/database/services';
import { ChatModule } from '@/hooks/useChatClient';
import { useConfigProvider } from '@/hooks/useConfig';
import { formatToRelativeDay } from '@/utils';
import pxToDp from '@/utils/pxToDp';
import { saveImageToGallery } from '@/utils/saveImageToGallery';

import styles, { messagesStylesLeft, messagesStylesRight } from './styles';
import { MessageContextImageProps } from './types';

export type Size = {
  width: number;
  height: number;
};

/**
 * 计算等比例缩放后的图片尺寸
 * @param originalWidth 图片原始宽度
 * @param originalHeight 图片原始高度
 * @param maxWidth 容器最大宽度
 * @param maxHeight 容器最大高度
 * @returns 缩放后的宽高
 */
export function getScaledSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
): Size {
  if (originalWidth <= 0 || originalHeight <= 0) {
    return { width: maxWidth, height: maxHeight };
  }

  const aspectRatio = originalWidth / originalHeight;

  if (aspectRatio >= 1) {
    // 宽图：宽度固定，高度等比缩放
    const width = maxWidth;
    const height = width / aspectRatio;
    return { width, height };
  } else {
    // 长图：高度固定，宽度等比缩放
    const height = maxHeight;
    const width = height * aspectRatio;
    return { width, height };
  }
}

export default function MessageContextImage(props: MessageContextImageProps) {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedTheme, computedThemeColor } = useConfigProvider();

  const { chatModule, messageItem, messagePosition, onLongPress, disabled } = props;
  const [downloading, setDownloading] = useState<boolean>(false);
  const [chatFiles, setChatFiles] = useState<{ created_at: string; media: string; msg_id?: string }[]>([]);
  const [initialImageIndex, setInitialImageIndex] = useState<number | undefined>(undefined);

  const isGroupChat = useMemo(() => chatModule === ChatModule.group, [chatModule]);

  const stylesPosition = {
    left: messagesStylesLeft,
    right: messagesStylesRight,
  }[messagePosition || 'left'];

  useEffect(() => {
    if (!messageItem.conversationId) {
      setInitialImageIndex(undefined);
      setChatFiles([]);
      return;
    }

    if (isGroupChat) {
      queryGroupImages(`${messageItem.conversationId}`).then(setChatFiles);
    } else setChatFiles([{ created_at: messageItem.createdAt, media: messageItem.media || '' }]);
  }, [isGroupChat, messageItem]);

  useEffect(() => {
    if (!chatFiles?.length) return;
    if (!isGroupChat) return setInitialImageIndex(0);

    const index = chatFiles.findIndex((i) => i.media === messageItem.media && i.msg_id === messageItem.msgId);
    setInitialImageIndex(index);
  }, [isGroupChat, chatFiles, messageItem.media, messageItem.msgId]);

  const imageSource = useMemo(() => {
    // 如果是当前发送的图片消息，为避免本地图片和 http 图片替换后等待 http 图片加载才又展示，刚发送的消息均使用本地图片
    // 需要判断是否 instanceof GroupMsg，数据库存储会以某种形式缓存到 local 字段，但 app 重启后就没 local 字段了
    if (!(messageItem instanceof GroupMsg) && messageItem.local) {
      try {
        const uri = JSON.parse(messageItem.fileProperty || '').uri;
        if (uri) return uri;
      } catch {}
    }
    return messageItem.media?.startsWith('http') ? { uri: messageItem.media } : messageItem.media;
  }, [messageItem]);

  const getFileProperty = useCallback((): ImagePickerAsset => {
    try {
      let filePropertyRaw: ImagePickerAsset = JSON.parse(messageItem.fileProperty!);
      // 当在当前聊天室接收消息时，直接使用的是 websocket 返回的消息， 经过二次序列化，这里判断是否已反序列化为 object
      if (typeof filePropertyRaw === 'string') filePropertyRaw = JSON.parse(filePropertyRaw);
      return filePropertyRaw as ImagePickerAsset;
    } catch {
      console.warn('Voice - Invalid fileProperty:', messageItem.fileProperty, '\nmsgId:', messageItem.msgId);
      return {} as ImagePickerAsset;
    }
  }, [messageItem]);

  const thumbnailStyle = useCallback((): {
    width?: number;
    height?: number | 'auto';
  } => {
    const { width: originalWidth, height: originalHeight } = getFileProperty();
    if (!originalWidth || !originalHeight) {
      return {
        width: 200,
        height: 'auto',
      };
    }
    const { width, height } = getScaledSize(originalWidth, originalHeight, 200, 220);
    return {
      width,
      height,
    };
  }, [getFileProperty]);

  return (
    <View style={stylesPosition.wrapper}>
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.6}
        onPress={() => {
          const rootNode = ImageView.show({
            imageIndex: initialImageIndex,
            images: chatFiles?.map((file) => ({ uri: file.media || '' })),
            HeaderComponent: ({ imageIndex }) => (
              <NavBar
                theme={computedTheme}
                style={[{ backgroundColor: '#ffffff00' }]}
                onBack={() => {
                  rootNode.destroy();
                }}
                more={
                  <View style={[styles.imageViewHeaderMore]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={async () => {
                        try {
                          setDownloading(true);
                          await saveImageToGallery(chatFiles[imageIndex]?.media);
                          Toast.success(intl.formatMessage({ id: 'succeed' }));
                        } catch (error) {
                          console.error(error);
                          // @ts-ignore
                          if (error?.message === 'Insufficient permissions') {
                            Alert.alert(
                              intl.formatMessage({ id: 'album.no.permission.title' }),
                              intl.formatMessage({ id: 'album.no.permission.message' }),
                            );
                          } else Toast.error(intl.formatMessage({ id: 'failed' }));
                        } finally {
                          setDownloading(false);
                        }
                      }}>
                      {downloading ? (
                        <LoadingOutline width={pxToDp(48)} height={pxToDp(48)} color="#80878E" />
                      ) : (
                        <DownloadOutline color="#80878E" />
                      )}
                    </TouchableOpacity>
                  </View>
                }
              />
            ),
            FooterComponent: ({ imageIndex, imagesCount }: { imageIndex: number; imagesCount: number }) => (
              <View style={[styles.imageViewFooter, { marginBottom: insets.bottom }]}>
                <Text style={styles.imageViewFooterText}>{`${imageIndex + 1} / ${imagesCount}`}</Text>
                <Text style={[styles.imageViewFooterTime, { color: computedThemeColor.text_secondary }]}>
                  {chatFiles[imageIndex] &&
                    intl.formatMessage(
                      { id: 'AboutChat.MediaTime' },
                      {
                        today: formatToRelativeDay(chatFiles[imageIndex].created_at),
                        time: dayjs(chatFiles[imageIndex].created_at).format('HH:mm'),
                      },
                    )}
                </Text>
              </View>
            ),
          });
        }}
        style={[styles.container, stylesPosition.container, {}]}
        delayLongPress={600} // 设置长按时长
        onLongPress={onLongPress}>
        <ForwardedText message={messageItem} position={messagePosition} />
        <View style={[styles.image, { width: thumbnailStyle().width, height: thumbnailStyle().height }]}>
          <AdaptiveImage
            source={imageSource}
            width={thumbnailStyle().width ?? pxToDp(400)}
            placeholder={placeholderImg}
            size="small"
          />
        </View>
        {(!messageItem.local || messageItem.local.status === 'DONE') && (
          <Text style={[styles.time, { color: computedThemeColor.text_secondary }]}>
            {dayjs(messageItem.createdAt).format('HH:mm')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

import { Q } from '@nozbe/watermelondb';
import { randomId } from '@nozbe/watermelondb/utils/common';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert, FlatList, Image, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteOutline, DownloadOutline, LoadingOutline, NotesDocumentOutline } from '@/components/Icon';
import ImageView from '@/components/ImageView';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { getBotAppChatroomGroupChatFiles } from '@/services/pinyin2';
import { formatToRelativeDay } from '@/utils';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';
import { saveImageToGallery } from '@/utils/saveImageToGallery';
import { database } from '@/database';
import GroupMsgMedia from '@/database/models/group_msgs_media';
import { TableName } from '@/database/schema';

import styles from './styles';

export default function AboutGroupChatMedia() {
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const intl = useIntl();
  const { userInfo } = useAuth();
  const { roomId } = useLocalSearchParams<{
    roomId: string;
  }>();
  const numColumns = 3; // 定义列数
  const spacing = 24; // 间距
  const itemSize = (width - (numColumns + 1) * pxToDp(spacing)) / numColumns;

  const [imageIndex, setImageIndex] = useState<number>(0);
  const [viewImageVisible, setViewImageVisible] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const { data, loading } = useRequest(
    () =>
      getBotAppChatroomGroupChatFiles({
        pageNo: 1,
        pageSize: 999,
        roomId: Number(roomId),
      }),
    { debounceWait: 300, refreshDeps: [roomId] },
  );

  const { data: deleteMedias, refreshAsync: refreshDeleteMedias } = useRequest<GroupMsgMedia[], any[]>(
    async () => {
      return await database
        .get<GroupMsgMedia>(TableName.GROUP_MSGS_MEDIA)
        .query(Q.and(Q.where('room_id', roomId), Q.where('member_id', userInfo?.userId!)))
        .fetch();
    },
    { debounceWait: 300, refreshDeps: [roomId, userInfo] },
  );

  const onRequestClose = useCallback(() => {
    setViewImageVisible(false);
  }, []);

  const deleteMediaIds = useMemo(() => (deleteMedias || []).map((x) => x.mediaId), [deleteMedias]);

  const chatFiles = useMemo(
    () => (data?.data?.data?.list || []).filter((x) => !deleteMediaIds.includes(x.id)),
    [data, deleteMediaIds],
  );

  const images = useMemo(
    () => chatFiles.filter((x) => x.ct === 'IMAGE').map((file) => ({ uri: file.med || '' })),
    [chatFiles],
  );

  return (
    <PageView style={styles.page} loading={loading}>
      <NavBar
        theme={computedTheme}
        title={intl.formatMessage({ id: 'AboutChat.Media' })}
        style={[{ backgroundColor: '#ffffff00' }]}
      />
      <FlatList
        contentContainerStyle={[styles.medias]}
        numColumns={numColumns}
        data={chatFiles.filter((x) => x.ct === 'IMAGE')}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.mediaItem,
              {
                width: itemSize,
                height: itemSize,
                margin: pxToDp(spacing) / 2,
              },
            ]}
            onPress={() => {
              if (item.ct === 'IMAGE') {
                setImageIndex(index);
                setViewImageVisible(true);
              }
            }}>
            {item.ct === 'IMAGE' ? (
              <Image
                style={{ width: itemSize, height: itemSize }}
                source={{ uri: s3ImageTransform(item.med || '', 'small') }}
              />
            ) : (
              <NotesDocumentOutline width={pxToDp(88)} height={pxToDp(88)} color="#e9e9e9" />
            )}
          </TouchableOpacity>
        )}
      />
      <ImageView
        imageIndex={imageIndex}
        open={viewImageVisible}
        windowSize={1}
        onImageIndexChange={setImageIndex}
        onRequestClose={() => setViewImageVisible(false)}
        images={images}
        HeaderComponent={() => (
          <NavBar
            theme={computedTheme}
            style={[{ backgroundColor: '#ffffff00' }]}
            onBack={onRequestClose}
            more={
              <View style={[styles.imageViewHeaderMore]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={async () => {
                    try {
                      setDownloading(true);
                      const mediaUrl = chatFiles.filter((x) => x.ct === 'IMAGE')[imageIndex].med || '';
                      await saveImageToGallery(mediaUrl);
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
                <TouchableOpacity
                  onPress={async () => {
                    await database.write(async () => {
                      const res = await database.get<GroupMsgMedia>(TableName.GROUP_MSGS_MEDIA).create((record) => {
                        record.objectId = randomId(); // 自动生成一个 UUID
                        record.roomId = roomId;
                        record.memberId = userInfo?.userId!;
                        record.mediaId = chatFiles[imageIndex].id;
                        record.mediaType = chatFiles[imageIndex].ct;
                        record.mediaUrl = chatFiles[imageIndex].med!;
                        record.createdAt = new Date();
                      });
                      if (res) {
                        await refreshDeleteMedias();
                        setViewImageVisible(false);
                      }
                    });
                  }}>
                  <DeleteOutline color="#80878E" />
                </TouchableOpacity>
              </View>
            }
          />
        )}
        FooterComponent={({ imageIndex, imagesCount }: { imageIndex: number; imagesCount: number }) => (
          <View style={[styles.imageViewFooter, { marginBottom: insets.bottom }]}>
            <Text style={styles.imageViewFooterText}>{`${imageIndex + 1} / ${imagesCount}`}</Text>
            <Text style={[styles.imageViewFooterTime, { color: computedThemeColor.text_secondary }]}>
              {intl.formatMessage(
                { id: 'AboutChat.MediaTime' },
                {
                  today: formatToRelativeDay(chatFiles[imageIndex].time),
                  time: dayjs(chatFiles[imageIndex].time).format('HH:mm'),
                },
              )}
            </Text>
          </View>
        )}
      />
    </PageView>
  );
}

import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import MessageContextVoice from '@/components/Chat/ChatList/MessageContextVoice';
import { DownloadOutline, LoadingOutline, RadioCheckTwoTone } from '@/components/Icon';
import ImageView from '@/components/ImageView';
import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { ContentType } from '@/hooks/useChatClient';
import { useConfigProvider } from '@/hooks/useConfig';
import { getBotAppChatroomFeatureMessages } from '@/services/pinyin2';
import { deleteBotAppChatroomGroupChatRecordFeatured } from '@/services/qunchengyuanqunliaoshezhi';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';
import { saveImageToGallery } from '@/utils/saveImageToGallery';

import styles from './styles';

export default function AboutGroupChatFeaturedMessages() {
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const insets = useSafeAreaInsets();
  const intl = useIntl();
  const { roomId } = useLocalSearchParams<{
    roomId: string; // 群ID
  }>();
  const listRef = useRef<ListRef<API.GroupChatMessageRecord>>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { loading, runAsync: removeBotAppChatroomGroupChatRecordFeatured } = useRequest(
    deleteBotAppChatroomGroupChatRecordFeatured,
    {
      manual: true,
      debounceWait: 300,
    },
  );
  const [edit, setEdit] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{
    uri: string;
    filename: string;
  }>();

  const handleDelete = useCallback(() => {
    removeBotAppChatroomGroupChatRecordFeatured(selectedIds).then((res) => {
      if (res.data.code === 0) {
        for (const selectedId of selectedIds) {
          //减少请求，只做本地删除
          listRef.current?.handleDelete('id', selectedId);
        }
      }
    });
  }, [removeBotAppChatroomGroupChatRecordFeatured, selectedIds]);

  const renderItemContent = useCallback((item: API.GroupChatMessageRecord) => {
    switch (item.ct) {
      case 'IMAGE':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setPreviewImage({
                uri: item.med || '',
                filename: item.fn,
              });
            }}
            style={{ borderRadius: pxToDp(20), overflow: 'hidden' }}>
            <Image
              style={{ width: '100%', height: pxToDp(400) }}
              source={s3ImageTransform(item.med || '', 'small')}
              contentFit="cover"
              transition={1000}
            />
          </TouchableOpacity>
        );
      case 'VOICE':
        return (
          <MessageContextVoice
            messageItem={
              {
                ...item,
                media: item.med,
                contentType: ContentType.VOICE,
                fileProperty: JSON.stringify({ length: item.flength, filename: item.fn }),
              } as any
            }
            repeat={16}
            messagePosition="right"
          />
        );
      default:
        return <Text style={styles.text}>{item.txt}</Text>;
    }
  }, []);

  return (
    <PageView style={styles.page}>
      <NavBar
        theme={computedTheme}
        title={intl.formatMessage({ id: 'AboutChat.FeaturedMessages' })}
        style={[{ backgroundColor: '#ffffff00' }]}
        more={
          showEdit && (
            <TouchableOpacity
              style={{ paddingVertical: pxToDp(6), paddingHorizontal: pxToDp(12) }}
              onPress={() => {
                setEdit((v) => !v);
                setSelectedIds([]);
              }}>
              <Text
                style={{
                  fontSize: pxToDp(32),
                  color: edit ? computedThemeColor.text : computedThemeColor.text_secondary,
                }}>
                {intl.formatMessage({ id: edit ? 'updateEmail.done' : 'Edit' })}
              </Text>
            </TouchableOpacity>
          )
        }
      />
      <List
        ref={listRef}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        request={async (params) => {
          const res = await getBotAppChatroomFeatureMessages({
            pageNo: params.pageNo,
            pageSize: params.pageSize,
            roomId: Number(roomId),
          });
          setShowEdit(res?.data?.data?.total > 0);
          return {
            data: res?.data?.data?.list || [],
            total: res?.data?.data?.total,
          };
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={edit ? 0.8 : 1}
            onPress={() => {
              if (edit) {
                setSelectedIds((v) => {
                  if (v.includes(item.id)) {
                    return v.filter((id) => id !== item.id);
                  } else {
                    return [...v, item.id];
                  }
                });
              }
            }}
            style={[styles.card]}>
            {edit && (
              <View>
                <RadioCheckTwoTone
                  color={
                    selectedIds.includes(item.id) ? computedThemeColor.text_pink : computedThemeColor.text_secondary
                  }
                  twoToneColor="#fff"
                  width={pxToDp(24 * 2)}
                  height={pxToDp(24 * 2)}
                  checked={selectedIds.includes(item.id)}
                />
              </View>
            )}
            <View style={[styles.cardContent]}>
              <Avatar style={styles.avatar} img={s3ImageTransform(item.avatar, 'small')} />
              <Text style={styles.text}>{item.nn || '--'}</Text>
              {renderItemContent(item)}
            </View>
          </TouchableOpacity>
        )}
      />
      {edit && (
        <View style={{ paddingHorizontal: pxToDp(24), paddingBottom: insets.bottom + pxToDp(48) }}>
          <Button
            type="ghost"
            borderType="square"
            loading={loading}
            style={{ borderColor: computedThemeColor.primary }}
            onPress={handleDelete}>
            <Text style={{ fontSize: pxToDp(32), color: computedThemeColor.primary }}>
              {intl.formatMessage({ id: 'AboutChat.FeaturedMessages.DeleteBtnText' })}
            </Text>
          </Button>
        </View>
      )}
      <ImageView
        imageIndex={1}
        open={!!previewImage}
        windowSize={1}
        onRequestClose={() => setPreviewImage(undefined)}
        images={[{ uri: previewImage?.uri || '' }]}
        HeaderComponent={() => (
          <NavBar
            theme={computedTheme}
            style={[{ backgroundColor: '#ffffff00' }]}
            onBack={() => setPreviewImage(undefined)}
            more={
              <View style={[styles.imageViewHeaderMore]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={async () => {
                    try {
                      setDownloading(true);
                      await saveImageToGallery(previewImage?.uri || '');
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
        )}
        FooterComponent={({ imageIndex, imagesCount }: { imageIndex: number; imagesCount: number }) => (
          <View style={[styles.imageViewFooter, { marginBottom: insets.bottom }]}>
            <Text style={styles.imageViewFooterText}>{`${imageIndex + 1} / ${imagesCount}`}</Text>
          </View>
        )}
      />
    </PageView>
  );
}

import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { uuid } from 'expo-modules-core';
import { router, useLocalSearchParams } from 'expo-router';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/Avatar';
import {
  AddCircleOutline,
  CloseCircleFilled,
  CloseOutline,
  GalleryOutline,
  GalleryRemoveOutline,
  LoadingOutline,
} from '@/components/Icon';
import { ImageItem } from '@/components/ImagePIcker/types';
import getImage from '@/components/ImagePIcker/utils/getImage';
import Toast from '@/components/Toast';
import { VideoPlayer } from '@/components/VideoPlayer';
import { placeholderImg } from '@/constants';
import { AFEventKey } from '@/constants/AFEventKey';
import keyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { postContentAppPosts } from '@/services/tiezi';
import { getUserPublicVideoConvertResult } from '@/services/tongyongjiekou';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import extractTags from '@/utils/extractTags';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';
import uploadAsync from '@/utils/uploadAsync';

import styles from './styles';

export default function AgoraPostPublish() {
  const intl = useIntl();
  const { userInfo } = useAuth();
  const insets = useSafeAreaInsets();
  const { computedThemeColor } = useConfigProvider();
  const scrollViewRef = useRef<ScrollView>(null);
  const { type = 'image' } = useLocalSearchParams<{ type: 'video' | 'image' }>();

  const [activePost, setActivePost] = useState<number | null>(0);
  const [pagePaddingBottom, setPagePaddingBottom] = useState(insets.bottom);
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardWillShow', () => setPagePaddingBottom(0));
    const keyboardHideListener = Keyboard.addListener('keyboardWillHide', () => setPagePaddingBottom(insets.bottom));
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [insets.bottom]);

  const [thread, setThread] = useState<{ title: string; content: string; images: ImageItem[] }[]>([
    { title: '', content: '', images: [] },
  ]);

  const { runAsync: handlePublish, loading } = useRequest(
    async () => {
      const summary = thread.find((i) => !!i.content.trim())?.content ?? '';
      const cover = thread.find((i) => !!i?.images?.length)?.images?.[0]?.url ?? '';
      let videoCover: string = '';
      if (type === 'video') {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(cover, {
            quality: 0.5,
          });
          videoCover = await uploadAsync({ fileUrl: uri });
        } catch (e) {
          console.warn(e);
        }
      }
      if (!summary && !cover) return Toast.info(intl.formatMessage({ id: 'agora.publish.notContent' }));

      const newThread: { title: string; content: string; images?: string[]; video?: string; fileProperty?: string }[] =
        [];
      const tags: string[] = [];
      for (const t of thread) {
        if (!t.content?.trim() && !t.images?.length) return;
        tags.push(...extractTags(t.content?.trim() ?? ''));
        let video = t.images?.map((i) => i.url)?.[0];
        try {
          const res = await getUserPublicVideoConvertResult({ videoUrl: video });
          if (res.data.data.status === 'COMPLETE') {
            console.log('videoUrl:', res.data.data.videoUrl);
            video = res.data.data.videoUrl;
          }
        } catch (e) {
          console.log('视频压缩失败，继续使用原视频链接', e);
        }
        const images = t.images?.map((i) => i.url);
        const filePropertys = t.images?.map((i) => i.fileProperty);
        newThread.push({
          ...t,
          content: t.content?.trim() ?? '',
          fileProperty: JSON.stringify(filePropertys),
          ...(type === 'image' ? { images, video: '' } : { video, images: [] }),
        });
      }

      const topicTags = tags.filter(Boolean).join(',');
      try {
        const res = await postContentAppPosts({
          summary,
          thread: newThread,
          ...(type === 'image' ? { cover } : { video: newThread[0].video, cover: videoCover }),
          topicTags,
        });
        if (res.data?.code !== 0) return res.data?.msg && Alert.alert('', res.data.msg);
        sendAppsFlyerEvent(AFEventKey.AFAgoraPostCreated);
        router.replace({ pathname: '/', params: { postPublished: '1' } });
      } catch {
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    { manual: true, debounceWait: 300 },
  );

  const threadBtnDisabled = !thread[thread.length - 1].content.trim() && !thread[thread.length - 1]?.images?.length;

  // 若有媒体文件（图片），等待上传完成才能发布
  const mediasUploaded = useMemo(() => {
    for (const item of thread) if (item.images?.some((i) => i.status !== 'done')) return false;
    return true;
  }, [thread]);

  return (
    <KeyboardAvoidingView behavior={keyboardAvoidingViewBehavior} style={{ flex: 1 }}>
      <View style={[styles.page, { backgroundColor: computedThemeColor.bg_primary }, { paddingTop: insets.top }]}>
        <View style={styles.topBox}>
          <TouchableOpacity style={styles.cancel} onPress={router.back}>
            <Text
              style={{
                fontSize: pxToDp(16 * 2),
                lineHeight: pxToDp(40 * 2),
                color: computedThemeColor.text_secondary,
              }}>
              {intl.formatMessage({ id: 'Cancel' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={loading || threadBtnDisabled || !mediasUploaded}
            style={[styles.publish, { backgroundColor: 'rgba(160,123,237,0.1)' }]}
            onPress={handlePublish}>
            {loading && <LoadingOutline width={pxToDp(32)} height={pxToDp(32)} color={computedThemeColor.primary} />}
            <Text
              style={{
                fontSize: pxToDp(16 * 2),
                lineHeight: pxToDp(40 * 2),
                color: threadBtnDisabled || !mediasUploaded ? '#80878E' : computedThemeColor.primary,
              }}>
              {intl.formatMessage({ id: 'agora.btn.Publish' })}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: pxToDp(16 * 2),
            paddingTop: pxToDp(16 * 2),
          }}>
          {thread.map(({ content, images }, index) => {
            const opacity = activePost === null || activePost === index ? 1 : 0.5;
            let tipColor: string;
            if (content.length >= 900) {
              tipColor = computedThemeColor.text_error;
            } else if (content.length < 900 && content.length >= 600) {
              tipColor = computedThemeColor.text_warning;
            } else if (content.length < 600 && content.length > 0) {
              tipColor = computedThemeColor.primary;
            } else {
              tipColor = computedThemeColor.text_secondary;
            }
            return (
              <View key={index}>
                <View style={[styles.threadBox, images?.length ? { marginBottom: 0 } : undefined]}>
                  <View style={[styles.avatarBox, { backgroundColor: computedThemeColor.bg_primary }]}>
                    <Avatar style={{ opacity }} img={userInfo?.avatar} bordered />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                      {/* 帖文文本框 */}
                      <View style={{ flex: 1 }}>
                        <TextInput
                          multiline
                          autoFocus
                          placeholder={
                            index === 0
                              ? intl.formatMessage({ id: 'agora.publish.newPlaceholder' })
                              : intl.formatMessage({ id: 'agora.publish.addThreadPlaceholder' })
                          }
                          placeholderTextColor={computedThemeColor.text_secondary}
                          cursorColor={computedThemeColor.primary}
                          selectionColor={computedThemeColor.primary}
                          textAlignVertical={'center'}
                          style={[styles.input, { opacity, color: computedThemeColor.text }]}
                          value={content}
                          maxLength={1000}
                          onChangeText={(text) => {
                            setThread((thread) => {
                              const newThread = [...thread];
                              newThread[index] = {
                                ...newThread[index],
                                content: text.replace(/https?:\/\/([^\s]+)/g, '$1'),
                              };
                              return newThread;
                            });
                          }}
                          onFocus={() => setActivePost(index)}
                          // onBlur={() => setActivePost(null)}
                        />
                        <View
                          style={{
                            width: '100%',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                          }}>
                          <Text style={{ fontSize: pxToDp(24), color: tipColor, textAlign: 'right' }}>
                            {content.length} / 1000
                          </Text>
                        </View>
                      </View>

                      {thread.length > 1 && activePost === index && (
                        <TouchableOpacity
                          style={styles.delete}
                          onPress={() => {
                            setThread((thread) => {
                              const newThread = [...thread];
                              newThread.splice(index, 1);
                              return newThread;
                            });
                            setActivePost(Math.max(index - 1, 0));
                          }}>
                          <CloseOutline width={pxToDp(16 * 2)} height={pxToDp(16 * 2)} color="#80878E" />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* 帖文图片 */}
                    {!!images.length && (
                      <ScrollView
                        horizontal
                        style={[styles.imgBoxContainer, { opacity }]}
                        showsHorizontalScrollIndicator={false}>
                        {images.map((item, imgIndex) => {
                          const aspectRatio = item.fileProperty.width / item.fileProperty.height;
                          return (
                            <View
                              key={item.key}
                              style={[
                                styles.imgBox,
                                type === 'video'
                                  ? {
                                      width: pxToDp(294 * 2),
                                      height: '100%',
                                      aspectRatio: aspectRatio,
                                    }
                                  : {},
                              ]}>
                              {type === 'image' ? (
                                <Image
                                  source={s3ImageTransform(item.url, 'small')}
                                  placeholder={placeholderImg}
                                  placeholderContentFit="cover"
                                  contentFit="cover"
                                  style={styles.img}
                                />
                              ) : (
                                <VideoPlayer
                                  playerId={index}
                                  fileProperty={item.fileProperty}
                                  source={item?.url}
                                  controls
                                />
                              )}

                              {item.status === 'uploading' && (
                                <View style={styles.imgMask}>
                                  <LoadingOutline
                                    width={pxToDp(100)}
                                    height={pxToDp(100)}
                                    color={computedThemeColor.primary}
                                  />
                                </View>
                              )}
                              {item.status === 'error' && (
                                <View style={styles.imgMask}>
                                  <GalleryRemoveOutline width={80} height={80} color="rgba(160,123,237,0.8)" />
                                </View>
                              )}
                              {item.status !== 'uploading' && (
                                <TouchableOpacity
                                  onPress={() => {
                                    setThread((thread) => {
                                      const newThread = [...thread];
                                      const curPost = { ...newThread[index] };
                                      curPost.images.splice(imgIndex, 1);
                                      newThread[index] = curPost;
                                      return newThread;
                                    });
                                  }}
                                  style={styles.imgDelete}>
                                  <CloseCircleFilled
                                    color={computedThemeColor.text_secondary}
                                    width={pxToDp(62)}
                                    height={pxToDp(62)}
                                    style={styles.imgDeleteIcon}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        })}
                      </ScrollView>
                    )}
                  </View>
                </View>
                {index !== thread.length - 1 && (
                  <View style={[styles.line, { backgroundColor: 'rgba(160, 123, 237, 0.5)', opacity }]} />
                )}
              </View>
            );
          })}
        </ScrollView>

        <View style={[styles.bottomBox]}>
          {/* ‘Add Photos’ button */}
          <TouchableOpacity
            disabled={activePost === null}
            style={[styles.bottomBtn, { backgroundColor: '#1B1B22', opacity: activePost === null ? 0.8 : 1 }]}
            onPress={async () => {
              if (activePost === null) return;

              const result = await getImage({
                maxLength: type === 'image' ? 9 : 1,
                value: thread[activePost].images,
                mediaType: type === 'image' ? 'images' : 'videos',
              });
              if (!result?.assets?.length) return;

              const addedImgs = result.assets?.map(
                (i) =>
                  ({
                    key: uuid.v4(),
                    url: i.uri,
                    status: 'uploading',
                    fileProperty: i,
                  }) satisfies ImageItem,
              );
              setThread((thread) => {
                const newThread = [...thread];
                newThread[activePost!] = {
                  ...newThread[activePost!],
                  images: type === 'image' ? [...newThread[activePost!].images, ...addedImgs] : [...addedImgs],
                };
                return newThread;
              });

              addedImgs.forEach((img) => {
                uploadAsync({ fileUrl: img.url })
                  .then((res) => {
                    setThread((thread) => {
                      const newThread = [...thread];
                      const newImages = [...thread[activePost!].images];
                      const foundIndex = newImages.findIndex((i) => i.key === img.key);
                      newImages.splice(foundIndex, 1, { ...img, url: res, status: 'done' });
                      newThread[activePost!] = { ...newThread[activePost!], images: newImages };
                      return newThread;
                    });
                    sendAppsFlyerEvent(AFEventKey.AFAgoraPhotoUploaded);
                  })
                  .catch(() => {
                    setThread((thread) => {
                      const newThread = [...thread];
                      const newImages = [...thread[activePost!].images];
                      const foundIndex = newImages.findIndex((i) => i.key === img.key);
                      newImages.splice(foundIndex, 1, { ...img, status: 'error' });
                      newThread[activePost!] = { ...newThread[activePost!], images: newImages };
                      return newThread;
                    });
                  });
              });
            }}>
            <GalleryOutline
              width={pxToDp(40)}
              height={pxToDp(40)}
              color={computedThemeColor.text_secondary}
              style={styles.bottomBtnIcon}
            />
            <Text style={{ fontSize: pxToDp(16 * 2), color: '#80878E' }}>
              {intl.formatMessage({ id: type === 'image' ? 'agora.btn.photo' : 'agora.btn.video' })}
            </Text>
          </TouchableOpacity>
          {intl.locale !== 'ru' && <View style={{ width: pxToDp(6 * 2) }} />}
          {/* ‘Start a thread’ button */}
          <TouchableOpacity
            disabled={threadBtnDisabled}
            style={[styles.bottomBtn, { backgroundColor: '#1B1B22', opacity: threadBtnDisabled ? 0.8 : 1 }]}
            onPress={() => {
              setThread((thread) => [...thread, { title: '', content: '', images: [] }]);
              setTimeout(() => {
                scrollViewRef.current &&
                  scrollViewRef.current.scrollToEnd({
                    animated: true, // 平滑滚动
                  });
              }, 10);
            }}>
            <AddCircleOutline
              width={pxToDp(40)}
              height={pxToDp(40)}
              color={computedThemeColor.text_secondary}
              style={styles.bottomBtnIcon}
            />
            <Text style={{ fontSize: pxToDp(16 * 2), color: '#80878E' }}>
              {intl.formatMessage({ id: 'agora.btn.thread' })}
            </Text>
          </TouchableOpacity>
        </View>
        {/*背景颜色用于真机测试，测试通过后进行删除*/}
        <View style={[{ width: '100%', height: pagePaddingBottom }]} />
      </View>
    </KeyboardAvoidingView>
  );
}

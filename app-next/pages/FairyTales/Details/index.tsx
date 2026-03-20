import { useRequest } from 'ahooks';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlayOutline } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { placeholderImg } from '@/constants';
import { AFEventKey } from '@/constants/AFEventKey';
import { useAuth } from '@/hooks/useAuth';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { useStoryProvider } from '@/hooks/useStory';
import { postContentAppStoryRecorder } from '@/services/contentService';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

export default function FairyTaleDetails() {
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const { storyDetail, refreshStoryDetailAsync } = useStoryProvider();
  const { userInfo } = useAuth();
  const insets = useSafeAreaInsets();
  const [contentImageSize, setContextImageSize] = useState({ width: 0, height: 0 });

  const isExpired = userInfo?.expiredDate && new Date(userInfo?.expiredDate) < new Date();

  const imageUrl = useMemo(
    () =>
      ({
        [Theme.LIGHT]: storyDetail?.cover,
        [Theme.DARK]: storyDetail?.coverDark,
      })[computedTheme],
    [storyDetail, computedTheme],
  );
  useEffect(() => {
    Image.getSize(
      imageUrl || '',
      (width, height) => {
        const screenWidth = Dimensions.get('window').width;
        const ratio = height / width;
        setContextImageSize({ width: screenWidth, height: screenWidth * ratio }); // 获取图片宽高
      },
      (error) => {
        console.error('Failed to load image size:', error);
      },
    );
  }, [imageUrl]);

  const { refreshAsync: handleContinue, loading: loadingHandleContinue } = useRequest(
    async () => {
      if (storyDetail?.status === null || storyDetail?.status === 'NOT_STARTED') {
        sendAppsFlyerEvent(AFEventKey.AFFairyTaleStarted);
        const resp = await postContentAppStoryRecorder({ storyId: storyDetail?.id });
        // 其它错误
        if (resp.data.code !== 0) {
          Toast.error(resp.data.msg);
          return;
        }
        refreshStoryDetailAsync?.(storyDetail?.id);
      }
      router.push({
        pathname: '/main/story/chat/[storyId]',
        params: { storyId: storyDetail?.id || '' },
      });
    },
    {
      manual: true,
      refreshDeps: [isExpired, storyDetail],
    },
  );

  return (
    <PageView
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}
      source={
        storyDetail?.backgroundPicture || storyDetail?.backgroundPictureDark
          ? {
              uri: s3ImageTransform(
                {
                  [Theme.LIGHT]: storyDetail?.backgroundPicture,
                  [Theme.DARK]: storyDetail?.backgroundPictureDark,
                }[computedTheme] || '',
                [750, 1334],
              ),
            }
          : placeholderImg
      }
      blurRadius={20}>
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <NavBar theme={computedTheme} title="" style={[{ backgroundColor: '#ffffff00', zIndex: 1 }]} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: insets.bottom + pxToDp(200),
          }}>
          <Text style={[styles.infoIntroduction, { zIndex: 1 }]}>{storyDetail?.introduction}</Text>
          <Image
            resizeMode="cover"
            style={[
              styles.coverWrap,
              {
                height: contentImageSize.height,
              },
            ]}
            resizeMethod="scale"
            source={
              imageUrl
                ? {
                    uri: s3ImageTransform(imageUrl || '', [750, 1334]),
                  }
                : placeholderImg
            }
          />
        </ScrollView>
        <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <ImageBackground
            blurRadius={20}
            resizeMode="repeat"
            source={require('@/assets/images/transparent.png')}
            style={[styles.continueBtnWrap, { paddingBottom: pxToDp(32) + insets.bottom }]}>
            <TouchableOpacity disabled={loadingHandleContinue} style={styles.continueBtn} onPress={handleContinue}>
              <PlayOutline width={pxToDp(44)} height={pxToDp(44)} color={computedThemeColor.primary} />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </View>
    </PageView>
  );
}

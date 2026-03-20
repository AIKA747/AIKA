import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import Button from '@/components/Button';
import GradientBg from '@/components/GradientBg';
import ImageView from '@/components/ImageView';
import NavBar from '@/components/NavBar';
import { placeholderImg } from '@/constants';
import { useConfigProvider } from '@/hooks/useConfig';
import { deleteUserAppFeedbackId, getUserAppFeedbackId } from '@/services/yonghufankuijiekou';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles, { ItemNewAvatar } from './styles';

export default function ReportDetail() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  const { reportId } = useLocalSearchParams<{ reportId: string }>();
  const { data } = useRequest(async () => {
    const resp = await getUserAppFeedbackId({ id: reportId });
    return resp.data.data;
  }, {});

  const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <NavBar title={`${intl.formatMessage({ id: 'Back' })}`} />
      <ScrollView style={[styles.ScrollView]}>
        <View style={[styles.container]}>
          <View style={[styles.header]}>
            <Text style={[styles.headerStatus]}>
              {
                {
                  underReview: intl.formatMessage({ id: 'MyFeedbackDetail.status.underReview' }),
                  pending: intl.formatMessage({ id: 'MyFeedbackDetail.status.pending' }),
                  rejected: intl.formatMessage({ id: 'MyFeedbackDetail.status.rejected' }),
                  completed: intl.formatMessage({ id: 'MyFeedbackDetail.status.completed' }),
                  withdraw: intl.formatMessage({ id: 'MyFeedbackDetail.status.withdraw' }),
                }[data?.status!]
              }
            </Text>
            <Text
              style={[
                styles.headerDate,
                {
                  color: computedThemeColor.text,
                },
              ]}>
              {dayjs(data?.submissionAt).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </View>
          <Text
            style={[
              styles.title,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {intl.formatMessage({ id: 'MyFeedbackDetail.title.title' })}
          </Text>
          <Text
            style={[
              styles.content,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {data?.title}
          </Text>
          <Text
            style={[
              styles.title,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {intl.formatMessage({ id: 'MyFeedbackDetail.title.content' })}
          </Text>
          <Text
            style={[
              styles.content,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {data?.description}
          </Text>
          <View style={[styles.images]}>
            {data?.images?.map((item) => {
              return (
                <TouchableOpacity key={item} style={[ItemNewAvatar.bgWrapper]} onPress={() => setViewImageUrl(item)}>
                  <GradientBg style={[ItemNewAvatar.bg]}>
                    <View
                      style={[
                        ItemNewAvatar.avatar,
                        {
                          backgroundColor: computedThemeColor.bg_secondary,
                        },
                      ]}>
                      <Image
                        style={[ItemNewAvatar.avatarImage]}
                        source={s3ImageTransform(item, 'small')}
                        placeholder={placeholderImg}
                        placeholderContentFit="cover"
                        contentFit="cover"
                      />
                    </View>
                  </GradientBg>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text
            style={[
              styles.title,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {intl.formatMessage({ id: 'MyFeedbackDetail.title.DeviceInformation' })}
          </Text>
          <Text
            style={[
              styles.content,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {data?.device} / {data?.systemVersion}
          </Text>

          {data?.replyContent ? (
            <>
              <Text
                style={[
                  styles.title,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                {intl.formatMessage({ id: 'MyFeedbackDetail.title.ReplyContent' })}
              </Text>
              <Text
                style={[
                  styles.content,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                {data?.replyContent}
              </Text>
            </>
          ) : undefined}
        </View>
      </ScrollView>
      <View style={[styles.buttons]}>
        {['underReview', 'pending'].includes(data?.status!) ? (
          <Button
            type="ghost"
            onPress={async () => {
              const resp = await deleteUserAppFeedbackId({ id: reportId });
              if (resp.data.code !== 0) {
              } else {
                router.back();
              }
            }}>
            <Text
              style={{
                color: '#ED1313',
                fontSize: pxToDp(32),
                lineHeight: pxToDp(44),
              }}>
              {intl.formatMessage({ id: 'MyFeedbackDetail.WithdrawRequest' })}
            </Text>
          </Button>
        ) : undefined}
      </View>
      <ImageView
        images={viewImageUrl ? [{ uri: viewImageUrl }] : []}
        imageIndex={0}
        open={!!viewImageUrl}
        onRequestClose={() => setViewImageUrl(null)}
      />
    </View>
  );
}

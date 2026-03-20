import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { groupBy, uniqBy } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';

import DotLoading from '@/components/DotLoading';
import { ArrowLeftOutline, ChatOutline } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { placeholderImg } from '@/constants';
import { useConfigProvider } from '@/hooks/useConfig';
import { getBotAppChatroomMemberNotification } from '@/services/qunchengyuanqunliaoshezhi';
import { getUserAppNotification, putUserAppNotificationRead } from '@/services/zhanneitongzhixiaoxi';
import { customFromNow } from '@/utils';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import Avatar from './Avatar';
import styles, { RequestStyles } from './styles';

export default function Notifications() {
  const { computedThemeColor, setRefreshConfig } = useConfigProvider();
  const intl = useIntl();
  const listRef = useRef<FlashListRef<
    string | Awaited<ReturnType<typeof getUserAppNotification>>['data']['data']['list'][number]
  > | null>(null);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(1);
  const [notificationData, setNotificationData] = useState<{
    list: Awaited<ReturnType<typeof getUserAppNotification>>['data']['data']['list'];
    total: number;
  }>({ list: [], total: 0 });

  const { data: groupChatList } = useRequest(
    async () => {
      const resp = await getBotAppChatroomMemberNotification({
        pageNo: 1,
        pageSize: 2,
      });
      return {
        list: resp.data?.data?.list || [],
        total: resp.data?.data?.total || 0,
      };
    },
    { debounceWait: 300 },
  );
  const { runAsync: getAppNotification, loading: refreshing } = useRequest(
    async (params: { pageNo: number; pageSize: number }) => {
      const res = await getUserAppNotification({
        pageNo: params.pageNo,
        pageSize: params.pageSize,
      });
      return {
        list: res?.data?.data?.list || [],
        total: +res?.data?.data?.total || 0,
      };
    },
    { manual: true, debounceWait: 300 },
  );

  const sectionList: (string | Awaited<ReturnType<typeof getUserAppNotification>>['data']['data']['list'][number])[] =
    useMemo(() => {
      const gList = groupBy(notificationData.list, (n) => dayjs(n.createdAt).format('YYYY-MM-DD'));
      // @ts-ignore
      const keys = Object.keys(gList).sort((a, b) => a - b);
      const list: (string | Awaited<ReturnType<typeof getUserAppNotification>>['data']['data']['list'][number])[] = [];
      const thisMonthDays = dayjs().endOf('month').date();
      const getDiffTodayStr = (diffToday = 0) => {
        if (diffToday <= 0) {
          return intl.formatMessage({ id: 'Notifications.today' });
        }
        if (diffToday === 1) {
          return intl.formatMessage({ id: 'Notifications.yesterday' });
        }
        if (diffToday > 1 && diffToday < 7) {
          return intl.formatMessage({ id: 'Notifications.thisWeek' });
        }
        if (diffToday >= 7 && diffToday < 14) {
          return intl.formatMessage({ id: 'Notifications.lastWeek' });
        }
        if (diffToday < thisMonthDays) {
          return intl.formatMessage({ id: 'Notifications.thisMonth' });
        }
        return intl.formatMessage({ id: 'Notifications.lastMonth' });
      };
      const objList: {
        [key: string]: Awaited<ReturnType<typeof getUserAppNotification>>['data']['data']['list'];
      } = {};
      for (const key of keys) {
        const itemDay = dayjs(key).startOf('day');
        const diffTodayStr = getDiffTodayStr(dayjs().startOf('day').diff(itemDay, 'day'));
        if (Object.keys(objList).includes(diffTodayStr)) {
          objList[diffTodayStr] = [...objList[diffTodayStr], ...gList[key]];
        } else {
          objList[diffTodayStr] = gList[key];
        }
      }
      for (const key of Object.keys(objList)) {
        list.push(key);
        list.push(...objList[key]);
      }
      return list;
    }, [intl, notificationData.list]);

  const stickyHeaderIndices = useMemo(
    () =>
      sectionList
        .map((item, index) => {
          if (typeof item === 'string') {
            return index;
          } else {
            return null;
          }
        })
        .filter((item) => item !== null) as number[],
    [sectionList],
  );
  const handleRefresh = useCallback(async () => {
    setPageNo(1);
    const res = await getAppNotification({ pageNo: 1, pageSize: 20 });
    setNotificationData(res);
  }, [getAppNotification]);

  const handleLoadMore = useCallback(async () => {
    try {
      if (loadMore || notificationData.list.length === notificationData.total) {
        return;
      }
      setLoadMore(true);
      setPageNo((v) => v + 1);
      const res = await getAppNotification({ pageNo: pageNo + 1, pageSize: 10 });
      setNotificationData((v) => ({
        list: [...v.list, ...res.list],
        total: res.total,
      }));
    } catch (e) {
      console.log('handleLoadMore:', e);
    } finally {
      setLoadMore(false);
    }
  }, [loadMore, notificationData.list.length, notificationData.total, getAppNotification, pageNo]);

  useFocusEffect(
    useCallback(() => {
      putUserAppNotificationRead({
        notificationId: 'ALL',
      });
    }, []),
  );

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <PageView style={[styles.page]}>
      <NavBar title={intl.formatMessage({ id: 'Notifications.title' })} isShowShadow />
      <View style={[styles.container]}>
        <FlashList
          ref={listRef}
          data={sectionList}
          optimizeItemArrangement={true}
          ListHeaderComponent={() => {
            if (groupChatList?.list && groupChatList?.list.length > 0) {
              return (
                <TouchableOpacity
                  style={[RequestStyles.container]}
                  onPress={() => {
                    router.push({
                      pathname: '/main/groupsRequests',
                      params: {},
                    });
                  }}>
                  <Avatar
                    shape="square"
                    style={[RequestStyles.avatar]}
                    images={groupChatList.list.map((x) => s3ImageTransform(x.chatroomAvatar, 'small'))}
                  />
                  <View style={[RequestStyles.info]}>
                    <Text
                      style={[
                        RequestStyles.infoName,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      {intl.formatMessage({ id: 'Notifications.GroupsRequests' })}
                    </Text>
                    <Text
                      style={[
                        RequestStyles.infoDesc,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      @{groupChatList.list[0].chatroomName}
                      {groupChatList.list.length > 1 ? (
                        <Text>
                          {' '}
                          {intl.formatMessage({ id: 'Notifications.others' }, { num: groupChatList.list.length - 1 })}
                        </Text>
                      ) : undefined}
                    </Text>
                  </View>
                  <View style={[RequestStyles.button]}>
                    <ArrowLeftOutline
                      style={[
                        {
                          transform: [{ scaleX: -1 }],
                        },
                      ]}
                      color="rgba(128, 135, 142, 1)"
                      height={pxToDp(36)}
                      width={pxToDp(36)}
                    />
                  </View>
                </TouchableOpacity>
              );
            }
          }}
          refreshControl={
            <RefreshControl
              colors={[computedThemeColor.primary]}
              tintColor={computedThemeColor.primary}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          onEndReached={handleLoadMore} // 滚动到底部时触发
          onEndReachedThreshold={0.1} // 距离底部 10% 时触发
          renderItem={({ item }) => {
            if (typeof item === 'string') {
              // Rendering header
              return (
                <View style={[RequestStyles.gapTitle]}>
                  <Text
                    style={[
                      RequestStyles.gapTitleText,
                      {
                        color: computedThemeColor.text,
                      },
                    ]}>
                    {item}
                  </Text>
                </View>
              );
            } else {
              const itemDay = dayjs(item?.createdAt).startOf('day'); // 当前数据的推送日期
              const diffToday = dayjs().startOf('day').diff(itemDay, 'day'); // 推送日期和现实日期的天数差
              // Render item
              const { title, content } = (() => {
                const authors = uniqBy(item?.authors, 'nickname');
                const title = authors.map((x: any) => `${x.nickname}`).join(', ');
                // 帖子被点赞
                if (item.type === 'thumb') {
                  return {
                    title,
                    content: `${authors.length === 1 ? title + ' ' : ''}${intl.formatMessage(
                      {
                        id:
                          authors.length <= 1
                            ? 'Notifications.LikesOnYourPost'
                            : 'Notifications.AndOthersLikesOnYourPost',
                      },
                      { num: authors.length },
                    )}`,
                  };
                }

                // 关注用户发帖
                if (item.type === 'post') {
                  return {
                    title,
                    content: intl.formatMessage({ id: 'Notifications.NewPostBy' }),
                  };
                }

                if (item.type === 'comment' || item.type === 'at') {
                  const content = (
                    <Text>
                      {authors.map((x: any) => x.nickname).join(',') + ' '}
                      <Text
                        style={[
                          {
                            fontSize: pxToDp(24),
                            lineHeight: pxToDp(32),
                          },
                        ]}>
                        {intl
                          .formatMessage({ id: 'Notifications.JustCommented' })
                          .replace(diffToday > 0 ? 'just' : '', '')}
                        {intl.locale === 'ru' && authors.filter((x: any) => x.gender === 'MALE')?.length > 0
                          ? '(-а) '
                          : intl.locale === 'ru'
                            ? '(а)'
                            : ''}
                      </Text>
                    </Text>
                  );
                  return {
                    title,
                    content,
                  };
                }
                return {
                  title,
                  content: '',
                };
              })();

              const onGo = async () => {
                await putUserAppNotificationRead({
                  notificationId: item.id,
                });

                // listRef.current?.refresh();
                if (['thumb', 'post'].includes(item.type)) {
                  setRefreshConfig((v) => {
                    return {
                      ...v,
                      homePage: {
                        ...v?.homePage,
                        feedRefresh: true,
                        followRefresh: true,
                        privateRefresh: true,
                      },
                    };
                  });
                  router.push({
                    pathname: '/main/agora-details/[postId]',
                    params: {
                      postId: item.metadata.postId!,
                      id: item.metadata.postId,
                      scrollToCommentId: item.metadata.commentId,
                    },
                  });
                }

                if (['at', 'comment'].includes(item.type)) {
                  router.push({
                    pathname: '/main/agora-details/[postId]',
                    params: {
                      postId: item.metadata.postId!,
                      id: item.metadata.postId,
                      scrollToCommentId: item.metadata.commentId,
                    },
                  });
                }
              };
              return (
                <TouchableOpacity style={[RequestStyles.container]} onPress={onGo}>
                  <Avatar
                    key={item.id}
                    shape="square"
                    style={[RequestStyles.avatar]}
                    images={
                      uniqBy(item?.authors, 'nickname').map((x: any) => s3ImageTransform(x.avatar, 'small')) || []
                    }
                  />
                  <View style={[RequestStyles.info]}>
                    <Text
                      numberOfLines={1}
                      style={[
                        RequestStyles.infoName,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      {title}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: pxToDp(8),
                      }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            RequestStyles.infoDesc,
                            {
                              color: computedThemeColor.text_secondary,
                            },
                          ]}
                          numberOfLines={2}>
                          {content}
                        </Text>
                      </View>
                      {item?.createdAt && (
                        <View
                          style={{
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: computedThemeColor.text_secondary,
                              fontSize: pxToDp(22),
                              lineHeight: pxToDp(28),
                            }}>
                            {customFromNow(dayjs(item.createdAt), {
                              locale: intl.locale,
                              localeSuffix: intl.formatMessage({ id: 'passTime.ago' }),
                            })}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  {!item.readFlag && <View style={styles.bellDot} />}
                  {item.type === 'comment' ? (
                    <View
                      style={{
                        width: pxToDp(90),
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                      }}>
                      <ChatOutline width={pxToDp(48)} height={pxToDp(48)} color="#80878E" />
                    </View>
                  ) : item.cover ? (
                    <View
                      style={{
                        width: pxToDp(90),
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                      }}>
                      <Image
                        style={[RequestStyles.cover]}
                        source={s3ImageTransform(item.cover, 'small')}
                        placeholder={placeholderImg}
                        placeholderContentFit="cover"
                        contentFit="cover"
                      />
                    </View>
                  ) : undefined}
                </TouchableOpacity>
              );
            }
          }}
          stickyHeaderIndices={stickyHeaderIndices}
          getItemType={(item) => {
            // To achieve better performance, specify the type based on the item
            return typeof item === 'string' ? 'sectionHeader' : 'row';
          }}
          ListFooterComponentStyle={{ width: '100%' }}
          ListFooterComponent={
            <View
              style={{
                paddingVertical: pxToDp(24),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loadMore ? <DotLoading size={pxToDp(10)} color={computedThemeColor.text} /> : undefined}
            </View>
          }
        />
      </View>
    </PageView>
  );
}

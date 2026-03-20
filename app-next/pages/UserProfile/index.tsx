import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/Avatar';
import { MenuDotsFilled } from '@/components/Icon';
import Modal from '@/components/Modal';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { PostMoreAction } from '@/components/Post/More/types';
import TabView from '@/components/TabView';
import Toast from '@/components/Toast';
import { SHARE_EXTERNAL_LINK_HOST } from '@/constants';
import { createConversation } from '@/database/services';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import CommentsScene from '@/pages/Profile/CommentsScene';
import PostsScene from '@/pages/Profile/PostsScene';
import { postContentAppFollowRelation } from '@/services/agoraxin';
import { getContentAppUserStatistics } from '@/services/gerenzhongxin';
import { getBotAppChatroomId } from '@/services/pinyin2';
import { getUserAppUser, getUserAppUserId } from '@/services/userService';
import { putUserAppUserBlockUserId, putUserAppUserUnBlockUserId } from '@/services/yonghupingbi';
import { getBotAppChatroomUserChat } from '@/services/yonghuyiduiyiliaotian';
import { formatCompactNumber } from '@/utils/formatCompactNumber';
import formatRussianNumber from '@/utils/formatRussianNumber';
import pxToDp, { deviceHeightDp } from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

export default function Search() {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor: theme, computedTheme } = useConfigProvider();
  const { fetchChatRoomDetail, conversations } = useGroupChatProvider();
  const [showMoreModal, setShowMoreModal] = useState<boolean>(false);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<Awaited<ReturnType<typeof getContentAppUserStatistics>>['data']['data']>(
    {
      storyTotal: 0,
      followersTotal: 0,
      followingTotal: 0,
      postTotal: 0,
      commentTotal: 0,
      friendTotal: 0,
    },
  );
  const {
    userId,
    showBack = 'true',
    username,
  } = useLocalSearchParams<{
    userId: string;
    username: string; // 分享后，通过 username 进行查询
    showBack: string; // 不需要顶部返回时可以设置为 false， 这里默认开启
  }>();

  const {
    data: userInfo,
    refreshAsync,
    loading: refreshing,
  } = useRequest(
    async () => {
      if (username) {
        const resp = await getUserAppUser({ username });
        return resp.data.data || {};
      }
      const resp = await getUserAppUserId({ id: userId });
      return resp.data.data || {};
    },
    {
      debounceWait: 300,
      refreshDeps: [userId, username],
    },
  );

  useEffect(() => {
    if (userInfo?.id) {
      getContentAppUserStatistics({ userId: userInfo.id + '' }).then((res) => {
        setStatistics(res?.data?.data);
      });
    }
  }, [userInfo]);

  // 关注 / 取消关注
  const { run: fetchFollowOrUnfollow, loading } = useRequest(
    async () => {
      try {
        const res = await postContentAppFollowRelation({
          followingId: userId,
          type: 'USER',
          actionType: userInfo?.followed ? 'DELETE' : 'ADD',
        });
        if (res.data?.code !== 0) {
          Toast.error(res.data?.msg || intl.formatMessage({ id: 'failed' }));
          return;
        }
        // if (userInfo?.followed)
        await refreshAsync();
        // https://gitlab.parsec.com.cn/aika/app/-/issues/315
        // else Toast.info(intl.formatMessage({ id: 'user.followTip' })); // prettier-ignore
      } catch {
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    { manual: true, debounceWait: 300, refreshDeps: [userInfo, refreshAsync, userId] },
  );

  const { run: handleBlockUser, loading: blocking } = useRequest(
    async (type?: 'Block' | 'BlockAndReport') => {
      try {
        await putUserAppUserBlockUserId({ userId });
        await refreshAsync();
        setShowBlockModal(false);
        if (type === 'BlockAndReport') {
          setTimeout(() => {
            router.push({
              pathname: '/main/report/create',
            });
          }, 100);
        }
      } catch {
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    { manual: true, debounceWait: 300, refreshDeps: [userInfo, refreshAsync] },
  );
  const { run: handleUnBlackUser, loading: unBlocking } = useRequest(
    async () => {
      try {
        await putUserAppUserUnBlockUserId({ userId });
        await refreshAsync();
        setShowBlockModal(false);
        setShowMoreModal(false);
      } catch {
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    { manual: true, debounceWait: 300, refreshDeps: [userInfo, refreshAsync] },
  );

  const { run: fetchStartChat, loading: starting } = useRequest(
    async () => {
      try {
        // https://gitlab.parsec.com.cn/aika/app/-/issues/315
        // if (!userInfo?.friend) {
        //   Toast.info(intl.formatMessage({ id: 'chats.chat.followTip' })); // prettier-ignore
        //   return;
        // }
        const res = await getBotAppChatroomUserChat({ friendId: userInfo?.id + '' });
        if (res.data.code !== 0) throw res;
        const conversation = conversations?.find((x) => x.conversationId === `${res.data.data}`);
        if (!conversation) {
          const roomRes = await getBotAppChatroomId({ id: res.data.data as unknown as string });
          const {
            id,
            createdAt,
            creator,
            roomCode,
            roomAvatar,
            roomName,
            description,
            groupType,
            roomType,
            updater,
            updatedAt,
          } = roomRes?.data?.data;
          await createConversation({
            conversationId: String(id),
            roomName: roomName || '',
            roomAvatar: roomAvatar || '',
            roomCode: roomCode || '',
            roomType: roomType || 'CHAT',
            description: description || '',
            groupType: groupType,
            updater: String(updater),
            creator: String(creator),
            updatedAt: dayjs(updatedAt).toDate(),
            createdAt: dayjs(createdAt).toDate(),
            unreadNum: 0,
          });
        }
        await fetchChatRoomDetail({ val: String(res.data.data), type: 'id' });
        router.push({
          pathname: '/main/group-chat/chat/[roomId]',
          params: { roomId: res.data.data, isPersonal: 'true' },
        });
      } catch {
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    { manual: true, debounceWait: 300, refreshDeps: [userInfo] },
  );

  const handleToFriend = useCallback(
    (type: string) => {
      router.push({
        pathname: '/main/friend',
        params: {
          title: userInfo?.nickname,
          userId: userInfo?.id,
          type,
        },
      });
    },
    [userInfo],
  );

  const renderPostsScene = useCallback(
    () => (
      <PostsScene
        userId={userId}
        navBarMoreItems={[PostMoreAction.Report, PostMoreAction.Share, PostMoreAction.Hide]}
      />
    ),
    [userId],
  );
  const renderCommentsScene = useCallback(() => <CommentsScene userId={userId} />, [userId]);

  const getUsername = useCallback(() => {
    if (userInfo?.username && userInfo?.username?.length > 20) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert('', `@${userInfo?.username}`);
          }}
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: pxToDp(12),
            marginBottom: pxToDp(12),
          }}>
          <Text style={[styles.username, { color: theme.text }]}>@{userInfo?.username.slice(0, 20) + '...'}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: pxToDp(12),
          marginBottom: pxToDp(12),
        }}>
        <Text style={[styles.username, { color: theme.text_secondary }]}>@{userInfo?.username}</Text>
      </View>
    );
  }, [theme.text, theme.text_secondary, userInfo?.username]);

  const source = useMemo(
    () =>
      userInfo?.backgroundImage
        ? { uri: s3ImageTransform(userInfo?.backgroundImage, [750, 584]) }
        : require('@/assets/images/profile/profile-bg.png'),
    [userInfo],
  );

  if ((!refreshing && !userInfo?.id) || userInfo?.status === 'disabled') {
    return (
      <PageView style={[styles.page]} loading={loading}>
        <View style={[styles.emptyContainer]}>
          <Text style={[styles.text]}>
            {intl.formatMessage({
              id: userInfo?.status === 'disabled' ? 'UserProfile.detail.disabled' : 'UserProfile.detail.NotExists',
            })}
          </Text>
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => {
              router.back();
            }}>
            <Text style={[styles.btnText]}>{intl.formatMessage({ id: 'GoBack' })}</Text>
          </TouchableOpacity>
        </View>
      </PageView>
    );
  }

  return (
    <ParallaxScrollView
      style={[styles.page, { backgroundColor: theme.bg_primary }]}
      headerHeight={pxToDp(680)}
      minHeader={
        showBack ? (
          <ImageBackground
            resizeMode="cover"
            resizeMethod="resize"
            style={{ paddingBottom: pxToDp(32) }}
            source={source}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.78)',
                paddingTop: insets.top,
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
            />
            <NavBar
              theme={computedTheme}
              style={[{ backgroundColor: '#ffffff00' }]}
              title={
                <View style={{ flexDirection: 'row', gap: pxToDp(20) }}>
                  <Avatar img={userInfo?.avatar} shape="circle" size={100} />
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: pxToDp(12),
                      }}>
                      <Text style={[styles.nickname, { color: theme.text }]} numberOfLines={1}>
                        {userInfo?.nickname}
                      </Text>
                    </View>
                    {getUsername()}
                  </View>
                </View>
              }
              more={
                <TouchableOpacity style={styles.settingBox} activeOpacity={0.6} onPress={() => setShowMoreModal(true)}>
                  <MenuDotsFilled width={pxToDp(40)} height={pxToDp(40)} color={theme.text} />
                </TouchableOpacity>
              }
            />
          </ImageBackground>
        ) : (
          <></>
        )
      }
      header={
        <>
          <ImageBackground
            resizeMode="cover"
            resizeMethod="resize"
            source={source}
            style={{
              paddingTop: (showBack ? pxToDp(108) : 0) + insets.top,
              paddingHorizontal: pxToDp(32),
              paddingBottom: pxToDp(32),
              gap: pxToDp(24),
            }}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.78)',
                paddingTop: insets.top,
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
            />
            <View style={{ flexDirection: 'row' }}>
              <Avatar
                img={userInfo?.avatar}
                bordered
                innerBorder
                shape="square"
                borderColor="#ffffff40"
                innerBorderColor="#ffffff40"
                size={pxToDp(360)}
              />
              <View style={styles.nicknameAndBioBox}>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: pxToDp(12),
                  }}>
                  <Text style={[styles.nickname, { color: theme.text }]} numberOfLines={1}>
                    {userInfo?.nickname}
                  </Text>
                </View>
                {getUsername()}
                <Text style={[styles.bio, { color: theme.text }]} numberOfLines={3}>
                  {userInfo?.bio}
                </Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.counterBox}>
              <TouchableOpacity style={styles.counterItemBox} onPress={() => handleToFriend('following')}>
                <Text style={[styles.counterItemValue, { color: theme.text }]}>
                  {formatCompactNumber(statistics.followingTotal ?? 0)}
                </Text>
                <Text style={[styles.counterItemLabel, { color: theme.text_secondary }]}>
                  {intl.locale === 'ru'
                    ? formatRussianNumber(statistics.followingTotal ?? 0, 'followings')
                    : intl.formatMessage({ id: 'Following' })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.counterItemBox} onPress={() => handleToFriend('follower')}>
                <Text style={[styles.counterItemValue, { color: theme.text }]}>
                  {formatCompactNumber(statistics.followersTotal ?? 0)}
                </Text>
                <Text style={[styles.counterItemLabel, { color: theme.text_secondary }]}>
                  {intl.locale === 'ru'
                    ? formatRussianNumber(statistics.followersTotal ?? 0, 'followers')
                    : intl.formatMessage({ id: 'Followers' })}
                </Text>
              </TouchableOpacity>
              <View style={styles.counterItemBox}>
                <Text style={[styles.counterItemValue, { color: theme.text }]}>
                  {formatCompactNumber(statistics.postTotal ?? 0)}
                </Text>
                <Text style={[styles.counterItemLabel, { color: theme.text_secondary }]}>
                  {intl
                    .formatMessage({ id: 'Posts' })
                    .replace(intl.locale === 'ru' && statistics?.postTotal === 1 ? 'Публикации' : '--', 'Публикация')}
                </Text>
              </View>
              <View style={styles.counterItemBox}>
                <Text style={[styles.counterItemValue, { color: theme.text }]}>
                  {formatCompactNumber(statistics.storyTotal ?? 0)}
                </Text>
                <Text style={[styles.counterItemLabel, { color: theme.text_secondary }]}>
                  {intl.formatMessage({ id: 'Sphere.FairyTales' })}
                </Text>
              </View>
            </ScrollView>
            {/*Unblock*/}
            {userInfo?.isBlacked ? (
              <View style={styles.followAndChatBox}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={[styles.FCBtn, { flexDirection: 'row', gap: pxToDp(20), borderColor: theme.primary }]}
                  onPress={handleUnBlackUser}>
                  {unBlocking && <ActivityIndicator size="small" color={theme.primary} />}
                  <Text
                    style={{
                      fontSize: pxToDp(28),
                      color: theme.primary,
                    }}>
                    {intl.formatMessage({ id: 'UserProfile.ChooseAction.Options.Unblock' })}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.followAndChatBox, { gap: pxToDp(16) }]}>
                <TouchableOpacity
                  disabled={refreshing || starting}
                  onPress={fetchStartChat}
                  activeOpacity={0.6}
                  style={[styles.FCBtn, { borderColor: userInfo?.friend ? theme.primary : theme.text_secondary }]}>
                  {starting ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Text
                      style={{
                        fontSize: pxToDp(28),
                        color: userInfo?.friend ? theme.primary : theme.text_secondary,
                      }}>
                      {intl.formatMessage({ id: 'Chat' })}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={loading || refreshing}
                  onPress={fetchFollowOrUnfollow}
                  activeOpacity={0.6}
                  style={[styles.FCBtn, { borderColor: userInfo?.followed ? theme.text_secondary : theme.primary }]}>
                  {loading ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Text
                      style={{
                        fontSize: pxToDp(28),
                        color: userInfo?.followed ? theme.text_secondary : theme.primary,
                      }}>
                      {refreshing
                        ? ''
                        : userInfo?.followed
                          ? intl.formatMessage({ id: 'unfollow' })
                          : intl.formatMessage({ id: 'follow' })}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ImageBackground>
          {showBack && (
            <NavBar
              theme={computedTheme}
              position="Sticky"
              style={[{ backgroundColor: '#ffffff00' }]}
              more={
                <TouchableOpacity style={styles.settingBox} activeOpacity={0.6} onPress={() => setShowMoreModal(true)}>
                  <MenuDotsFilled width={pxToDp(40)} height={pxToDp(40)} color={theme.text} />
                </TouchableOpacity>
              }
            />
          )}
        </>
      }>
      <View style={styles.container}>
        <TabView
          style={{
            flex: 1,
            backgroundColor: theme.bg_primary,
            height:
              deviceHeightDp -
              Platform.select({
                ios: pxToDp(260),
                android: pxToDp(200),
                default: pxToDp(200),
              }),
          }}
          // tabStyle={{ width: 'auto' }}
          // scrollEnabled
          selectedColor="#ffffff"
          routes={[
            {
              key: 'fairy-tales',
              title: intl.formatMessage({ id: 'Posts' }),
              scene: renderPostsScene,
            },
            {
              key: 'posts',
              title: intl.formatMessage({ id: 'Comments' }),
              scene: renderCommentsScene,
            },
          ]}
        />
      </View>
      <Modal
        maskBlur={false}
        position="BOTTOM"
        title={intl.formatMessage({ id: 'UserProfile.ChooseAction.Title' })}
        visible={showMoreModal}
        onClose={() => setShowMoreModal(false)}>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              if (userInfo?.isBlacked) {
                handleUnBlackUser();
              } else {
                setShowMoreModal(false);
                setShowBlockModal(true);
              }
            }}>
            {unBlocking && <ActivityIndicator size="small" color={theme.text_error} />}
            <Text style={[styles.actionItemText, { color: theme.text_error }]}>
              {intl.formatMessage({
                id: userInfo?.isBlacked
                  ? 'UserProfile.ChooseAction.Options.Unblock'
                  : 'UserProfile.ChooseAction.Options.Block',
              })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setShowMoreModal(false);
              setTimeout(() => {
                router.push({
                  pathname: '/main/report/create',
                });
              }, 100);
            }}>
            <Text style={[styles.actionItemText, { color: theme.text_error }]}>
              {intl.formatMessage({ id: 'UserProfile.ChooseAction.Options.Report' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setShowMoreModal(false);
              setTimeout(() => {
                Share.share({
                  message: 'message',
                  url: `https://${SHARE_EXTERNAL_LINK_HOST}/users/@${userInfo?.username}`,
                })
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    err && console.log(err);
                  });
              }, 100);
            }}>
            <Text style={[styles.actionItemText, { color: theme.text_black }]}>
              {intl.formatMessage({ id: 'UserProfile.ChooseAction.Options.ShareProfile' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              Clipboard.setStringAsync(`https://${SHARE_EXTERNAL_LINK_HOST}/user${userInfo?.username}` || '').then(
                (res) => {
                  if (res) {
                    setShowMoreModal(false);
                    Toast.success(intl.formatMessage({ id: 'CopySuccess' }));
                  }
                },
              );
            }}>
            <Text style={[styles.actionItemText, { color: theme.text_black }]}>
              {intl.formatMessage({ id: 'UserProfile.ChooseAction.Options.CopyProfileURL' })}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        maskBlur={false}
        position="BOTTOM"
        title={intl.formatMessage({ id: 'UserProfile.ChooseAction.Block.Title' }, { name: userInfo?.username })}
        visible={showBlockModal}
        onClose={() => setShowBlockModal(false)}>
        <View style={styles.actionContainer}>
          <View style={[{ gap: pxToDp(24), marginBottom: pxToDp(24), paddingRight: pxToDp(42) }]}>
            <View style={styles.actionInfo}>
              <View style={[styles.actionInfoDot, { backgroundColor: theme.text_secondary }]} />
              <Text style={{ fontSize: pxToDp(28), color: theme.text_secondary }}>
                {intl.formatMessage({ id: 'UserProfile.ChooseAction.Block.info.1' })}
              </Text>
            </View>
            <View style={styles.actionInfo}>
              <View style={[styles.actionInfoDot, { backgroundColor: theme.text_secondary }]} />
              <Text style={{ fontSize: pxToDp(28), color: theme.text_secondary }}>
                {intl.formatMessage({ id: 'UserProfile.ChooseAction.Block.info.2' })}
              </Text>
            </View>
            <View style={styles.actionInfo}>
              <View style={[styles.actionInfoDot, { backgroundColor: theme.text_secondary }]} />
              <Text style={{ fontSize: pxToDp(28), color: theme.text_secondary }}>
                {intl.formatMessage({ id: 'UserProfile.ChooseAction.Block.info.3' })}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              handleBlockUser('Block');
            }}>
            {blocking && <ActivityIndicator size="small" color={theme.text_error} />}
            <Text style={[styles.actionItemText, { color: theme.text_error }]}>
              {intl.formatMessage({ id: 'UserProfile.ChooseAction.Options.Block' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionItem, { backgroundColor: 'transparlt' }]}
            onPress={() => {
              handleBlockUser('BlockAndReport');
            }}>
            <Text style={[styles.actionItemText, { color: theme.text_error }]}>
              {intl.formatMessage({ id: 'UserProfile.ChooseAction.Options.BlockAndReport' })}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

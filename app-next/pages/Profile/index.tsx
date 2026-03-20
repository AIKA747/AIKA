import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert, Animated, ImageBackground, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/Avatar';
import { CheckboxTwoTone, SettingsFilled } from '@/components/Icon';
import TabView from '@/components/TabView';
import { SHARE_EXTERNAL_LINK_HOST } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import CommentsScene from '@/pages/Profile/CommentsScene';
import { getContentAppUserStatistics } from '@/services/gerenzhongxin';
import { formatCompactNumber } from '@/utils/formatCompactNumber';
import formatRussianNumber from '@/utils/formatRussianNumber';
import pxToDp, { deviceHeightDp } from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import FairyTales from './FairyTales';
import PostsScene from './PostsScene';
import styles from './styles';
import Subscription from './Subscription';

const Profile = () => {
  const intl = useIntl();
  const { userInfo } = useAuth();
  const insets = useSafeAreaInsets();
  const { computedThemeColor } = useConfigProvider();
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

  useFocusEffect(
    useCallback(() => {
      getContentAppUserStatistics({}).then((res) => {
        setStatistics(res?.data?.data);
      });
    }, []),
  );
  const handleToFriend = useCallback(
    (type: string) => {
      router.push({
        pathname: '/main/friend',
        params: {
          title: userInfo?.nickname,
          type,
        },
      });
    },
    [userInfo],
  );

  const getUsername = useCallback(() => {
    if (userInfo?.username && userInfo?.username?.length > 20) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert('', `@${userInfo?.username}`);
          }}
          style={{ marginBottom: pxToDp(12) }}>
          <Text style={[styles.text14, { color: computedThemeColor.text_secondary }]}>
            @{userInfo?.username.slice(0, 20) + '...'}
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={{ marginBottom: pxToDp(12) }}>
        <Text style={[styles.text14, { color: computedThemeColor.text_secondary }]}>@{userInfo?.username}</Text>
      </View>
    );
  }, [computedThemeColor.text_secondary, userInfo?.username]);

  const routes = useMemo(
    () => [
      {
        key: 'fairy-tales',
        title: intl.formatMessage({ id: 'Sphere.FairyTales' }),
        scene: () => <FairyTales />,
      },
      {
        key: 'posts',
        title: intl.formatMessage({ id: 'Posts' }),
        scene: () => <PostsScene />,
      },
      {
        key: 'comments',
        title: intl.formatMessage({ id: 'Comments' }),
        scene: () => <CommentsScene userId={userInfo?.userId} />,
      },
      {
        key: 'subscription',
        title: intl.formatMessage({ id: 'Subscription' }),
        scene: () => <Subscription />,
      },
    ],
    [intl, userInfo?.userId],
  );

  const source = useMemo(
    () =>
      userInfo?.backgroundImage
        ? { uri: s3ImageTransform(userInfo?.backgroundImage, [750, 584]) }
        : require('@/assets/images/profile/profile-bg.png'),
    [userInfo],
  );
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <Animated.ScrollView
      style={[styles.page, { backgroundColor: computedThemeColor.bg_primary }]}
      stickyHeaderIndices={[1]}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      })}
      scrollEventThrottle={16}>
      <ImageBackground source={source} style={[styles.bg, { paddingTop: insets.top }]}>
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
        <View>
          <View style={styles.settingBox}>
            <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/main/setting')}>
              <SettingsFilled color={computedThemeColor.text} width={pxToDp(48)} height={pxToDp(48)} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: pxToDp(32), flexDirection: 'row' }}>
            <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/main/personalInfoFillEdit')}>
              <Avatar
                bordered
                innerBorder
                shape="square"
                borderColor="#ffffff40"
                innerBorderColor="#ffffff40"
                img={userInfo?.avatar}
                size={220}
              />
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {userInfo?.status === 'verified' && (
                    <CheckboxTwoTone
                      width={pxToDp(40)}
                      height={pxToDp(40)}
                      color={computedThemeColor.text_blue}
                      twoToneColor="#000"
                      style={[styles.verifyIcon]}
                    />
                  )}
                  <Text style={[styles.text16, { color: computedThemeColor.text }]}>{userInfo?.nickname}</Text>
                </View>
                {getUsername()}
                <Text
                  style={[styles.text14, { color: computedThemeColor.text }]}
                  numberOfLines={3}
                  ellipsizeMode="tail">
                  {userInfo?.bio}
                </Text>
              </View>
              {/* 不清楚是什么功能,暂时移除 */}
              {/* <View style={styles.blockBox}>
                <View>
                  <View style={styles.dotBox}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <View key={i} style={[styles.dot, { backgroundColor: '#fff' }]} />
                    ))}
                  </View>
                </View>
                <View style={[styles.horBlock, { backgroundColor: '#fff' }]} />
              </View> */}
            </View>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.counterBox}>
          <TouchableOpacity style={styles.counterItemBox} onPress={() => handleToFriend('following')}>
            <Text style={[styles.counterItemValue, { color: computedThemeColor.text }]}>
              {formatCompactNumber(statistics?.followingTotal ?? 0)}
            </Text>
            <Text style={[styles.counterItemLabel, { color: computedThemeColor.text_secondary }]}>
              {intl.locale === 'ru'
                ? formatRussianNumber(statistics?.followingTotal ?? 0, 'followings')
                : intl.formatMessage({ id: 'Following' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.counterItemBox} onPress={() => handleToFriend('follower')}>
            <Text style={[styles.counterItemValue, { color: computedThemeColor.text }]}>
              {formatCompactNumber(statistics?.followersTotal ?? 0)}
            </Text>
            <Text style={[styles.counterItemLabel, { color: computedThemeColor.text_secondary }]}>
              {intl.locale === 'ru'
                ? formatRussianNumber(statistics?.followersTotal ?? 0, 'followers')
                : intl.formatMessage({ id: 'Followers' })}
            </Text>
          </TouchableOpacity>
          <View style={styles.counterItemBox}>
            <Text style={[styles.counterItemValue, { color: computedThemeColor.text }]}>
              {formatCompactNumber(statistics?.postTotal ?? 0)}
            </Text>
            <Text style={[styles.counterItemLabel, { color: computedThemeColor.text_secondary }]}>
              {intl
                .formatMessage({ id: 'Posts' })
                .replace(intl.locale === 'ru' && statistics?.postTotal === 1 ? 'Публикации' : '--', 'Публикация')}
            </Text>
          </View>
          <View style={styles.counterItemBox}>
            <Text style={[styles.counterItemValue, { color: computedThemeColor.text }]}>
              {formatCompactNumber(statistics?.storyTotal ?? 0)}
            </Text>
            <Text style={[styles.counterItemLabel, { color: computedThemeColor.text_secondary }]}>
              {intl.formatMessage({ id: 'Sphere.FairyTales' })}
            </Text>
          </View>
        </ScrollView>
        <View style={{ flexDirection: 'row', paddingHorizontal: pxToDp(32), gap: pxToDp(16) }}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.button, { borderColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => router.push('/main/personalInfoFillEdit')}>
            <Text
              style={{
                fontSize: pxToDp(28),
                fontWeight: 400,
                lineHeight: pxToDp(70),
                color: computedThemeColor.text_secondary,
              }}>
              {intl.formatMessage({ id: 'Profile.Edit' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.button, { borderColor: 'rgba(255,255,255,0.2)' }]}
            onPress={() => {
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
            }}>
            <Text
              style={[
                {
                  fontSize: pxToDp(28),
                  lineHeight: pxToDp(70),
                  fontWeight: 400,
                  color: computedThemeColor.text_secondary,
                },
              ]}>
              {intl.formatMessage({ id: 'Profile.Share' })}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {/*<Animated.View*/}
      {/*  style={{*/}
      {/*    backgroundColor: 'skyblue',*/}
      {/*    // padding: 20,*/}
      {/*    opacity: scrollY.interpolate({*/}
      {/*      inputRange: [0, 100],*/}
      {/*      outputRange: [1, 0],*/}
      {/*      extrapolate: 'clamp',*/}
      {/*    }),*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Text>我是带动画的粘性头部</Text>*/}
      {/*</Animated.View>*/}

      <TabView
        style={{
          flex: 1,
          backgroundColor: computedThemeColor.bg_primary,
          height: deviceHeightDp - insets.top - insets.bottom - pxToDp(80),
        }}
        tabStyle={['zh', 'ja'].includes(intl.locale) ? {} : { width: 'auto' }}
        scrollEnabled={!['zh', 'ja'].includes(intl.locale)}
        selectedColor="#ffffff"
        routes={routes}
      />
    </Animated.ScrollView>
  );
};

export default Profile;

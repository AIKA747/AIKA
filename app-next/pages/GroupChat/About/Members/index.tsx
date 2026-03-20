import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { groupBy, flatMap, sortBy } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import { CloseOutline, MinusCircleFilled, RadioCheckTwoTone, SearchOutline } from '@/components/Icon';
import { useConfirmModal } from '@/components/Modal';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { defaultCover } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { getContentAppFollowRelationUsers } from '@/services/gerenzhongxin';
import { deleteBotAppChatroomMembers } from '@/services/guanliyuanqunliaoshezhijiekou';
import { getBotAppChatroomMembers } from '@/services/pinyin2';
import { postBotAppChatroomMembers } from '@/services/qunchengyuanqunliaoshezhi';
import { capitalizeFirstLetterAndLowerRest } from '@/utils';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

export default function AboutGroupChatMembers() {
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const intl = useIntl();
  const { userInfo } = useAuth();
  const { type, roomId } = useLocalSearchParams<{
    type: string; // query： 查询群成员 add： 添加群成员
    roomId: string; // 群ID
    excludeIds: string; // 用于排除查询出来的群成员列表
  }>();
  const { el, show } = useConfirmModal({});
  const { refreshChatRoomDetail, chatRoomDetail } = useGroupChatProvider();
  const [searchKey, setSearchKey] = useState<string>();
  const [edit, setEdit] = useState<boolean>(false);
  const [rowSwipeAnimatedValues, setRowSwipeAnimatedValues] = useState<{ [key: string]: any }>({});
  const [pageData, setPageData] = useState<{
    data: { title: string; data: any[] }[];
    total: number;
  }>({
    data: [],
    total: 0,
  });
  const { loading, runAsync } = useRequest(postBotAppChatroomMembers, {
    manual: true,
    debounceWait: 300,
  });
  const { loading: refreshing, runAsync: fetchBotAppChatroomMembers } = useRequest(getBotAppChatroomMembers, {
    manual: true,
    debounceWait: 300,
  });
  const { loading: refresh, runAsync: fetchUserAppFriends } = useRequest(getContentAppFollowRelationUsers, {
    manual: true,
    debounceWait: 300,
  });
  const { loading: deleting, runAsync: deleteChatroomMembers } = useRequest(deleteBotAppChatroomMembers, {
    manual: true,
    debounceWait: 300,
  });

  const handleChange = useCallback((id: number) => {
    setPageData((v) => {
      return {
        ...v,
        data: v.data.map((item) => {
          const data = item.data.find((x) => x?.id === id || x?.userId === `${id}`);
          if (data) {
            data.isSelected = !data.isSelected;
          }
          return item;
        }),
      };
    });
  }, []);

  const checkedIds = useMemo(
    () =>
      flatMap(pageData.data, (item) => item.data)
        .filter((x) => x.isSelected)
        .map((x) => x.id),
    [pageData.data],
  );
  const selectedMembers = useMemo(
    () =>
      flatMap(pageData.data, (item) => item.data)
        .filter((x) => x.isSelected)
        .map((x) => ({
          memberType: 'USER',
          memberId: `${x.id || x.userId}`,
          avatar: x.avatar,
          nickname: x.nickname,
          username: x.username,
        })),
    [pageData.data],
  );

  const params = useMemo(
    () => ({
      roomId,
      searchKey,
    }),
    [searchKey, roomId],
  );

  const loadData = useCallback(async () => {
    let result: any;
    if (type === 'query') {
      result = await fetchBotAppChatroomMembers({
        ...params,
        nickname: params?.searchKey,
        roomId,
        pageNo: 1,
        pageSize: 999,
        status: 'APPROVE',
      });
    } else {
      result = await fetchUserAppFriends({
        ...params,
        pageNo: 1,
        pageSize: 999,
        // username: params?.searchKey,
        type: 2,
      });
    }
    const animatedValues: { [key: string]: any } = {};
    for (const item of result.data.data.list || []) {
      animatedValues[`${item.id || item.userId}`] = new Animated.Value(0);
    }
    const formatData = (list: API.GroupMemberListVO[]) => {
      // Step 1: Group by 'nickname'
      const groupedByNickname = groupBy(list, (user) => user.nickname.charAt(0).toUpperCase());

      // Step 2: Convert grouped data into the desired output format
      return Object.keys(groupedByNickname)
        .sort() // Sort keys alphabetically
        .map((key) => ({
          title: key,
          data: groupedByNickname[key],
        }));
    };
    setRowSwipeAnimatedValues(animatedValues);
    const data = formatData(result.data.data.list || []);
    setPageData({
      data: data || [],
      total: result.data.data.total || 0,
    });
  }, [fetchBotAppChatroomMembers, fetchUserAppFriends, params, roomId, type]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );
  const getMemberRole = useCallback(
    (role: string) => {
      switch (role) {
        case 'Owner':
          return intl.formatMessage({ id: 'AboutChat.Members.Owner' });
        case 'Moderator':
          return intl.formatMessage({ id: 'AboutChat.Members.Moderator' });
        case 'Member':
          return intl.formatMessage({ id: 'AboutChat.Members.Member' });
        default:
          return role;
      }
    },
    [intl],
  );

  const renderItem = useCallback(
    (item: any) => {
      if (type === 'query') {
        return (
          <TouchableOpacity
            disabled={edit}
            onPress={() => {
              if (item.memberType === 'USER') {
                if (item.memberId === userInfo?.userId) router.push('/profile');
                else
                  router.push({
                    pathname: '/main/user-profile/[userId]',
                    params: { userId: item.memberId },
                  });
              } else if (item.memberType === 'BOT') {
                router.push({ pathname: '/main/botDetail', params: { botId: item.userId } });
              }
            }}
            style={[styles.optionItem, { backgroundColor: computedThemeColor.bg_primary, borderColor: '#25212E' }]}>
            <View style={styles.itemLeftContent}>
              <Image
                contentFit="cover"
                placeholderContentFit="cover"
                placeholder={defaultCover}
                style={styles.avatar}
                source={{ uri: s3ImageTransform(item.avatar, 'middle') }}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    gap: pxToDp(12),
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginBottom: pxToDp(12),
                  }}>
                  {item.memberType === 'BOT' && (
                    <View
                      style={{
                        paddingVertical: pxToDp(8),
                        paddingHorizontal: pxToDp(12),
                        backgroundColor: computedThemeColor.primary,
                        borderRadius: pxToDp(8),
                      }}>
                      <Text
                        style={{
                          color: computedThemeColor.text,
                          fontFamily: 'ProductSansBold',
                          fontWeight: 'bold',
                          fontSize: pxToDp(16),
                        }}>
                        {intl.formatMessage({ id: 'AboutChat.Members.Tags.Bot' })}
                      </Text>
                    </View>
                  )}
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontSize: pxToDp(16 * 2),
                      color: computedThemeColor.text,
                    }}>
                    {item.nickname}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.status,
                    {
                      color: computedThemeColor.text_secondary,
                    },
                  ]}>
                  @{item.username}
                </Text>
              </View>
            </View>
            <View style={{ width: item.memberType === 'BOT' ? pxToDp(0) : pxToDp(180) }}>
              <Text
                style={{
                  fontSize: pxToDp(16 * 2),
                  color: computedThemeColor.text_secondary,
                  textAlign: 'right',
                }}>
                {item.memberType === 'BOT' ? '' : getMemberRole(capitalizeFirstLetterAndLowerRest(item.memberRole))}
              </Text>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            activeOpacity={type !== 'addMembers' ? 1 : 0.8}
            style={[styles.optionItem, { borderColor: '#25212E' }]}
            onPress={() => {
              handleChange(item.userId);
            }}>
            <View style={styles.itemLeftContent}>
              <Image
                contentFit="cover"
                placeholderContentFit="cover"
                placeholder={defaultCover}
                style={styles.avatar}
                source={{ uri: s3ImageTransform(item.avatar, 'small') }}
              />
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: pxToDp(16 * 2),
                      color: computedThemeColor.text,
                    }}>
                    {item.nickname}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.status,
                    {
                      color: computedThemeColor.text_secondary,
                    },
                  ]}>
                  @{item.username}
                </Text>
              </View>
            </View>
            <View style={{ width: pxToDp(50) }}>
              <RadioCheckTwoTone
                color={item.isSelected ? computedThemeColor.text_pink : computedThemeColor.text_secondary}
                twoToneColor="#fff"
                width={pxToDp(24 * 2)}
                height={pxToDp(24 * 2)}
                checked={item.isSelected}
              />
            </View>
          </TouchableOpacity>
        );
      }
    },
    [type, edit, computedThemeColor, intl, getMemberRole, userInfo?.userId, handleChange],
  );

  const title = useMemo(() => {
    if (type === 'add') {
      return intl.formatMessage({ id: 'AboutChat.AddMembers' });
    } else {
      return intl.formatMessage({ id: 'AboutChat.SearchMembers' });
    }
  }, [intl, type]);

  return (
    <PageView style={styles.page}>
      <NavBar
        theme={computedTheme}
        title={title}
        style={[{ backgroundColor: '#ffffff00' }]}
        more={
          <>
            {type === 'add' && (
              <TouchableOpacity
                disabled={checkedIds?.length === 0 || loading}
                style={{ paddingVertical: pxToDp(6), paddingHorizontal: pxToDp(24) }}
                onPress={() => {
                  runAsync({
                    members: selectedMembers,
                    roomId,
                  }).then((res) => {
                    console.log('res:', res?.data);
                    refreshChatRoomDetail();
                    router.back();
                  });
                }}>
                <Text
                  style={{
                    color: checkedIds?.length > 0 ? computedThemeColor.text : computedThemeColor.text_secondary,
                    fontSize: pxToDp(32),
                  }}>
                  {loading ? (
                    <ActivityIndicator color={computedThemeColor.primary} />
                  ) : (
                    intl.formatMessage({ id: 'Add' })
                  )}
                </Text>
              </TouchableOpacity>
            )}
            {type === 'query' && chatRoomDetail?.memberRole !== 'MEMBER' && (
              <TouchableOpacity
                style={{ paddingVertical: pxToDp(6), paddingHorizontal: pxToDp(24) }}
                onPress={() => {
                  setEdit(!edit);
                }}>
                <Text
                  style={{
                    color: computedThemeColor.text,
                    fontSize: pxToDp(32),
                  }}>
                  {intl.formatMessage({ id: edit ? 'updateEmail.done' : 'Edit' })}
                </Text>
              </TouchableOpacity>
            )}
          </>
        }
      />
      <View style={{ flex: 1 }}>
        <View style={[styles.searchBar]}>
          <View style={styles.searchBarBox}>
            <SearchOutline width={pxToDp(42)} height={pxToDp(42)} color="#fff" />
            <TextInput
              value={searchKey}
              onChangeText={(v) => {
                setSearchKey(v);
              }}
              onSubmitEditing={() => {
                setSearchKey(searchKey);
              }}
              placeholder={intl.formatMessage({ id: 'AboutChat.SearchMembers.Placeholder' })}
              placeholderTextColor="#aaa"
              style={[styles.searchInput, { marginLeft: pxToDp(14) }]}
            />
          </View>
          {searchKey && (
            <TouchableOpacity
              style={[styles.iconWrapper]}
              onPress={() => {
                setSearchKey(undefined);
              }}>
              <CloseOutline width={pxToDp(28)} height={pxToDp(28)} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <SwipeListView
          useSectionList
          useAnimatedList
          sections={sortBy(pageData.data, 'title')}
          keyExtractor={(item) => `${item.id || item.userId}`}
          refreshControl={
            <RefreshControl
              tintColor={computedThemeColor.primary}
              refreshing={refreshing || refresh}
              onRefresh={loadData}
            />
          }
          renderItem={({ item }: { item: API.GroupMemberListVO }) => renderItem(item)}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ backgroundColor: computedThemeColor.bg_primary }}>
              <Text style={styles.itemHeader}>{title}</Text>
            </View>
          )}
          initialNumToRender={50}
          renderHiddenItem={({ item }) =>
            edit && item.memberRole !== 'OWNER' ? (
              <View style={styles.qaContainer}>
                <Pressable
                  style={[styles.button]}
                  onPress={() => {
                    show({
                      text: intl.formatMessage({ id: 'chats.item.delete.text' }),
                      okButtonProps: { loading: deleting },
                      onOk: () => {
                        deleteChatroomMembers({
                          roomId,
                          memberIds: [item.memberId],
                        }).then((res) => {
                          if (res.data.code === 0) {
                            setPageData((prevState) => {
                              const data = prevState.data.map((d) => {
                                return {
                                  ...d,
                                  data: d.data.filter((x) => x.id !== item.id),
                                };
                              });
                              return { ...prevState, data: data.filter((x) => x.data.length) };
                            });
                            // loadData();
                          }
                        });
                      },
                    });
                  }}>
                  <Animated.View
                    style={[
                      {
                        transform: [
                          {
                            scale: rowSwipeAnimatedValues[item.id]?.interpolate({
                              inputRange: [45, 90],
                              outputRange: [0, 1],
                              extrapolate: 'clamp',
                            }),
                          },
                        ],
                      },
                    ]}>
                    <MinusCircleFilled color="rgba(235, 24, 24, 1)" width={pxToDp(48)} height={pxToDp(48)} />
                  </Animated.View>
                </Pressable>
              </View>
            ) : null
          }
          previewRowKey="0"
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={(swipeData) => {
            const { key, value } = swipeData;
            setRowSwipeAnimatedValues((v: any) => {
              if (v.hasOwnProperty(key)) {
                v[key].setValue(Math.abs(value) + pxToDp(80));
              }
              return v;
            });
          }}
          leftOpenValue={edit ? pxToDp(80) : 0}
        />
      </View>
      {el}
    </PageView>
  );
}

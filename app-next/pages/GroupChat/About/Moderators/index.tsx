import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwipeListView } from 'react-native-swipe-list-view';

import { AddSquareOutline, CloseOutline, MinusCircleFilled, RadioCheckTwoTone, SearchOutline } from '@/components/Icon';
import { useConfirmModal } from '@/components/Modal';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { defaultCover } from '@/constants';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { deleteBotAppChatroomMembers, putBotAppChatroomRole } from '@/services/guanliyuanqunliaoshezhijiekou';
import { getBotAppChatroomMembers } from '@/services/pinyin2';
import { capitalizeFirstLetterAndLowerRest } from '@/utils';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

export default function AboutGroupChatModerators() {
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const { el, show } = useConfirmModal({});
  const insets = useSafeAreaInsets();
  const intl = useIntl();
  const { type, roomId } = useLocalSearchParams<{
    type: string; // query： 查询群成员 addMembers： 添加群成员 addModerators： 添加群管理员
    roomId: string; // 群ID
    excludeIds: string; // 用于排除查询出来的群成员列表
  }>();
  const { refreshChatRoomDetail } = useGroupChatProvider();
  const [searchKey, setSearchKey] = useState<string>();
  const [edit, setEdit] = useState<boolean>(false);
  const [rowSwipeAnimatedValues, setRowSwipeAnimatedValues] = useState<{ [key: string]: any }>({});
  const [pageData, setPageData] = useState<{
    data: ({ isSelected?: boolean } & API.GroupMemberListVO)[];
    total: number;
  }>({
    data: [],
    total: 0,
  });
  const { loading, runAsync: setBotAppChatroomRole } = useRequest(putBotAppChatroomRole, {
    manual: true,
    debounceWait: 300,
  });
  const { loading: deleting, runAsync: deleteChatroomMembers } = useRequest(deleteBotAppChatroomMembers, {
    manual: true,
    debounceWait: 300,
  });
  const { loading: refreshing, runAsync: fetchBotAppChatroomMembers } = useRequest(getBotAppChatroomMembers, {
    manual: true,
    debounceWait: 300,
  });

  const handleChange = useCallback((id: string) => {
    setPageData((v) => {
      return {
        ...v,
        data: v.data.map((item) => {
          if (item.memberId === id) {
            item.isSelected = !item.isSelected;
          }
          return item;
        }),
      };
    });
  }, []);

  const checkedIds = useMemo(() => pageData.data.filter((x) => x.isSelected).map((x) => x.memberId), [pageData.data]);

  const params = useMemo(
    () => ({
      roomId,
      searchKey,
    }),
    [searchKey, roomId],
  );

  const loadData = useCallback(async () => {
    const result = await fetchBotAppChatroomMembers({
      ...params,
      nickname: params?.searchKey,
      pageNo: 1,
      pageSize: 99,
      memberRole: type === 'query' ? 'OWNER,MODERATOR' : 'MEMBER', // 同时查询群主和管理员
      status: 'APPROVE',
    });
    const animatedValues: { [key: string]: any } = {};
    for (const item of result.data.data.list || []) {
      animatedValues[`${item.id}`] = new Animated.Value(0);
    }
    setRowSwipeAnimatedValues(animatedValues);
    setPageData({
      data: (result.data.data.list || []).map((item) => ({ ...item, checked: false })),
      total: result.data.data.total || 0,
    });
  }, [fetchBotAppChatroomMembers, params, type]);

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
    (item: any, isLast?: boolean) => {
      if (type === 'query') {
        return (
          <View
            key={item.memberId}
            style={[
              styles.optionItem,
              {
                borderColor: isLast ? 'transparent' : '#25212E',
                backgroundColor: '#1B1B22',
                borderBottomLeftRadius: isLast ? pxToDp(16) : 0,
                borderBottomRightRadius: isLast ? pxToDp(16) : 0,
              },
            ]}>
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
                      color:
                        item.memberRole === 'MODERATOR' ? computedThemeColor.text : computedThemeColor.text_secondary,
                    }}>
                    {item.nickname}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.status,
                    {
                      color: item?.onlineStatus ? computedThemeColor.primary : computedThemeColor.text_secondary,
                    },
                  ]}>
                  {intl.formatMessage({
                    id: item.onlineStatus ? 'AboutChat.Members.Status.Online' : 'AboutChat.Members.Status.NotActive',
                  })}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  fontSize: pxToDp(16 * 2),
                  color: computedThemeColor.text_secondary,
                }}>
                {getMemberRole(capitalizeFirstLetterAndLowerRest(item.memberRole))}
              </Text>
            </View>
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            key={item.memberId}
            activeOpacity={0.8}
            style={[
              styles.optionItem,
              {
                borderColor: isLast ? 'transparent' : '#25212E',
                backgroundColor: '#1B1B22',
                borderBottomLeftRadius: isLast ? pxToDp(16) : 0,
                borderBottomRightRadius: isLast ? pxToDp(16) : 0,
              },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              handleChange(item.memberId);
            }}>
            <View style={styles.itemLeftContent}>
              <Image
                contentFit="cover"
                placeholderContentFit="cover"
                placeholder={defaultCover}
                style={styles.avatar}
                source={{ uri: s3ImageTransform(item?.avatar, 'small') }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: pxToDp(16 * 2),
                    color: computedThemeColor.text,
                  }}>
                  {item.nickname}
                </Text>
              </View>
            </View>
            <View>
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
    [type, computedThemeColor, intl, getMemberRole, handleChange],
  );

  return (
    <PageView style={styles.page}>
      <NavBar
        theme={computedTheme}
        title={intl.formatMessage({ id: 'AboutChat.AddModerators' })}
        style={[{ backgroundColor: '#ffffff00' }]}
        more={
          type === 'add' ? (
            <TouchableOpacity
              disabled={checkedIds?.length === 0 || loading}
              style={{ paddingVertical: pxToDp(6), paddingHorizontal: pxToDp(24) }}
              onPress={() => {
                setBotAppChatroomRole({
                  roomId: Number(roomId),
                  role: 'MODERATOR',
                  memberIds: checkedIds,
                }).then(() => {
                  setSearchKey(undefined);
                  refreshChatRoomDetail();
                  router.back();
                });
              }}>
              <Text
                style={{
                  color: checkedIds?.length > 0 ? computedThemeColor.text : computedThemeColor.text_secondary,
                  fontSize: pxToDp(32),
                }}>
                {loading ? <ActivityIndicator color={computedThemeColor.primary} /> : intl.formatMessage({ id: 'Add' })}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ paddingVertical: pxToDp(6), paddingHorizontal: pxToDp(24) }}
              activeOpacity={0.8}
              onPress={() => {
                setEdit((v) => !v);
              }}>
              <Text
                style={{
                  color: checkedIds?.length > 0 ? computedThemeColor.text : computedThemeColor.text_secondary,
                  fontSize: pxToDp(32),
                }}>
                {loading ? (
                  <ActivityIndicator color={computedThemeColor.primary} />
                ) : (
                  intl.formatMessage({ id: edit ? 'updateEmail.done' : 'Edit' })
                )}
              </Text>
            </TouchableOpacity>
          )
        }
      />
      {type === 'add' && (
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
              placeholder={intl.formatMessage({ id: 'Search' })}
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
      )}
      <View style={[styles.card, { flex: 1, marginBottom: insets.bottom, backgroundColor: 'transparent' }]}>
        {type === 'query' && (
          <TouchableOpacity
            style={[styles.cardHeader, { backgroundColor: '#1B1B22' }]}
            onPress={() => {
              router.push({
                pathname: '/main/group-chat/about/[roomId]/moderators',
                params: {
                  type: 'add',
                  roomId,
                },
              });
            }}>
            <AddSquareOutline />
            <Text style={[styles.cardSubtitle]}>{intl.formatMessage({ id: 'AboutChat.AddModerators' })}</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <SwipeListView
            useAnimatedList
            initialNumToRender={50}
            contentContainerStyle={[styles.members]}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl tintColor={computedThemeColor.primary} refreshing={refreshing} onRefresh={loadData} />
            }
            data={pageData.data}
            renderItem={({ item, index }) => renderItem(item, index === pageData.data.length - 1)}
            renderHiddenItem={({ item, index }) =>
              edit && item.memberRole !== 'OWNER' ? (
                <View style={styles.qaContainer}>
                  <View style={[styles.button]}>
                    <Pressable
                      onPress={() => {
                        show({
                          text: intl.formatMessage({ id: 'chats.item.delete.text' }),
                          okButtonProps: { loading },
                          onOk: () => {
                            setBotAppChatroomRole({
                              roomId: Number(roomId),
                              role: 'MEMBER',
                              memberIds: [item.memberId],
                            }).then(() => {
                              refreshChatRoomDetail();
                              setPageData((x) => {
                                return {
                                  ...x,
                                  data: x.data.filter((i) => i.memberId !== item.memberId),
                                };
                              });
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
                  <Pressable
                    style={[
                      styles.backRightBtn,
                      styles.backRightBtnRight,
                      index === pageData.data.length - 1 && {
                        borderBottomRightRadius: pxToDp(16),
                      },
                    ]}
                    onPress={() => {
                      show({
                        text: intl.formatMessage({ id: 'chats.item.delete.text' }),
                        okButtonProps: { loading: deleting },
                        onOk: () => {
                          deleteChatroomMembers({
                            roomId,
                            memberIds: [item.memberId],
                          }).then(() => {
                            refreshChatRoomDetail();
                            setPageData((x) => {
                              return {
                                ...x,
                                data: x.data.filter((i) => i.memberId !== item.memberId),
                              };
                            });
                          });
                        },
                      });
                    }}>
                    <Text style={styles.backTextWhite}>{intl.formatMessage({ id: 'Delete' })}</Text>
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
            rightOpenValue={edit ? -pxToDp(200) : 0}
          />
        </View>
      </View>
      {el}
    </PageView>
  );
}

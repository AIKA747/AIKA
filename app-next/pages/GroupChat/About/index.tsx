import { useRequest } from 'ahooks';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AddSquareOutline,
  ArrowRightOutline,
  CheckOutlined,
  CopyOutline,
  GalleryEditOutline,
  RadioCheckTwoTone,
  SearchOutline,
} from '@/components/Icon';
import List from '@/components/List';
import Modal, { useConfirmModal } from '@/components/Modal';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { defaultCover, SHARE_EXTERNAL_LINK_HOST } from '@/constants';
import { database } from '@/database';
import { TableName } from '@/database/schema';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import {
  deleteBotAppChatroomId,
  deleteBotAppChatroomMembers,
  putBotAppChatroomRole,
} from '@/services/guanliyuanqunliaoshezhijiekou';
import { getBotAppChatroomMembers } from '@/services/pinyin2';
import { capitalizeFirstLetterAndLowerRest } from '@/utils';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

const AboutChat = () => {
  const { computedTheme, computedThemeColor, eventEmitter } = useConfigProvider();
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { userInfo } = useAuth();
  const { el, show } = useConfirmModal({});
  const { chatRoomDetail, conversations } = useGroupChatProvider();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [copyState, setCopyState] = useState<boolean>(false);
  const [leaving, setLeaving] = useState<boolean>(false);
  const [newGroupOwner, setNewGroupOwner] = useState<string>();
  const [leaveGroupModalVisible, setLeaveGroupModalVisible] = useState<boolean>(false);
  const [deleteMsgModalVisible, setDeleteMsgModalVisible] = useState<boolean>(false);
  const { data: membersData, refresh } = useRequest(
    () =>
      getBotAppChatroomMembers({
        roomId,
        pageSize: 10,
        pageNo: 1,
        status: 'APPROVE',
        memberType: 'USER',
      }),
    {
      refreshDeps: [roomId],
      cacheKey: `room-member-${roomId}`,
    },
  );

  const { loading: deleting, runAsync: deleteChatRoom } = useRequest(deleteBotAppChatroomId, {
    manual: true,
    debounceWait: 300,
  });
  const getRussianSuffix = (n: number): string => {
    const absN = Math.abs(n);
    const lastDigit = absN % 10;
    const lastTwoDigits = absN % 100;

    // 处理 11-14 的特殊复数形式
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'участников';
    }

    switch (lastDigit) {
      case 1:
        return 'участник';
      case 2:
      case 3:
      case 4:
        return 'участника';
      default:
        return 'участников';
    }
  };

  const handleDeleteLocalChatRoomData = useCallback(
    (roomId: string) => {
      const conversation = conversations?.find((item) => `${item.conversationId}` === `${roomId}`);
      if (conversation) {
        conversation.deletedConversation();
        conversation.messages.destroyAllPermanently();
      }
      database.adapter
        .unsafeExecute({
          sqls: [
            [
              `DELETE
               FROM ${TableName.GROUP_MSGS}
               WHERE conversation_id = ?
                  OR conversation_id = ?`,
              [`${roomId}`, `-${roomId}`],
            ],
          ],
        })
        .catch((err) => console.error(err));
    },
    [conversations],
  );

  const links = [
    [
      {
        key: 'changeGroupType',
        text: intl.formatMessage({ id: 'AboutChat.Type' }),
        link: '/main/group-chat/about/[roomId]/type',
        memberRole: ['OWNER', 'MODERATOR'], // OWNER、MODERATOR、MEMBER
        paramKeys: ['groupType'],
      },
      {
        key: 'changeGroupTheme',
        text: intl.formatMessage({ id: 'AboutChat.Theme' }),
        link: '/main/group-chat/about/[roomId]/theme',
        memberRole: ['OWNER', 'MODERATOR', 'MEMBER'],
        paramKeys: ['theme'],
      },
      {
        key: 'changeGroupMedia',
        text: intl.formatMessage({ id: 'AboutChat.Media' }),
        link: '/main/group-chat/about/[roomId]/media',
        memberRole: ['OWNER', 'MODERATOR', 'MEMBER'],
      },
      {
        key: 'changeGroupMFM',
        text: intl.formatMessage({ id: 'AboutChat.FeaturedMessages' }),
        link: '/main/group-chat/about/[roomId]/featured',
        memberRole: ['OWNER', 'MODERATOR', 'MEMBER'],
      },
      {
        key: 'changeShowHis',
        text: intl.formatMessage({ id: 'AboutChat.History' }),
        link: '/main/group-chat/about/[roomId]/history',
        memberRole: ['OWNER', 'MODERATOR'],
        paramKeys: ['historyMsgVisibility'],
      },
    ],
    [
      {
        key: 'changeShowNotifications',
        text: intl.formatMessage({ id: 'AboutChat.Notifications' }),
        link: '/main/group-chat/about/[roomId]/notifications',
        memberRole: ['OWNER', 'MODERATOR', 'MEMBER'],
      },
      {
        key: 'changeShowAddModerators',
        text: intl.formatMessage({ id: 'AboutChat.AddModerators' }),
        link: '/main/group-chat/about/[roomId]/moderators',
        memberRole: ['OWNER', 'MODERATOR'],
        params: { type: 'query' },
      },
      {
        key: 'changeShowPermissions',
        text: intl.formatMessage({ id: 'AboutChat.Permissions' }),
        link: '/main/group-chat/about/[roomId]/permissions',
        memberRole: ['OWNER'],
        paramKeys: ['permissions'],
      },
      {
        key: 'changeShowAddAI',
        text: intl.formatMessage({ id: 'AboutChat.AddAI' }),
        link: '/main/group-chat/about/[roomId]/robot',
        memberRole: ['OWNER'],
      },
    ],
  ];

  const getLeaveGroupOpts = useCallback(
    () => (
      <View style={{ height: pxToDp(360) }}>
        <List
          contentContainerStyle={styles.leaveGroupModalFormContent}
          footerProps={{ noMoreText: '' }}
          request={async (_params: any) => {
            const result = await getBotAppChatroomMembers({
              roomId: chatRoomDetail?.id + '',
              pageNo: _params.pageNo,
              pageSize: _params.pageSize,
              memberRole: 'MODERATOR', // MODERATOR
              status: 'APPROVE',
            });

            return {
              data: result.data.data.list || [],
              total: result.data.data.total || 0,
            };
          }}
          renderItem={({ item, isLast }) => (
            <TouchableOpacity
              style={[styles.formItem, { borderColor: isLast ? 'transparent' : computedThemeColor.text_secondary }]}
              onPress={() => {
                if (newGroupOwner !== item.memberId) {
                  setNewGroupOwner(item.memberId);
                }
              }}>
              <View style={[styles.formItemLeft]}>
                <Image style={[styles.formItemAvatar]} source={{ uri: s3ImageTransform(item.avatar, 'small') }} />
                <Text style={{ fontSize: pxToDp(16 * 2), color: computedThemeColor.text }}>{item.nickname}</Text>
              </View>
              <RadioCheckTwoTone
                color={
                  newGroupOwner === item.memberId ? computedThemeColor.text_pink : computedThemeColor.text_secondary
                }
                twoToneColor="#fff"
                width={pxToDp(24 * 2)}
                height={pxToDp(24 * 2)}
                checked={newGroupOwner === item.memberId}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    ),
    [chatRoomDetail?.id, computedThemeColor, newGroupOwner],
  );

  const handleLeaveGroup = useCallback(() => {
    try {
      if (newGroupOwner && userInfo?.userId) {
        setLeaving(true);
        putBotAppChatroomRole({
          roomId: chatRoomDetail?.id || -1,
          role: 'OWNER',
          memberIds: [newGroupOwner],
        }).then((res) => {
          if (res.data.code === 0) {
            deleteBotAppChatroomMembers({
              roomId: chatRoomDetail?.id + '',
              memberIds: [userInfo.userId],
            }).then((res) => {
              if (res.data?.code !== 0) {
                return Toast.error(res.data?.msg || intl.formatMessage({ id: 'failed' }));
              }
              Toast.success({
                content: res.data.msg,
                onClose: () => {
                  // router.dismissAll(); // 不知为何 这个方法不能用了
                  router.back();
                  router.back();
                },
              });
              handleDeleteLocalChatRoomData(`${chatRoomDetail?.id}`);
            });
          }
        });
      }
    } finally {
      setLeaving(false);
    }
  }, [chatRoomDetail?.id, handleDeleteLocalChatRoomData, intl, newGroupOwner, userInfo?.userId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
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

  const actions = useMemo(
    () =>
      [
        {
          title: intl.formatMessage({ id: 'AboutChat.LeaveGroup' }),
          disabled: false,
          onPress: () => {
            if (chatRoomDetail?.memberRole !== 'OWNER' && userInfo?.userId) {
              deleteBotAppChatroomMembers({
                roomId: chatRoomDetail?.id + '',
                memberIds: [userInfo.userId],
              }).then((res) => {
                if (res.data?.code !== 0) {
                  return Toast.error(res.data?.msg || intl.formatMessage({ id: 'failed' }));
                }
                handleDeleteLocalChatRoomData(`${chatRoomDetail?.id}`);
                router.back();
                router.back();
              });
            } else {
              setLeaveGroupModalVisible(true);
            }
          },
        },
        {
          title: intl.formatMessage({ id: 'AboutChat.DeleteMessages' }),
          onPress: () => setDeleteMsgModalVisible(true),
          disabled: false,
        },
        {
          title: intl.formatMessage({ id: 'AboutChat.DeleteGroup' }),
          onPress: () => {
            show({
              text: intl.formatMessage({ id: 'chats.item.delete.text' }),
              okButtonProps: { loading: deleting },
              onOk: () => {
                deleteChatRoom({ id: roomId }).then((res) => {
                  if (res.data?.code !== 0) {
                    return Toast.error(res.data?.msg || intl.formatMessage({ id: 'failed' }));
                  }
                  router.back();
                  router.back();
                  handleDeleteLocalChatRoomData(`${roomId}`);
                });
              },
            });
          },
          disabled: chatRoomDetail?.memberRole !== 'OWNER',
        },
      ].filter((x) => !x.disabled),
    [
      intl,
      chatRoomDetail?.memberRole,
      chatRoomDetail?.id,
      userInfo?.userId,
      handleDeleteLocalChatRoomData,
      show,
      deleting,
      deleteChatRoom,
      roomId,
    ],
  );

  const getPermissions = useCallback(
    (key: keyof Omit<API.ChatGroupDetail['permissions'][0], 'memberRole'>) => {
      const permissions =
        chatRoomDetail?.permissions?.filter((x) => x.memberRole === chatRoomDetail.memberRole)[0]?.[key] || false;
      return chatRoomDetail?.memberRole === 'OWNER' || permissions;
    },
    [chatRoomDetail],
  );

  return (
    <PageView style={[styles.page]}>
      <View style={[styles.hero]}>
        <ImageBackground
          resizeMode="cover"
          style={[
            styles.heroBg,
            {
              paddingTop: pxToDp(48) + insets.top,
              paddingBottom: pxToDp(48),
              backgroundColor: !chatRoomDetail?.roomAvatar ? '#00000' : 'transparent',
            },
          ]}
          source={
            chatRoomDetail?.roomAvatar
              ? { uri: s3ImageTransform(chatRoomDetail?.roomAvatar || '', [750, 540]) }
              : undefined
          }
          blurRadius={20}>
          <View
            style={{
              flex: 1,
              position: 'absolute',
              width: '100%',
              backgroundColor: 'rgba(0,0,0, 0.2)',
              top: 0,
              bottom: 0,
            }}
          />
          <Image
            contentFit="cover"
            placeholderContentFit="cover"
            placeholder={defaultCover}
            source={{ uri: s3ImageTransform(chatRoomDetail?.roomAvatar || '', 'large') }}
            style={[styles.avatar]}
          />
        </ImageBackground>
      </View>
      <NavBar
        theme={computedTheme}
        position="Sticky"
        style={[{ backgroundColor: '#ffffff00' }]}
        more={
          getPermissions('changeGroupInfo') && (
            <TouchableOpacity
              style={[styles.editAvatarBtn, { top: 0 }]}
              onPress={async () => {
                router.push('/main/group-chat/about/[roomId]/modify');
              }}>
              <GalleryEditOutline style={[styles.editAvatarBtnIcon]} color={computedThemeColor.text} />
            </TouchableOpacity>
          )
        }
      />
      <ScrollView style={[styles.container]}>
        <View style={[styles.card]}>
          <View style={[styles.item]}>
            <View style={[styles.itemLabel]}>
              <Text style={[styles.itemLabelText]}>{intl.formatMessage({ id: 'AboutChat.name' })}</Text>
            </View>
            <View style={[styles.itemValue]}>
              <Text style={[styles.itemValueText, { fontSize: pxToDp(48) }]}>{chatRoomDetail?.roomName || '--'}</Text>
            </View>
          </View>
          <View style={[styles.item]}>
            <View style={[styles.itemLabel]}>
              <Text style={[styles.itemLabelText]}>{intl.formatMessage({ id: 'AboutChat.description' })}</Text>
            </View>
            <View style={[styles.itemValue]}>
              <Text style={[styles.itemValueText]} ellipsizeMode="tail" numberOfLines={10}>
                {chatRoomDetail?.description || '--'}
              </Text>
            </View>
          </View>
          <View style={[styles.item]}>
            <View style={[styles.itemLabel]}>
              <Text style={[styles.itemLabelText]}>{intl.formatMessage({ id: 'AboutChat.link' })}</Text>
            </View>
            <View style={[styles.itemValue, styles.copyItem]}>
              <Text style={[styles.itemValueText]}>
                {SHARE_EXTERNAL_LINK_HOST}/{chatRoomDetail?.roomCode}
              </Text>
              {getPermissions('linkChatToPosts') && (
                <TouchableOpacity
                  style={[styles.copyBtn]}
                  onPress={() => {
                    Clipboard.setStringAsync(
                      `https://${SHARE_EXTERNAL_LINK_HOST}/${chatRoomDetail?.roomCode}` || '',
                    ).then((res) => {
                      if (res) {
                        setCopyState(true);
                        setTimeout(() => {
                          setCopyState(false);
                        }, 2000);
                      }
                    });
                  }}>
                  {copyState ? (
                    <View style={{ width: pxToDp(48), height: pxToDp(48) }}>
                      <CheckOutlined color={computedThemeColor.text_success} width={pxToDp(48)} height={pxToDp(48)} />
                    </View>
                  ) : (
                    <CopyOutline width={pxToDp(32)} height={pxToDp(32)} color="rgba(128, 135, 142, 1)" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {links.map((items, index) => {
          const menus = items
            .filter((x) => x.memberRole.includes(chatRoomDetail?.memberRole || ''))
            .filter((x) => !['changeShowHis'].includes(x.key) || getPermissions(x.key as any));
          return (
            <View style={[styles.card]} key={`card-item-${index}`}>
              {menus.map((item, j) => (
                <TouchableOpacity
                  key={`link-item-${index}-${j}`}
                  style={[
                    styles.linkItem,
                    {
                      borderColor: j === menus.length - 1 ? 'transparent' : '#25212E',
                    },
                  ]}
                  onPress={() => {
                    const params: { [key: string]: any } = { roomId, ...(item.params || {}) };
                    for (const paramKey of item?.paramKeys || []) {
                      // @ts-ignore
                      const value = chatRoomDetail?.[paramKey];
                      if (typeof value === 'object') {
                        params[paramKey] = JSON.stringify(value);
                      } else {
                        params[paramKey] = value;
                      }
                    }
                    router.push({
                      pathname: item.link as any,
                      params,
                    });
                  }}>
                  <Text style={[styles.linkItemText]}>{item.text}</Text>
                  <ArrowRightOutline width={pxToDp(32)} height={pxToDp(32)} />
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
        <View style={[styles.card]}>
          <TouchableOpacity
            style={[styles.linkItem]}
            onPress={() => {
              router.push({
                pathname: '/main/group-chat/about/[roomId]/members',
                params: {
                  type: 'query',
                  roomId,
                },
              });
            }}>
            <Text style={[styles.linkItemText, { color: computedThemeColor.text_secondary }]}>
              {intl.locale === 'ru'
                ? `${membersData?.data?.data?.total || 0} ${getRussianSuffix(membersData?.data?.data?.total || 0)}`
                : intl.formatMessage({ id: 'AboutChat.members' }, { count: membersData?.data?.data?.total || 0 })}
            </Text>
            <SearchOutline width={pxToDp(32)} height={pxToDp(32)} color={computedThemeColor.text_secondary} />
          </TouchableOpacity>
          {getPermissions('addOtherMembers') && (
            <TouchableOpacity
              style={[styles.addItem]}
              onPress={() => {
                router.push({
                  pathname: '/main/group-chat/about/[roomId]/members',
                  params: {
                    type: 'add',
                    roomId,
                  },
                });
              }}>
              <AddSquareOutline color={computedThemeColor.text_secondary} />
              <Text style={[styles.addItemText]}>{intl.formatMessage({ id: 'AboutChat.AddMembers' })}</Text>
            </TouchableOpacity>
          )}
          <View style={[styles.moderators]}>
            {(membersData?.data?.data?.list || []).map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.memberId === userInfo?.userId) router.push('/profile');
                  else
                    router.push({
                      pathname: '/main/user-profile/[userId]',
                      params: { userId: item.memberId },
                    });
                }}
                style={[
                  styles.moderatorsItem,
                  {
                    borderColor: index === (membersData?.data?.data?.list || []).length - 1 ? 'transparent' : '#25212E',
                  },
                ]}
                key={item.id}>
                <Image
                  contentFit="cover"
                  placeholderContentFit="cover"
                  placeholder={defaultCover}
                  source={{ uri: s3ImageTransform(item.avatar, 'middle') }}
                  style={[styles.moderatorsItemAvatar]}
                />
                <View style={[styles.moderatorsItemInfo]}>
                  <View style={[styles.nameWrap]}>
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1} style={[styles.userName]}>
                        {item.nickname}
                      </Text>
                    </View>
                    <Text style={[styles.role]}>
                      {getMemberRole(capitalizeFirstLetterAndLowerRest(item.memberRole))}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.status,
                        {
                          color: item?.onlineStatus ? computedThemeColor.primary : computedThemeColor.text_secondary,
                        },
                      ]}>
                      {intl.formatMessage({
                        id: item.onlineStatus
                          ? 'AboutChat.Members.Status.Online'
                          : 'AboutChat.Members.Status.NotActive',
                      })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {(membersData?.data?.data?.total || 0) > 10 && (
              <TouchableOpacity
                style={[styles.linkItem, { paddingHorizontal: 0, borderColor: 'transparent' }]}
                onPress={() => {
                  router.push({
                    pathname: '/main/group-chat/about/[roomId]/members',
                    params: {
                      type: 'query',
                      roomId,
                    },
                  });
                }}>
                <Text style={[styles.addItemText]}>{intl.formatMessage({ id: 'AboutChat.ShowAllMembers' })}</Text>
                <ArrowRightOutline width={pxToDp(32)} height={pxToDp(32)} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={[styles.card, { marginBottom: insets.bottom + pxToDp(100) }]}>
          {actions.map((item, index) => (
            <TouchableOpacity
              key={`action-item-${index}`}
              style={[styles.linkItem, { borderColor: index === actions.length - 1 ? 'transparent' : '#25212E' }]}
              onPress={item.onPress}>
              <Text style={[styles.linkItemText, { color: computedThemeColor.text_error }]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Modal
        position="CENTER"
        maskBlur={false}
        visible={leaveGroupModalVisible}
        direction="horizontal"
        onCancel={() => {
          setNewGroupOwner(undefined);
          setLeaveGroupModalVisible(false);
        }}
        onOk={() => {
          if (newGroupOwner) {
            handleLeaveGroup();
          }
        }}
        cancelButtonProps={{
          type: 'default',
          style: {
            backgroundColor: '#4e5158',
            borderColor: '#4e5158',
          },
          textStyle: {
            color: '#8d8d90',
            fontFamily: 'ProductSansRegular',
          },
        }}
        okButtonProps={{
          loading: leaving,
          type: 'default',
          // disabled: !newGroupOwner,
          textStyle: {
            color: newGroupOwner ? '#ffffff' : '#8d8d90',
            fontFamily: 'ProductSansRegular',
          },
          style: {
            backgroundColor: newGroupOwner ? 'rgba(160, 123, 237, 1)' : '#5e4b87',
            borderColor: newGroupOwner ? 'rgba(116, 11, 254, 0.3)' : 'rgba(116, 11, 254, 0.3)',
          },
        }}>
        <View style={[styles.leaveGroupModalHeader]}>
          <View>
            <Text style={[styles.leaveGroupModalHeaderTitle]}>
              {intl.formatMessage({ id: 'AboutChat.LeaveModalTitle' })}
            </Text>
          </View>
          <View>
            <Text style={[styles.leaveGroupModalHeaderDesc]}>
              {intl.formatMessage({ id: 'AboutChat.LeaveModalDescription' })}
            </Text>
          </View>
        </View>
        <View style={{ padding: pxToDp(32) }}>{getLeaveGroupOpts()}</View>
      </Modal>
      {el}

      {/* 删除群消息 */}
      <Modal
        fullWidth
        maskBlur={false}
        position="BOTTOM"
        maskColor="transparent"
        visible={deleteMsgModalVisible}
        onClose={() => setDeleteMsgModalVisible(false)}
        title={
          <Text style={[styles.delModalTitle, { color: computedThemeColor.text }]}>
            {intl.formatMessage({ id: 'AboutChat.DeleteMessages' })}
          </Text>
        }>
        <View style={{ paddingHorizontal: pxToDp(32), paddingBottom: insets.bottom ?? pxToDp(32) }}>
          <TouchableOpacity
            onPress={async () => {
              try {
                if (!chatRoomDetail?.id) return;
                eventEmitter?.emit({ method: 'delete-messages', data: chatRoomDetail.id + '' });
                const conversation = conversations?.find((item) => `${item.conversationId}` === `${chatRoomDetail.id}`);
                if (conversation) {
                  conversation.messages.fetch().then((result) => {
                    result.map((message) => message.deleteMsg());
                  });
                }
                setDeleteMsgModalVisible(false);
              } catch (err) {
                Toast.error(intl.formatMessage({ id: 'failed' }));
              }
            }}
            activeOpacity={0.8}
            style={[styles.deleteBtn, { backgroundColor: computedThemeColor.text }]}>
            <Text style={{ fontSize: pxToDp(32), color: '#F10000' }}>
              {intl.formatMessage({ id: 'AboutChat.ClearHistory' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteMsgModalVisible(false)}
            activeOpacity={0.8}
            style={[styles.deleteBtn, { backgroundColor: computedThemeColor.text_secondary }]}>
            <Text style={{ fontSize: pxToDp(32), color: computedThemeColor.text + '80' }}>
              {intl.formatMessage({ id: 'Cancel' })}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </PageView>
  );
};

export default AboutChat;

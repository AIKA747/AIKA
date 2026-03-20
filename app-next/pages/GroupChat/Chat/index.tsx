import { withObservables } from '@nozbe/watermelondb/react';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { escapeRegExp } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/Avatar';
import Chat from '@/components/Chat';
import { ChatListRef } from '@/components/Chat/ChatList/types';
import { MessageItem } from '@/components/Chat/types';
import { ArrowLeftOutline, SearchOutline } from '@/components/Icon';
import { ListRequestParams } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { defaultCover } from '@/constants';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { GroupConversation } from '@/database/models';
import GroupMsg from '@/database/models/group-msg';
import { fetchConversationMessages, fetchConversationById, queryGroupMsgsByText } from '@/database/services';
import { useAuth } from '@/hooks/useAuth';
import { ChatModule } from '@/hooks/useChatClient';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
import { getBotAppChatroomMembers, putBotAppChatroomMemberLastTime } from '@/services/pinyin2';
import pxToDp, { deviceHeightDp, deviceWidthDp } from '@/utils/pxToDp';

import { ChatThemeType } from '../About/Theme/type';

import styles from './styles';

type SearchState = { visible: boolean; text: string; list: GroupMsg[] };

function GroupChatRoom({ conversation, messages }: { conversation: GroupConversation; messages: GroupMsg[] }) {
  const intl = useIntl();
  const { userInfo } = useAuth();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight(true);
  const { computedThemeColor: theme, eventEmitter } = useConfigProvider();
  const listRef = useRef<MessageItem[]>([]);
  const chatListRef = useRef<ChatListRef>(null);

  const createdAtRef = useRef<number>(undefined);
  const { chatRoomDetail, setChatRoomDetail, fetchChatRoomDetail, currentConversationIdRef } = useGroupChatProvider();

  // 路由栈中可能存在多个聊天，chatRoomDetail 会变，具体某个聊天应该保存一份自己的信息
  const [search, setSearch] = useState<SearchState>({ visible: false, text: '', list: [] });
  const [headerTouched, setHeaderTouched] = useState(Math.random);
  const { roomName, roomAvatar, conversationId } = useMemo(() => conversation || {}, [conversation]);
  const isPersonal = useMemo(() => conversation.roomType === 'CHAT', [conversation.roomType]);

  useEffect(() => {
    return () => {
      if (currentConversationIdRef) currentConversationIdRef.current = '-1';
      setChatRoomDetail(null);
    };
  }, [currentConversationIdRef, setChatRoomDetail]);

  useFocusEffect(
    useCallback(() => {
      if (conversationId && currentConversationIdRef) {
        currentConversationIdRef.current = conversationId;
        fetchChatRoomDetail({ val: conversationId, type: 'id' });
        // 这里同步只是为了，清除云端的删除日期，
        putBotAppChatroomMemberLastTime({ roomIds: [conversationId] as any, type: 'READ' });
      }
    }, [conversationId, currentConversationIdRef, fetchChatRoomDetail]),
  );

  const { data: memberList } = useRequest(async () => {
    const res = await getBotAppChatroomMembers({
      roomId: conversation.conversationId,
      pageSize: 10,
      status: 'APPROVE',
    });
    return res.data?.data?.list || [];
  });

  const chatUser = useMemo(
    () => (isPersonal ? memberList?.find((i) => i.memberId !== userInfo!.userId) : null),
    [isPersonal, memberList, userInfo],
  );

  const updateSearch = useCallback((v: Partial<SearchState>) => setSearch((state) => ({ ...state, ...v })), []);

  const highlightText = (text: string, keyword: string) => {
    if (!text || !keyword) return text;
    const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <Text key={index} style={{ color: theme.primary }}>
          {part}
        </Text>
      ) : (
        part
      ),
    );
  };

  const chatBgSource = useMemo(() => {
    if (chatRoomDetail?.theme?.type === ChatThemeType.Gallery) {
      return { uri: chatRoomDetail?.theme.gallery };
    }
    if (chatRoomDetail?.theme?.type === ChatThemeType.Local) {
      return Number(chatRoomDetail?.theme.gallery);
    }
    return undefined;
  }, [chatRoomDetail]);

  const chatBgColor = useMemo(() => {
    if (chatRoomDetail?.theme?.type === ChatThemeType.Color) {
      return chatRoomDetail?.theme.color;
    }
    return theme.bg_primary;
  }, [chatRoomDetail?.theme.color, chatRoomDetail?.theme?.type, theme.bg_primary]);

  return (
    <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior} style={{ flex: 1 }}>
      <PageView
        resizeMode="cover"
        resizeMethod="scale"
        source={chatBgSource}
        style={[
          {
            flex: 1,
            backgroundColor: chatBgColor,
            height: '100%',
            width: '100%',
          },
        ]}>
        <View
          style={[styles.topHeader, { paddingTop: insets.top }]}
          onTouchStart={() => setHeaderTouched(Math.random())}>
          <TouchableOpacity
            style={{ marginRight: pxToDp(16) }}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace({ pathname: '/chats' });
              }
            }}>
            <ArrowLeftOutline color={theme.text_secondary} width={pxToDp(48)} height={pxToDp(48)} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row' }}
            onPress={() =>
              isPersonal
                ? chatUser &&
                  router.push({
                    pathname: '/main/user-profile/[userId]',
                    params: { userId: chatUser.memberId },
                  })
                : router.push({
                    pathname: '/main/group-chat/about/[roomId]',
                    params: { roomId: conversation.conversationId },
                  })
            }>
            <Avatar
              size={88}
              style={{ borderRadius: pxToDp(16) }}
              img={isPersonal ? chatUser?.avatar : roomAvatar}
              placeholder={defaultCover}
            />
            <View style={styles.groupInfo}>
              <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
                {isPersonal ? chatUser?.nickname : roomName}
              </Text>
              {!isPersonal && !!memberList?.length && (
                <Text numberOfLines={1} style={[styles.member, { color: theme.text_secondary }]}>
                  {memberList.map((i) => i.nickname).join(', ')}...
                </Text>
              )}
              {isPersonal && (
                <Text numberOfLines={1} style={[styles.member, { color: theme.text_secondary }]}>
                  @{chatUser?.username}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateSearch({ visible: true })}>
            <SearchOutline height={pxToDp(40)} width={pxToDp(40)} />
          </TouchableOpacity>
        </View>
        <View style={styles.chatContainer}>
          <Chat
            ref={chatListRef}
            chatId={conversation.conversationId}
            chatModule={ChatModule.group}
            isPersonal={isPersonal}
            triggerResetSelect={headerTouched}
            onChangeList={(v) => {
              listRef.current = v;
            }}
            request={async function (params: ListRequestParams & Record<string, any>): Promise<{
              data: MessageItem[];
              total: number;
            }> {
              // createdAt 应始终固定一个值（第一次查询时的当前时间），往后翻页才不会因为新数据的插入而导致分页数据获取重复
              if (!createdAtRef.current) createdAtRef.current = new Date().getTime();
              const res = await fetchConversationMessages(
                conversation.conversationId,
                createdAtRef.current,
                params.pageNo,
                params.pageSize,
              );
              return {
                data: (res.list || []).reverse() as unknown as MessageItem[],
                total: res.total,
              };
            }}
          />
        </View>
      </PageView>

      {/* 群消息搜索 */}
      {search.visible && (
        <Animated.View
          exiting={SlideOutRight}
          entering={SlideInRight}
          style={{
            position: 'absolute',
            top: insets.top,
            width: deviceWidthDp,
            backgroundColor: theme.bg_primary,
            height: deviceHeightDp - insets.top - insets.bottom,
          }}>
          <View style={styles.searchHeader}>
            <TouchableOpacity
              style={{ marginHorizontal: pxToDp(16) }}
              onPress={() => updateSearch({ visible: false, text: '', list: [] })}>
              <ArrowLeftOutline color={theme.text_secondary} width={pxToDp(48)} height={pxToDp(48)} />
            </TouchableOpacity>
            <TextInput
              autoFocus
              value={search.text}
              onChangeText={(text) => updateSearch({ text })}
              style={[styles.textInput, { backgroundColor: theme.bg_secondary, color: theme.text }]}
              returnKeyType="search"
              placeholderTextColor={theme.text_secondary}
              placeholder={intl.formatMessage({ id: 'Search' })}
              onSubmitEditing={async () => {
                if (!search.text.trim()) return updateSearch({ list: [] });
                Keyboard.dismiss();
                updateSearch({ list: await queryGroupMsgsByText(conversation.conversationId, search.text.trim()) });
              }}
            />
            <TouchableOpacity
              disabled={!search.text.trim()}
              onPress={async () => {
                Keyboard.dismiss();
                updateSearch({ list: await queryGroupMsgsByText(conversation.conversationId, search.text.trim()) });
              }}
              style={{ opacity: search.text.trim() ? 1 : 0.4, marginRight: pxToDp(32) }}>
              <SearchOutline height={pxToDp(40)} width={pxToDp(40)} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: pxToDp(32), paddingBottom: keyboardHeight }}>
            {search.list?.map((msg) => (
              <Pressable
                key={msg.msgId}
                style={styles.searchResItem}
                onPress={() => {
                  eventEmitter?.emit({ method: 'position-message', data: msg.toJSON() as MessageItem, }); // prettier-ignore
                  updateSearch({ visible: false, text: '', list: [] });
                  // chatListRef.current?.scrollToItem({ item: msg.toJSON() as MessageItem, animated: true });
                }}>
                <Avatar img={msg.avatar} size={68} style={{ borderRadius: pxToDp(16) }} />
                <View style={[styles.searchInfo, { borderBottomColor: theme.text_secondary }]}>
                  <View style={styles.searchInfoTop}>
                    <View style={{ flexGrow: 1 }}>
                      <Text style={{ color: theme.text }}>{msg.nickname}</Text>
                    </View>
                    <View>
                      <Text style={{ color: theme.text }}>{dayjs(msg.createdAt).format('YYYY-MM-DD')}</Text>
                    </View>
                  </View>
                  <Text style={[styles.searchResText, { color: theme.text }]}>
                    {highlightText(msg.textContent!, search.text.trim())}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}

const enhance = withObservables(['conversation'], ({ conversation }) => {
  return {
    conversation,
    messages: conversation?.messages, // 自动监听关联的 messages
  };
});
const GroupChatRoomWrapper = enhance(GroupChatRoom);
const GroupChatRoomScreen = () => {
  const { computedThemeColor } = useConfigProvider();
  // id 为 聊天室 id；isPersonal 若有值，为一对一聊天
  const { roomId } = useLocalSearchParams<{ roomId: string; isPersonal?: string }>();
  const [conversation, setConversation] = useState<GroupConversation>();
  useEffect(() => {
    if (roomId) {
      fetchConversationById(roomId).then((res) => {
        setConversation(res);
      });
    }
  }, [roomId]);
  if (!conversation) {
    return (
      <PageView>
        <NavBar />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <ActivityIndicator size="large" color={computedThemeColor.primary} />
            <Text style={{ color: computedThemeColor.text_secondary, fontSize: pxToDp(30), marginTop: pxToDp(24) }}>
              loading...
            </Text>
          </View>
        </View>
      </PageView>
    );
  }

  return <GroupChatRoomWrapper conversation={conversation} />;
};
export default GroupChatRoomScreen;

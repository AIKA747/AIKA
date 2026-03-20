import { FlashList, FlashListRef } from '@shopify/flash-list';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { RootSiblingPortal } from 'react-native-root-siblings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckCircleOutline, MsgSquareCheckOutline, RestartOutline } from '@/components/Icon';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { GroupConversation } from '@/database/models';
import { markMsgsAsRead } from '@/database/services';
import { syncWithServerConversations } from '@/database/services/sync';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import ChatCard from '@/pages/Chats/components/card/chat-card';
import { deleteBotAppChatSession, putBotAppChatroomMemberLastTime } from '@/services/pinyin2';
import pxToDp from '@/utils/pxToDp';

import styles from '../../styles';

function ChatsScene(props: {
  conversations: GroupConversation[];
  filter: string;
  showMoreAction: boolean;
  selectable: boolean;
  setShowMoreAction: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectable: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor: theme } = useConfigProvider();

  const { conversations, filter, selectable, showMoreAction, setShowMoreAction, setSelectable } = props;

  const { setChatRoomDetail, setConversations, fetchChatRoomDetail, syncError } = useGroupChatProvider();

  const flashListRef = useRef<FlashListRef<GroupConversation>>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<GroupConversation[]>([]);

  useEffect(() => setSelectedList([]), [selectable]);

  useEffect(() => {
    if (conversations) {
      setConversations(conversations);
    }
    flashListRef.current?.scrollToTop({ animated: false });
  }, [conversations, setConversations]);

  useFocusEffect(
    useCallback(() => {
      setChatRoomDetail(null);
      return () => {
        setSelectable(false);
        setShowMoreAction(false);
        setDeleteModalVisible(false);
      };
    }, [setChatRoomDetail, setSelectable, setShowMoreAction]),
  );

  const handleReadAll = useCallback(
    async (ids: string[]) => {
      if (!ids.length) return;

      try {
        await markMsgsAsRead(ids);
        await putBotAppChatroomMemberLastTime({ roomIds: ids as any, type: 'READ' });
        setSelectable(false);
      } catch (err) {
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    [intl, setSelectable],
  );

  const filteredList = useMemo(() => {
    if (!filter.trim()) return conversations;
    return conversations?.filter((i) => i.roomName?.toLowerCase().includes(filter.trim().toLowerCase()));
  }, [conversations, filter]);

  if (conversations && !conversations.length) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {syncError.list && (
          <TouchableOpacity
            onPress={syncWithServerConversations}
            style={{ marginBottom: 24, alignItems: 'center', justifyContent: 'center' }}>
            <RestartOutline loading={false} />
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: pxToDp(32), color: theme.text_secondary }}>
          {intl.formatMessage({ id: 'chats.empty' })}
        </Text>
      </View>
    );
  }

  return (
    <>
      <FlashList
        ref={flashListRef}
        data={filteredList}
        keyExtractor={(item, index) => item.conversationId || index.toString()}
        ItemSeparatorComponent={() => <View style={[styles.chatBottomLine, { backgroundColor: theme.bg_secondary }]} />}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 0,
          animateAutoScrollToBottom: false,
        }}
        renderItem={({ item }) => (
          <ChatCard
            data={item}
            selectable={selectable}
            selected={selectedList?.includes(item)}
            onPress={async () => {
              if (selectable) {
                if (selectedList.includes(item)) {
                  setSelectedList((state) => state.filter((i) => i.conversationId !== item.conversationId));
                } else {
                  setSelectedList((state) => [...state, item]);
                }
                return;
              }
              if (!item.roomType) return;
              // 如果同步消息时整个获取聊天列表接口有异常, 或者当前群消息获取有异常，尝试同步一次
              if (syncError.list || syncError[item.conversationId]) await syncWithServerConversations();
              await fetchChatRoomDetail({ val: item.conversationId, type: 'id' });
              await putBotAppChatroomMemberLastTime({ roomIds: [item.conversationId] as any, type: 'LOAD' });
              await item.clearUnread(); // 清除当前会话的未读数
              router.push({
                pathname: '/main/group-chat/chat/[roomId]',
                params: { roomId: item.conversationId },
              });
            }}
          />
        )}
      />

      {/* 顶部右侧按钮更多操作 */}
      {showMoreAction && (
        <RootSiblingPortal>
          <Pressable style={styles.moreModalMask} onPress={() => setShowMoreAction(false)}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[{ top: insets.top + pxToDp(120) }, styles.moreModalContent]}>
              <TouchableOpacity
                onPress={() => {
                  setSelectable((v) => !v);
                  setShowMoreAction(false);
                }}
                style={styles.moreModalBtn}>
                <Text style={{ fontSize: pxToDp(28) }}>{intl.formatMessage({ id: 'chats.chooseChats' })}</Text>
                <CheckCircleOutline style={{ marginLeft: pxToDp(24) }} color={theme.text_secondary} />
              </TouchableOpacity>
              <View style={[{ height: pxToDp(2), backgroundColor: theme.text_secondary + '80' }]} />
              <TouchableOpacity
                onPress={() => {
                  handleReadAll(conversations?.map((i) => i.id) ?? []);
                  setShowMoreAction(false);
                }}
                style={styles.moreModalBtn}>
                <Text style={{ fontSize: pxToDp(28) }}>{intl.formatMessage({ id: 'chats.readAll' })}</Text>
                <MsgSquareCheckOutline style={{ marginLeft: pxToDp(24) }} color={theme.text_secondary} />
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </RootSiblingPortal>
      )}

      {/* 群组列表选择底部交互按钮 */}
      {selectable && (
        <RootSiblingPortal>
          <View
            style={[styles.selectBot, { backgroundColor: theme.bg_secondary, height: insets.bottom + pxToDp(104) }]}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <TouchableOpacity
                  style={{ padding: pxToDp(32) }}
                  onPress={() => {
                    setSelectedList(
                      !!selectedList?.length && selectedList.length === conversations?.length
                        ? []
                        : (conversations ?? []),
                    );
                  }}>
                  <Text style={{ fontSize: pxToDp(28), color: theme.text_secondary }}>
                    {!!selectedList?.length && selectedList?.length === conversations?.length
                      ? intl.formatMessage({ id: 'chats.UnselectAll' })
                      : intl.formatMessage({ id: 'chats.selectAll' })}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <TouchableOpacity
                  disabled={!selectedList.length}
                  style={{ padding: pxToDp(32) }}
                  onPress={() => setDeleteModalVisible(true)}>
                  <Text
                    style={{
                      fontSize: pxToDp(28),
                      color: selectedList.length ? theme.text : theme.text_secondary + '70',
                    }}>
                    {intl.formatMessage({ id: 'Delete' })}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <TouchableOpacity
                  disabled={!selectedList.length}
                  style={{ padding: pxToDp(32) }}
                  onPress={() => handleReadAll(selectedList.map((i) => i.conversationId))}>
                  <Text
                    style={{
                      fontSize: pxToDp(28),
                      color: selectedList.length ? theme.text : theme.text_secondary + '70',
                    }}>
                    {intl.formatMessage({ id: 'chats.readAll' })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RootSiblingPortal>
      )}

      {/* 删除二次确认弹窗 */}
      <Modal
        fullWidth
        maskBlur={false}
        position="BOTTOM"
        maskColor="transparent"
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title={
          <Text style={[styles.delModalTitle, { color: theme.text }]}>
            {intl.formatMessage({ id: 'chats.chooseAction' })}
          </Text>
        }>
        <View style={{ paddingHorizontal: pxToDp(32), paddingBottom: insets.bottom ?? pxToDp(32) }}>
          <TouchableOpacity
            onPress={async () => {
              try {
                const ids = selectedList.map((i) => i.conversationId);
                selectedList.map((conversation) => conversation.deletedConversation());
                setDeleteModalVisible(false);
                setSelectable(false);
                // 删除时，将消息全部都标记为已读，为了下次进入时判断有新数据则显示，否则不显示
                await putBotAppChatroomMemberLastTime({ roomIds: ids as any, type: 'READ' });
                await deleteBotAppChatSession(ids as any);
                // await syncWithServer(); // 同步数据
              } catch (err) {
                console.log('Delete Chat:', err);
                Toast.error(intl.formatMessage({ id: 'failed' }));
              }
            }}
            activeOpacity={0.8}
            style={[styles.deleteBtn, { backgroundColor: theme.text }]}>
            <Text style={{ fontSize: pxToDp(32), color: '#F10000' }}>{intl.formatMessage({ id: 'Delete' })}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteModalVisible(false)}
            activeOpacity={0.8}
            style={[styles.deleteBtn, { backgroundColor: theme.text_secondary }]}>
            <Text style={{ fontSize: pxToDp(32), color: theme.text + '80' }}>
              {intl.formatMessage({ id: 'Cancel' })}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

export default React.memo(ChatsScene);

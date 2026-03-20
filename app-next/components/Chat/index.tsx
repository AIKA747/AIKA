import { Q } from '@nozbe/watermelondb';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import * as Clipboard from 'expo-clipboard';
import { orderBy } from 'lodash';
import { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { LayoutAnimation, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import ChatList from '@/components/Chat/ChatList';
import { ActionEvent, ChatListRef } from '@/components/Chat/ChatList/types';
import FooterAction from '@/components/Chat/FooterAction';
import { useChatRequest, useClient, useMessageSend } from '@/components/Chat/hooks';
import InputArea from '@/components/Chat/InputArea';
import { InputAreaRef, InputAreaSendData } from '@/components/Chat/InputArea/types';
import RobotSelectModal from '@/components/Chat/RobotSelectModal';
import { ChatProps, ChatRefProps, ChatUiMode, MessageItem, RobotItem } from '@/components/Chat/types';
import Toast from '@/components/Toast';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { database } from '@/database';
import GroupMsg from '@/database/models/group-msg';
import { TableName } from '@/database/schema';
import { saveGroupMessages } from '@/database/services';
import { useAuth } from '@/hooks/useAuth';
import { ChatModule, ChatMsgStatus, ContentType } from '@/hooks/useChatClient';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import PayModal from '@/pages/Payments/PayModal';
import { deleteBotAppChatMsgMsgId } from '@/services/huihua';
import { getBotAppChatroomMembers } from '@/services/pinyin2';
import { postBotAppChatroomGroupChatRecordFeatured } from '@/services/qunchengyuanqunliaoshezhi';
import { putBotAppAssistantChatRecordBad } from '@/services/zhushouxiangguangongneng';

import MenuModal from './MenuModal';

const Chat = forwardRef(function ChatComponent(
  {
    chatId,
    request,
    params,
    pageSize = 100,
    chatModule,
    chatUiMode = ChatUiMode.TEXT,
    onGiftSend,
    onChangeList,
    onChapterStatus,
    dialogueTemplates,
    onGameStatus,
    isPersonal,
    botAvatar,
    onGameResult,
    test = false,
  }: ChatProps,
  ref: Ref<ChatRefProps>,
) {
  const { computedThemeColor, eventEmitter } = useConfigProvider();
  const { conversations } = useGroupChatProvider();
  const { userInfo } = useAuth();
  const intl = useIntl();
  const chatListRef = useRef<ChatListRef>(null);
  const inputAreaRef = useRef<InputAreaRef>(null);
  const loadingRef = useRef<boolean>(false);
  const pageNoRef = useRef<number>(1);
  const messagesRef = useRef<MessageItem[]>([]);
  // 断开连接时，对第一条消息标记，用于重连后判断是否有新消息未展示
  const newestMsgBeforeMqttDisconnect = useRef<MessageItem>(undefined);

  const [longPressMessagePosition, setLongPressMessagePosition] = useState<'left' | 'right'>();
  const [menuModalVisible, setMenuModalVisible] = useState<MessageItem>();
  const [menuModalPosition, setMenuModalPosition] = useState<Partial<{ x: number; y: number }>>();
  const [openRobotSelectModal, setOpenRobotSelectModal] = useState<boolean>(false);

  const [chooseTextItemId, setChooseTextItemId] = useState<string>();
  const [refreshing, setRefreshing] = useState<boolean>(false); // 刷新状态
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false);
  // 群聊回复消息交互
  const [replyMsg, setReplyMsg] = useState<MessageItem>();
  const [remindRobot, setRemindRobot] = useState<RobotItem>();
  const [lastVideoUrl, setLastVideoUri] = useState<string>('');
  // 只有助手才显示视频聊天
  const [innerChatUiMode, setInnerChatUiMode] = useState<ChatUiMode>(chatUiMode);
  const [selectedItems, setSelectedItems] = useState<MessageItem[]>([]);
  const [showSelectedBox, setShowSelectedBox] = useState<boolean>(false);
  const cacheKey = useMemo(
    () => `chat-${userInfo?.userId}-${chatModule}-${chatId}-page-${pageNoRef.current}`,
    [chatId, chatModule, userInfo?.userId],
  );
  const isGroupChat = useMemo(() => chatModule === ChatModule.group, [chatModule]);
  const digitHuman = useMemo(() => {
    return innerChatUiMode === ChatUiMode.VIDEO;
  }, [innerChatUiMode]);
  const { data, loadData, mutate, loading } = useChatRequest({ cacheKey, params, request });

  const { data: robots = [], refresh: refreshGroupChatBots } = useRequest(
    async () => {
      if (isGroupChat) {
        const resp = await getBotAppChatroomMembers({
          roomId: chatId,
          pageNo: 1,
          pageSize: 9999,
          // memberType: 'BOT',
        });
        return orderBy(resp.data.data?.list || [], 'memberType');
      }
      return [];
    },
    {
      debounceWait: 300,
      refreshDeps: [chatId, isGroupChat],
    },
  );

  const { clientStatus, handleSendMessage } = useClient({
    chatId,
    test,
    digitHuman,
    messagesRef,
    setMessages,
    chatModule,
    onChapterStatus,
    onGameStatus,
  });

  const { handleGiftSend, handleInputSend, handleUndoMessage, handleSendRegenerateMessage } = useMessageSend({
    chatId,
    messagesRef,
    test,
    digitHuman,
    setMessages,
    chatModule,
    clientStatus,
    handleSendMessage,
  });

  /**
   * 触底时是否还要加载更多。当前列表个数少于total
   */
  const hasMore = useMemo(() => {
    return !!data && messages.length < data.total;
  }, [messages, data]);

  const onLoadChatData = useCallback(
    async (isRefreshing = false) => {
      setRefreshing(true);
      pageNoRef.current = 1;
      if (isRefreshing) {
        mutate({ data: [], total: 0 });
        setMessages([]);
      }
      const resp = await loadData({ pageNo: 1, pageSize, ...params });
      setMessages(resp.data);
      setRefreshing(false);
      // chatListRef.current?.scrollToEnd({ animated: true });
    },
    [loadData, mutate, pageSize, params],
  );

  const onLoadMoreChatData = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      if (loading || !hasMore) return;
      // 获取下一页
      pageNoRef.current += 1;
      const resp = await loadData({ pageNo: pageNoRef.current, pageSize });
      setMessages((v) => [...(resp.data || []), ...(v || [])]);
    } finally {
      loadingRef.current = false;
    }
  }, [hasMore, loadData, loading, pageSize]);

  eventEmitter?.useSubscription(async (value) => {
    if (value.method === 'delete-messages' && `${value.data}` === chatId) setMessages([]);

    // mqtt-connected-and-synced 代码块在重连后，api 同步消息后执行，api 同步消息可能耗时
    // 重连后，mqtt 已可接收消息，mqtt 往列表插消息，同时也往数据库存消息
    //   1. 如果在重连前有新消息，mqtt 无法接收到，漏掉的消息只能通过 api 同步，重连后，api 才开始同步，数据库消息和列表消息肯定是不一致的
    //   2. 如果在重连前无新消息，mqtt 连接后才有新消息，api 同步并没有漏掉的消息，这时数据库消息和列表消息应该是一致的
    // 目前存在概率较低的交互体验问题，后续可通过优化区分全量同步，增量同步，以提高同步效率，并在 UI 上限制同步时用户主动性的操作导致消息列表的变化
    if (isGroupChat && value.method === 'mqtt-connected-and-synced') {
      // 如果 runLoadMessageList 还未初始查询过消息，这时不需要处理，让 runLoadMessageList 查询即可
      if (pageNoRef.current === 1) return;

      // 如果断连前列表没有消息（数据库没有消息）
      // 重连后，api 同步消息后，数据库有新消息，且和消息列表计数不一致，重新加载消息列表
      if (!newestMsgBeforeMqttDisconnect.current) {
        const dbMsgCount = await database
          .get<GroupMsg>(TableName.GROUP_MSGS)
          .query(Q.where('object_id', `${chatId}`))
          .fetchCount();
        if (dbMsgCount === messagesRef.current.length) return;

        pageNoRef.current = 1;
        onLoadChatData();
        return;
      }

      // 如果断连前列表有消息, 使用断连前第一条消息作为标记
      // 重连后通过标记消息查询数据库后面时间若有新消息存入，且和消息列表标记消息后面时间的新消息计数不一致，重新加载
      const dbNewMsgCount = await database
        .get<GroupMsg>(TableName.GROUP_MSGS)
        .query(
          Q.where('object_id', `${chatId}`),
          Q.where('created_at', Q.gt(dayjs(newestMsgBeforeMqttDisconnect.current.createdAt).toDate().getTime())),
        )
        .fetchCount();
      // 断连前消息列表中是第一个，重连后位置在哪里，前面就有多少条新消息
      const listFoundIndex = messagesRef.current.findIndex(
        (item) => item.msgId === newestMsgBeforeMqttDisconnect.current!.msgId,
      );
      if (dbNewMsgCount === listFoundIndex) return;

      pageNoRef.current = 1;
      onLoadChatData();
    }
  });

  const handleSendMsg = useCallback(
    (data: InputAreaSendData) => {
      if (replyMsg) {
        data.replyMessageId = replyMsg.msgId;
        data.replyMessage = `${replyMsg.contentType}:${replyMsg.contentType === ContentType.TEXT ? replyMsg.textContent?.slice(0, 200) : replyMsg.media}`;
        data.memberIds = replyMsg.userId;
        data.json = JSON.stringify(replyMsg);
      }
      if (isGroupChat && remindRobot && data.contentType === ContentType.TEXT) {
        data.memberIds = remindRobot.memberId;
      }
      setReplyMsg(undefined);
      setRemindRobot(undefined);
      handleInputSend(data);
      chatListRef.current?.scrollToEnd({ animated: true });
    },
    [replyMsg, remindRobot, isGroupChat, handleInputSend],
  );
  const handleRecharge = useCallback(() => {
    if (chatModule === ChatModule.bot) {
    }
    if (chatModule === ChatModule.story) {
    }
    setPayModalVisible(true);
  }, [chatModule]);

  // 删除群聊和单聊的消息
  const handleDeletedGroupChatItem = useCallback(
    async ({ listItem, listItemIndex }: { listItem: MessageItem; listItemIndex: number }) => {
      const newList = [...messagesRef.current];
      newList.splice(listItemIndex, 1);
      setMessages(newList);
      // This must be called before `LayoutAnimation.configureNext` in order for the animation to run properly.
      chatListRef.current?.prepareForLayoutAnimationRender();
      // After removing the item, we can start the animation.
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      // 群聊渲染的 item 皆为本地数据库查询的 model，可使用其 API 标记删除（不可物理删除，避免云端获取又重新插入）
      if (listItem instanceof GroupMsg) {
        await listItem.deleteMsg();
      } else if (listItem.msgId) {
        // prettier-ignore
        const result = await database.get<GroupMsg>(TableName.GROUP_MSGS).query(Q.where('msg_id', listItem.msgId!));
        await result[0]?.deleteMsg();
      }
      const conversation = conversations?.find((x) => x.id === listItem.objectId);
      if (conversation) {
        const prevListItem = newList[0];
        await conversation.updateLastMessage(prevListItem as unknown as GroupMsg, -1);
      }
    },
    [conversations, messagesRef, setMessages],
  );

  const handleAction = useCallback(
    async (e: ActionEvent) => {
      setLongPressMessagePosition(e.messagePosition);
      setChooseTextItemId(undefined);
      const listItemIndex = messagesRef.current.findIndex((x) => {
        const id = x.msgId || x.local?.clientMsgId!;
        return id === e.msgId;
      });
      const listItem = messagesRef.current[listItemIndex];
      if (!listItem) return;

      // 菜单弹窗
      if (e.type === 'menu') {
        const { pageX, pageY } = e?.nativeEvent as any;
        const rawItem = listItem instanceof GroupMsg ? (listItem.toJSON() as MessageItem) : listItem;
        setMenuModalVisible({ ...rawItem, msgId: listItem.msgId || listItem.local?.clientMsgId! });
        setMenuModalPosition({ x: pageX, y: pageY });
        return;
      }
      // 反馈
      if (e.type === 'badAnswer') {
        // TODO 只有助手聊天才有？
        if ('badAnswer' in listItem && !listItem.badAnswer) {
          await putBotAppAssistantChatRecordBad({
            msgId: e.msgId,
            badAnswer: true,
          });
        }
        if ('badAnswer' in listItem) listItem.badAnswer = true;

        return;
      }
      // 重新生成答案
      if (e.type === 'regenerate') {
        handleSendRegenerateMessage({ msgId: e.msgId });
        return;
      }
      // 撤回
      if (e.type === 'undo') {
        // 撤回消息需要修改原来消息的状态
        const _message = {
          msgId: listItem.msgId,
          msgStatus: ChatMsgStatus.RECANLLED,
        };
        saveGroupMessages([_message] as unknown as MessageItem[])
          .then((res) => {
            setMessages((v) => {
              v = v.map((i) => {
                if (i.msgId === e.msgId) {
                  i.msgStatus = ChatMsgStatus.RECANLLED;
                }
                return i;
              });
              return v;
            });
            const conversation = conversations?.find((x) => x.conversationId === listItem.objectId);
            if (conversation) {
              conversation.updateLastMessage(listItem as unknown as GroupMsg, 0);
            }
            handleUndoMessage({
              msgId: e.msgId,
            });
          })
          .catch(() => {});
        return;
      }
      // 删除
      if (e.type === 'delete') {
        if (isGroupChat) {
          await handleDeletedGroupChatItem({ listItem, listItemIndex });
          return;
        }
        // 删除此消息对应的回复消息
        await deleteBotAppChatMsgMsgId({ msgId: e.msgId });
        messagesRef.current.splice(listItemIndex, 1);
        setMessages(
          messagesRef.current.filter((msg) => {
            return msg.replyMessageId !== e.msgId;
          }),
        );
        return;
      }
      // 编辑
      if (e.type === 'edit' && listItem.contentType === ContentType.TEXT) {
        inputAreaRef.current?.setContentText(listItem.textContent || '');
        return;
      }
      // 选择文本
      if (e.type === 'chooseText' && listItem.contentType === ContentType.TEXT) {
        setChooseTextItemId(e.msgId);
        return;
      }
      // 引用
      if (e.type === 'reply') {
        setReplyMsg(listItem instanceof GroupMsg ? (listItem.toJSON() as MessageItem) : listItem);
      }
      // 复制
      if (e.type === 'copy' && listItem.contentType === ContentType.TEXT) {
        await Clipboard.setStringAsync(listItem.textContent || '');
        return;
      }
      // 添加收藏
      if (e.type === 'addToFavorites') {
        let fileProperty = { length: undefined, fileName: undefined };
        try {
          fileProperty = JSON.parse(listItem.fileProperty ?? '');
        } catch (err) {}
        const params = {
          uid: listItem.userId as unknown as number,
          st: 'user',
          avatar: listItem.avatar ?? '',
          nn: listItem.nickname!,
          txt: listItem.textContent,
          med: listItem.media,
          flength: fileProperty.length,
          fn: fileProperty.fileName,
          time: listItem.createdAt,
          roomId: listItem.objectId,
          mid: listItem.msgId || '',
          ct: listItem.contentType,
        };
        postBotAppChatroomGroupChatRecordFeatured(params as any)
          .then((res) => {
            if (res.data?.code !== 0) throw res;
            Toast.success(intl.formatMessage({ id: 'succeed' }));
          })
          .catch(() => Toast.error(intl.formatMessage({ id: 'failed' })));
      }
      // 群聊选择消息item
      if (e.type === 'selected') {
        setShowSelectedBox(true);
        setSelectedItems((v) => [...v, listItem]);
      }
    },
    [handleSendRegenerateMessage, conversations, handleUndoMessage, isGroupChat, handleDeletedGroupChatItem, intl],
  );

  useEffect(() => {
    onLoadChatData();
  }, [onLoadChatData]);

  useEffect(() => {
    messagesRef.current = messages || [];
    onChangeList?.(messages);
  }, [messages, onChangeList]);

  useImperativeHandle(ref, () => {
    return {
      scrollToEnd: (params) => chatListRef.current?.scrollToEnd(params),
      scrollToItem: (params) => chatListRef.current?.scrollToItem(params),
      scrollToItemAndHighlight: (params) => chatListRef.current?.scrollToItemAndHighlight(params),
      scrollToIndex: async (params) => chatListRef.current?.scrollToIndex(params),
      scrollToTop: (params) => chatListRef.current?.scrollToTop(params),
      scrollToOffset: (params) => chatListRef.current?.scrollToOffset(params),
      prepareForLayoutAnimationRender: () => chatListRef.current?.prepareForLayoutAnimationRender(),
      getFirstItemOffset: () => chatListRef.current?.getFirstItemOffset() || 0,
      getFirstVisibleIndex: () => chatListRef.current?.getFirstVisibleIndex() ?? -1,
    };
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'transparent' }}
      keyboardVerticalOffset={100}
      behavior={KeyboardAvoidingViewBehavior}>
      <ChatList
        ref={chatListRef}
        list={messages}
        refreshing={refreshing}
        onLoad={({ elapsedTimeInMs }) => {
          console.log('Sample List load time', elapsedTimeInMs);
        }}
        selectedItem={selectedItems}
        onSelectedItem={setSelectedItems}
        showSelectedBox={showSelectedBox}
        chatModule={chatModule}
        chooseTextItemId={chooseTextItemId}
        lastVideoUrl={lastVideoUrl}
        onAction={handleAction}
        moreLoading={loadingRef.current}
        botAvatar={botAvatar}
        userAvatar={userInfo?.avatar}
        onRecharge={handleRecharge}
        onGameResult={onGameResult}
        onLoadMoreChatData={onLoadMoreChatData}
        onCancelChooseTextItem={() => {
          setChooseTextItemId(undefined);
        }}
        onUpdateCacheData={setMessages}
      />
      <View onTouchStart={() => setChooseTextItemId(undefined)}>
        <InputArea
          clientStatus={clientStatus}
          ref={inputAreaRef}
          chatModule={chatModule}
          replyMsg={replyMsg}
          isPersonal={!!isPersonal}
          onOpenRobotSelectModal={() => {
            setOpenRobotSelectModal(robots?.length > 0);
          }}
          onClearRemindRobot={() => {
            setRemindRobot(undefined);
          }}
          onClearReplyMsg={() => setReplyMsg(undefined)}
          onGiftSend={() => {
            onGiftSend?.(handleGiftSend);
          }}
          onSend={handleSendMsg}
          isTyping={false}
        />

        {showSelectedBox && (
          <View
            style={{
              position: 'absolute',
              flex: 1,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: computedThemeColor.bg_secondary,
            }}>
            <FooterAction
              selectedItems={selectedItems}
              onDelete={async (item) => {
                const messagePosition = userInfo?.userId !== item.userId ? 'left' : 'right';
                const msgId = item.msgId || item.local?.clientMsgId!;
                await handleAction({ type: 'delete', msgId, messagePosition });
              }}
              onReplyMessage={async (item) => {
                const messagePosition = userInfo?.userId !== item.userId ? 'left' : 'right';
                const msgId = item.msgId || item.local?.clientMsgId!;
                await handleAction({ type: 'reply', msgId, messagePosition });
                setSelectedItems([]);
                setShowSelectedBox(false);
              }}
              onClose={() => {
                setShowSelectedBox(false);
                setSelectedItems([]);
              }}
            />
          </View>
        )}
      </View>
      <PayModal
        from="chat"
        chatModule={chatModule}
        visible={payModalVisible}
        onClose={async () => {
          setPayModalVisible(false);
        }}
      />
      <MenuModal
        chatModule={chatModule}
        visible={!!menuModalVisible}
        listItem={menuModalVisible}
        onAction={handleAction}
        position={menuModalPosition as any}
        messagePosition={longPressMessagePosition}
        onClose={() => {
          setMenuModalVisible(undefined);
        }}
        handleInputSend={handleInputSend}
      />
      <RobotSelectModal
        visible={openRobotSelectModal}
        robots={robots.filter((x) => x.memberId !== userInfo?.userId)}
        onClose={setOpenRobotSelectModal}
        onRemindSend={(v) => {
          setRemindRobot(v);
          inputAreaRef.current?.setContentText((text: string) => `${text}${v?.username} `);
        }}
      />
    </KeyboardAvoidingView>
  );
});

export default Chat;

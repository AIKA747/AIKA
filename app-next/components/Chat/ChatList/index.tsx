import { FlashList, FlashListRef } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { ForwardedRef, forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';

import MessageItemContent from '@/components/Chat/ChatList/MessageContentItem';
import { ChatListProps, ChatListRef } from '@/components/Chat/ChatList/types';
import { messagesStylesLeft, messagesStylesRight } from '@/components/Chat/styles';
import { MessageItem, SourceType } from '@/components/Chat/types';
import DotLoading from '@/components/DotLoading';
import { useAuth } from '@/hooks/useAuth';
import { ChatModule, ChatMsgStatus, ContentType } from '@/hooks/useChatClient';
import { useConfigProvider } from '@/hooks/useConfig';
import { formatDateTime } from '@/utils/formatDateTime';
import pxToDp from '@/utils/pxToDp';

const ChatList = forwardRef(function ChatListContent(props: ChatListProps, ref: ForwardedRef<ChatListRef>) {
  const {
    list,
    onLoad,
    moreLoading,
    refreshing,
    onLoadMoreChatData,
    chatModule,
    userAvatar,
    botAvatar,
    onRecharge,
    onAction,
    onCancelChooseTextItem,
    chooseTextItemId,
    onGameResult,
    lastVideoUrl,
    onUpdateCacheData,
    selectedItem,
    onSelectedItem,
    showSelectedBox,
  } = props;
  const { userInfo } = useAuth();
  const { computedThemeColor, eventEmitter } = useConfigProvider();
  const intl = useIntl();

  const flashListRef = useRef<FlashListRef<MessageItem>>(null);
  const itemLayouts = useRef<Record<string, number>>({});
  const scrollTargetRef = useRef<MessageItem>(null);

  // 高亮的消息
  const [highlightMsg, setHighlightMsg] = useState<MessageItem>();
  const [swipeableOpenId, setSwipeableOpenId] = useState<string>();

  const isGroupChat = useMemo(() => chatModule === ChatModule.group, [chatModule]);

  const lastVideoMsgId = useMemo(() => {
    const lastItem = [...list].reverse().find((x) => x.videoUrl && x.videoStatus === 'success' && x.digitHuman);
    return lastItem?.msgId;
  }, [list]);

  const judgeMessageTyping = useCallback(
    (message: MessageItem) => {
      return (
        // 视频生成中
        (message.videoStatus && [ChatMsgStatus.CREATED, ChatMsgStatus.PROCESSING].includes(message.videoStatus)) ||
        // 视频下载中
        (lastVideoMsgId && lastVideoMsgId === message.msgId && !lastVideoUrl) ||
        // CREATED PROCESSING 处理中
        (message.msgStatus && [ChatMsgStatus.CREATED, ChatMsgStatus.PROCESSING].includes(message.msgStatus))
      );
    },
    [lastVideoUrl, lastVideoMsgId],
  );

  const handleHighlight = useCallback(
    ({ item, index }: { item?: MessageItem; index?: number }) => {
      if (index && !isEmpty(index)) {
        const scrollItem = list[index];
        setHighlightMsg(scrollItem);
      }
      if (!isEmpty(item)) {
        setHighlightMsg(item);
      }
    },
    [list],
  );

  const handleReplyMsgPress = useCallback(
    async (item: MessageItem) => {
      scrollTargetRef.current = item;
      handleHighlight({ item });
      flashListRef.current?.prepareForLayoutAnimationRender();
      // 异步滚动（等待下一帧）
      requestAnimationFrame(() => {
        flashListRef.current?.scrollToIndex({
          index: list.findIndex((x) => x.msgId === item.msgId),
          animated: true,
          viewPosition: 0.5, // 可选：0=顶部, 1=底部, 0.5=居中
        });
      });
    },
    [handleHighlight, list],
  );

  const maintainVisibleContentPositionConfig = useMemo(
    () => ({
      autoscrollToBottomThreshold: 0.5,
      animateAutoScrollToBottom: true,
      startRenderingFromBottom: false,
    }),
    [],
  );

  useImperativeHandle(ref, () => {
    return {
      scrollToEnd: (params) => flashListRef.current?.scrollToEnd(params),
      scrollToItem: (params) => {
        handleHighlight({ item: params?.item });
        flashListRef.current?.scrollToItem(params);
      },
      scrollToItemAndHighlight: (params) => {
        console.log('params?.item', params.item);
        handleReplyMsgPress(params.item);
      },
      scrollToIndex: async (params) => {
        handleHighlight({ index: params?.index });
        flashListRef.current?.scrollToIndex(params);
      },
      scrollToTop: (params) => flashListRef.current?.scrollToTop(params),
      scrollToOffset: (params) => flashListRef.current?.scrollToOffset(params),
      prepareForLayoutAnimationRender: () => flashListRef.current?.prepareForLayoutAnimationRender(),
      getFirstItemOffset: () => flashListRef.current?.getFirstItemOffset() || 0,
      getFirstVisibleIndex: () => flashListRef.current?.getFirstVisibleIndex() ?? -1,
    };
  });

  eventEmitter?.useSubscription((value) => {
    if (value.method !== 'position-message') return;
    scrollTargetRef.current = value.data;
    handleReplyMsgPress(value.data);
  });

  return (
    <FlashList
      ref={flashListRef}
      style={{ flex: 1 }}
      data={list}
      onLoad={(info) => {
        flashListRef.current?.scrollToEnd({ animated: false });
        onLoad?.(info);
      }}
      refreshing={refreshing}
      // maxItemsInRecyclePool={0}
      onStartReached={onLoadMoreChatData}
      onStartReachedThreshold={10}
      optimizeItemArrangement={true}
      keyExtractor={(item, index) => item.msgId || index.toString()}
      maintainVisibleContentPosition={maintainVisibleContentPositionConfig}
      ListHeaderComponent={() =>
        moreLoading ? (
          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: pxToDp(32) }}>
            <DotLoading />
          </View>
        ) : null
      }
      onLayout={() => {
        flashListRef.current?.scrollToEnd({ animated: false });
      }}
      renderItem={({ item: message, index }: { item: MessageItem; index: number }) => {
        const messagePosition = isGroupChat
          ? userInfo?.userId !== message.userId
            ? 'left'
            : 'right'
          : message.sourceType !== SourceType.user
            ? 'left'
            : 'right';
        const styles = {
          left: messagesStylesLeft,
          right: messagesStylesRight,
        }[messagePosition];

        const id = message.msgId || message.local?.clientMsgId!;
        const neReplyTime = list[index + 1]?.createdAt;
        // 每天间隔显示一次日期
        const showTime = !neReplyTime || !dayjs(message.createdAt).isSame(dayjs(neReplyTime), 'day');
        // 系统消息
        if (message.contentType === ContentType.recharge) {
          return (
            <Text
              style={[styles.messageSystemTips]}
              onPress={() => {
                onRecharge?.();
              }}>
              {intl.formatMessage({ id: 'bot.chat.limit.tips' })}
              <Text style={[styles.messageSystemTipsImportant]}>
                {' '}
                {intl.formatMessage({ id: 'bot.chat.limit.recharge' })}
              </Text>
              .
            </Text>
          );
        }
        if (message.contentType === ContentType.memberChange) {
          const item = JSON.parse(message.json || '{}');
          return (
            <View
              style={{ paddingHorizontal: pxToDp(24) }}
              onLayout={(e) => (itemLayouts.current[id] = e.nativeEvent.layout.height)}>
              <Text
                style={{
                  fontSize: pxToDp(24),
                  textAlign: 'center',
                  color: computedThemeColor.text_secondary,
                  marginVertical: pxToDp(36),
                }}>
                {intl.formatMessage(
                  {
                    id: item.type === 'leave' ? 'AboutChat.LeaveGroup.msg' : 'AboutChat.JoinGroup.msg',
                  },
                  { name: item.nickname || item.username || '' },
                )}
              </Text>
            </View>
          );
        }
        if (message.msgStatus === ChatMsgStatus.RECANLLED) {
          return (
            <View
              style={{
                padding: pxToDp(24),
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onLayout={(e) => (itemLayouts.current[id] = e.nativeEvent.layout.height)}>
              <Text style={{ color: computedThemeColor.text_secondary }}>
                {intl.formatMessage(
                  { id: 'AboutChat.Undo.msg' },
                  {
                    name: message.userId === userInfo?.userId ? intl.formatMessage({ id: 'You' }) : message.nickname,
                  },
                )}
              </Text>
              {/* issue: aika/app#482 */}
              {/*{message.contentType === ContentType.TEXT && message.userId === userInfo?.userId && (*/}
              {/*  <Pressable*/}
              {/*    style={{ marginLeft: pxToDp(14) }}*/}
              {/*    onPress={() => {*/}
              {/*      onAction({ type: 'edit', msgId: id, messagePosition });*/}
              {/*    }}>*/}
              {/*    <Text style={{ color: computedThemeColor.primary }}>{intl.formatMessage({ id: 'ReEdit' })}</Text>*/}
              {/*  </Pressable>*/}
              {/*)}*/}
            </View>
          );
        }
        return (
          <View onLayout={(e) => (itemLayouts.current[id] = e.nativeEvent.layout.height)}>
            {showTime && (
              <View style={[styles.messageSystemMonth, { marginBottom: pxToDp(16) }]}>
                <View style={[styles.messageSystemMonthInner]}>
                  <Text style={[styles.messageSystemMonthText]}>{formatDateTime(message.createdAt)}</Text>
                </View>
              </View>
            )}
            <MessageItemContent
              messageId={id}
              swipeableOpenId={swipeableOpenId}
              botAvatar={botAvatar}
              userAvatar={userAvatar}
              chatModule={chatModule}
              message={message}
              highlightMsg={highlightMsg}
              onAction={onAction}
              onReplyMsg={handleReplyMsgPress}
              chooseTextItemId={chooseTextItemId}
              onCancelChooseTextItem={onCancelChooseTextItem}
              onJudgeMessageTyping={judgeMessageTyping}
              onGameStatus={onGameResult}
              onUpdateCacheData={onUpdateCacheData}
              onSwipeable={setSwipeableOpenId}
              selectedItem={selectedItem}
              onSelectedItem={onSelectedItem}
              showSelectedBox={showSelectedBox}
              clearHighlightMsg={() => {
                setHighlightMsg(undefined);
              }}
            />
          </View>
        );
      }}
    />
  );
});

export default ChatList;

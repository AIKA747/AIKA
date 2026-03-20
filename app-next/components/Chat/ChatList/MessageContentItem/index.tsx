import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics/src/Haptics.types';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { TouchableOpacity, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { PressableEvent } from 'react-native-gesture-handler/src/components/Pressable/PressableProps';
import Reanimated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import Avatar from '@/components/Avatar';
import MessageContextBot from '@/components/Chat/ChatList/MessageContextBot';
import MessageContextGift from '@/components/Chat/ChatList/MessageContextGift';
import MessageContextImage from '@/components/Chat/ChatList/MessageContextImage';
import MessageContextMD from '@/components/Chat/ChatList/MessageContextMD';
import MessageContextStory from '@/components/Chat/ChatList/MessageContextStory';
import MessageContextText from '@/components/Chat/ChatList/MessageContextText';
import MessageContextTyping from '@/components/Chat/ChatList/MessageContextTyping';
import MessageContextVideo from '@/components/Chat/ChatList/MessageContextVideo';
import MessageContextVoice from '@/components/Chat/ChatList/MessageContextVoice';
import { ArrowsActionReplyOutline, InfoCircleOutline, LoadingOutline, RadioCheckTwoTone } from '@/components/Icon';
import Toast from '@/components/Toast';
import { defaultCover } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { ChatModule, ChatMsgStatus, ContentType } from '@/hooks/useChatClient';
import { useConfigProvider } from '@/hooks/useConfig';
import { GameResult } from '@/pages/Games/Result/types';
import { processTextPartFn } from '@/utils/formatChat';
import pxToDp from '@/utils/pxToDp';

import { ChatUiMode, MessageItem, SourceType } from '../../types';
import MessageContentTask from '../MessageContentTask';
import MessageContextGameResult from '../MessageContextGameResult';
import styles, { messagesStylesLeft, messagesStylesRight } from '../styles';
import { ActionEvent } from '../types';

function LeftAction({
  dragAnimatedValue,
  onPress,
}: {
  progressAnimatedValue: SharedValue<number>;
  dragAnimatedValue: SharedValue<number>;
  swipeable: SwipeableMethods;
  onPress?: null | ((event: PressableEvent) => void);
}) {
  const { computedThemeColor } = useConfigProvider();
  const actionItemWidth = useSharedValue(pxToDp(80));
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: dragAnimatedValue.value - actionItemWidth.value }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <View style={styles.leftAction}>
        <Pressable
          onPress={onPress}
          style={[styles.leftActionBtn, { backgroundColor: computedThemeColor.bg_secondary }]}>
          <ArrowsActionReplyOutline color={computedThemeColor.text_white} width={pxToDp(48)} height={pxToDp(48)} />
        </Pressable>
      </View>
    </Reanimated.View>
  );
}
export default function MessageItemContent({
  messageId,
  swipeableOpenId,
  botAvatar,
  userAvatar,
  chatModule,
  message,
  highlightMsg,
  onAction,
  onReplyMsg,
  chooseTextItemId,
  onJudgeMessageTyping,
  onCancelChooseTextItem,
  onUpdateCacheData,
  onGameStatus,
  onSwipeable,
  selectedItem = [],
  onSelectedItem,
  showSelectedBox,
  clearHighlightMsg,
}: {
  messageId: string;
  botAvatar?: string;
  userAvatar?: string;
  chatModule: ChatModule;
  message: MessageItem;
  highlightMsg?: MessageItem;
  onAction: (e: ActionEvent) => void;
  onJudgeMessageTyping: (item: MessageItem) => boolean;
  onReplyMsg: (item: MessageItem) => Promise<void>;
  chooseTextItemId?: string;
  onCancelChooseTextItem?: () => void;
  onUpdateCacheData?: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  onGameStatus?: (gameResult: GameResult) => void;
  showSelectedBox?: boolean;
  selectedItem?: MessageItem[];
  onSelectedItem?: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  swipeableOpenId?: string;
  onSwipeable?: (id?: string) => void;
  clearHighlightMsg?: () => void;
}) {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const { userInfo } = useAuth();
  const height = useSharedValue(0);
  const highlightAnim = useSharedValue(0);
  const reanimatedRef = useRef<SwipeableMethods>(null);
  const isGroupChat = useMemo(() => chatModule === ChatModule.group, [chatModule]);
  const messagePosition = useMemo(
    () =>
      isGroupChat
        ? userInfo?.userId !== message.userId
          ? 'left'
          : 'right'
        : message.sourceType !== SourceType.user
          ? 'left'
          : 'right',
    [isGroupChat, message, userInfo],
  );
  const styles = useMemo(
    () =>
      ({
        left: messagesStylesLeft,
        right: messagesStylesRight,
      })[messagePosition],
    [messagePosition],
  );

  const checkBoxStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const getItemCheckbox = useCallback(() => {
    if (!showSelectedBox) {
      return null;
    }
    return (
      <Reanimated.View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'flex-start',
          },
          checkBoxStyle,
        ]}>
        <Pressable
          style={{ padding: pxToDp(10) }}
          onPress={() => {
            onSelectedItem?.(function (v = []) {
              const index = selectedItem?.findIndex((x) => x.msgId === messageId || x.local?.clientMsgId === messageId);
              if (index > -1) {
                const list = [...v];
                list.splice(index, 1);
                return list;
              }
              return [...v, message];
            });
          }}>
          <RadioCheckTwoTone
            color={
              selectedItem?.findIndex((x) => x.msgId === messageId || x.local?.clientMsgId === messageId) > -1
                ? computedThemeColor.text_pink
                : computedThemeColor.text_secondary
            }
            twoToneColor="#fff"
            width={pxToDp(24 * 2)}
            height={pxToDp(24 * 2)}
            checked={selectedItem?.findIndex((x) => x.msgId === messageId || x.local?.clientMsgId === messageId) > -1}
          />
        </Pressable>
      </Reanimated.View>
    );
  }, [showSelectedBox, checkBoxStyle, selectedItem, computedThemeColor, onSelectedItem, message, messageId]);

  useEffect(() => {
    if (swipeableOpenId && swipeableOpenId !== messageId) {
      reanimatedRef.current?.close();
    }
  }, [swipeableOpenId, messageId]);

  useEffect(() => {
    if (highlightMsg && highlightMsg.msgId === message.msgId) {
      const triggerHaptic = (type: ImpactFeedbackStyle) => {
        Haptics.impactAsync(type);
        clearHighlightMsg?.();
      };
      highlightAnim.value = withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 500 }, (finished) => {
          if (finished) {
            scheduleOnRN(triggerHaptic, ImpactFeedbackStyle.Light);
          }
        }),
      );
    } else {
      // 使用 withTiming 确保平滑过渡回初始状态
      highlightAnim.value = withTiming(0, { duration: 150 });
    }
  }, [clearHighlightMsg, highlightAnim, highlightMsg, message.msgId]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(highlightAnim.value, [0, 1], ['transparent', computedThemeColor.primary + 60]),
    };
  });

  const getMessageItemInnerContent = useCallback(
    () => (
      <Reanimated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[
          styles.messagesItem,
          { marginTop: 0 },
          animatedStyle,
          message.contentType === ContentType.task ? { marginLeft: pxToDp(104) } : {},
        ]}>
        {getItemCheckbox()}
        {(message.sourceType !== SourceType.user || (isGroupChat && message.userId !== userInfo?.userId)) &&
        message.contentType !== ContentType.task ? (
          <TouchableOpacity
            disabled={showSelectedBox}
            activeOpacity={1}
            onPress={() => {
              if (message.sourceType === SourceType.user || message.sourceType === SourceType.post) {
                router.push({
                  pathname: '/main/user-profile/[userId]',
                  params: { userId: message.userId! },
                });
              } else if (message.sourceType === SourceType.bot) {
                router.push({
                  pathname: '/main/botDetail',
                  params: { botId: message.userId },
                });
              }
            }}>
            <Avatar
              placeholder={defaultCover}
              img={message.avatar || botAvatar}
              style={[isGroupChat ? styles.groupAvatar : styles.messagesAvatar] as any}
            />
          </TouchableOpacity>
        ) : undefined}
        <TouchableOpacity
          disabled={showSelectedBox}
          style={[
            styles.messagesContent,
            {
              flex: 1,
              alignItems: messagePosition === 'left' ? 'flex-start' : 'flex-end',
            },
          ]}
          activeOpacity={1}
          delayLongPress={600} // 设置长按时长
          onPress={() => {
            onCancelChooseTextItem?.();
            if (message.contentType === ContentType.TEXT) {
              processTextPartFn(message.textContent || '');
            }
          }}
          onLongPress={(e) => {
            // 如果当前消息正在选择文本交互，长按不触发菜单
            if (messageId === chooseTextItemId) return;
            if ([ContentType.TEXT, ContentType.IMAGE].includes(message.contentType)) {
              onAction({ ...e, type: 'menu', msgId: messageId, messagePosition });
            }
          }}>
          <View
            style={[
              styles.messagesContentComponent,
              {
                width: message.contentType === ContentType.md ? '82.5%' : undefined,
                // backgroundColor: 'red',
              },
            ]}>
            {(() => {
              if (onJudgeMessageTyping(message)) {
                return <MessageContextTyping messageItem={message} chatUiMode={ChatUiMode.TEXT} />;
              }

              // FAIL 出错
              if (message.msgStatus && [ChatMsgStatus.FAIL].includes(message.msgStatus)) {
                // return FAIL
              }
              // SUCCESS 成功 正常渲染
              return (
                <>
                  {message.contentType === ContentType.task && (
                    <MessageContentTask onUpdateCacheData={onUpdateCacheData} messageItem={message} />
                  )}
                  {message.contentType === ContentType.gameResult && (
                    <MessageContextGameResult
                      messageItem={message}
                      messagePosition={messagePosition}
                      onGameStatus={onGameStatus}
                    />
                  )}
                  {message.contentType === ContentType.md && (
                    <MessageContextMD messageItem={message} messagePosition={messagePosition} />
                  )}
                  {message.contentType === ContentType.botRecommend && (
                    <MessageContextBot messageItem={message} messagePosition={messagePosition} />
                  )}
                  {message.contentType === ContentType.storyRecommend && (
                    <MessageContextStory messageItem={message} messagePosition={messagePosition} />
                  )}
                  {message.contentType === ContentType.gift && (
                    <MessageContextGift messageItem={message} messagePosition={messagePosition} />
                  )}
                  {message.contentType === ContentType.TEXT && (
                    <MessageContextText
                      chatModule={chatModule}
                      chooseTextItemId={chooseTextItemId === message.msgId ? chooseTextItemId : undefined}
                      messageItem={message}
                      messagePosition={messagePosition}
                      onReplyMsgPress={onReplyMsg}
                      disabled={showSelectedBox}
                      onLongPress={
                        message.replyMessageId
                          ? (e) => onAction({ ...e, type: 'menu', msgId: messageId, messagePosition }) // prettier-ignore
                          : undefined
                      }
                    />
                  )}
                  {message.contentType === ContentType.VOICE && (
                    <MessageContextVoice
                      messageItem={message}
                      messagePosition={messagePosition}
                      disabled={showSelectedBox}
                      onLongPress={(e) => {
                        if (isGroupChat && !showSelectedBox) {
                          onAction({ ...e, type: 'menu', msgId: messageId, messagePosition });
                        }
                      }}
                    />
                  )}
                  {message.contentType === ContentType.IMAGE && (
                    <MessageContextImage
                      chatModule={chatModule}
                      messageItem={message}
                      disabled={showSelectedBox}
                      messagePosition={messagePosition}
                      onLongPress={(e) => {
                        onAction({ ...e, type: 'menu', msgId: messageId, messagePosition });
                      }}
                    />
                  )}
                  {message.contentType === ContentType.VIDEO && (
                    <MessageContextVideo messageItem={message} messagePosition={messagePosition} />
                  )}
                </>
              );
            })()}

            {/* 消息状态 'DONE' | 'FAIL' | 'SENDING' */}
            {message.local && (
              <View style={[styles.messagesContentStatus]}>
                {message.local.status === 'SENDING' && (
                  <LoadingOutline width={pxToDp(30)} height={pxToDp(30)} color="#fff" />
                )}
                {message.local.status === 'FAIL' && (
                  <InfoCircleOutline
                    color="#C92E2E"
                    width={pxToDp(30)}
                    height={pxToDp(30)}
                    onPress={() => {
                      // onAction({ type: 'edit', msgId: id });
                      Toast.error(message.local?.errorMsg || intl.formatMessage({ id: 'failed' }));
                    }}
                  />
                )}
              </View>
            )}
          </View>
          {/* 屏蔽发送时间 */}
          {/* <View style={[styles.messagesContentComponentTime]}>
                  <Text
                    style={[
                      styles.messagesContentComponentTimeText,
                      {
                        color: computedThemeColor.text,
                      },
                    ]}
                  >
                    <MessageSendTime messageItem={message} />
                  </Text>
                </View> */}
        </TouchableOpacity>

        {!isGroupChat && message.sourceType === SourceType.user ? (
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.messagesAvatar,
              {
                marginRight: pxToDp(0),
                marginLeft: pxToDp(24),
              },
            ]}
            onPress={() => {
              if (message.userId === userInfo?.userId) {
                router.push('/profile');
              }
            }}>
            <Avatar img={userAvatar} placeholder={defaultCover} />
          </TouchableOpacity>
        ) : undefined}
      </Reanimated.View>
    ),
    [
      styles.messagesItem,
      styles.groupAvatar,
      styles.messagesAvatar,
      styles.messagesContent,
      styles.messagesContentComponent,
      styles.messagesContentStatus,
      animatedStyle,
      message,
      getItemCheckbox,
      isGroupChat,
      userInfo?.userId,
      showSelectedBox,
      botAvatar,
      messagePosition,
      userAvatar,
      height,
      onCancelChooseTextItem,
      chooseTextItemId,
      onAction,
      messageId,
      onJudgeMessageTyping,
      onUpdateCacheData,
      onGameStatus,
      chatModule,
      onReplyMsg,
      intl,
    ],
  );

  if (!isGroupChat || showSelectedBox) {
    return getMessageItemInnerContent();
  }

  return (
    <ReanimatedSwipeable
      ref={reanimatedRef}
      enableTrackpadTwoFingerGesture
      renderLeftActions={(progressAnimatedValue, dragAnimatedValue, swipeable) => (
        <LeftAction
          progressAnimatedValue={progressAnimatedValue}
          dragAnimatedValue={dragAnimatedValue}
          swipeable={swipeable}
          onPress={() => {
            reanimatedRef.current?.close();
            onAction({ type: 'reply', msgId: messageId, messagePosition });
          }}
        />
      )}
      friction={2}
      leftThreshold={80}
      onSwipeableOpenStartDrag={() => {
        onSwipeable?.(messageId);
      }}
      onSwipeableClose={() => {
        onSwipeable?.(undefined);
      }}>
      {getMessageItemInnerContent()}
    </ReanimatedSwipeable>
  );
}

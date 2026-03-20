import { useCallback, useEffect, useMemo, useRef } from 'react';

import { getEmptyHttpMessage, mqttMessageToHttpMessage } from '@/components/Chat/utils';
import { GroupMsg } from '@/database/models';
import { saveGroupMessages } from '@/database/services';
import { useAuth } from '@/hooks/useAuth';
import {
  BaseMessageDTO,
  ChatMessageBO,
  ChatModule,
  ChatMsgStatus,
  ContentType,
  ImageMessageBO,
  MsgType,
  ResponseMessageBO,
  useChatClientProvider,
  UserType,
} from '@/hooks/useChatClient';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { getItem } from '@/hooks/useStorageState/utils';
import { putBotAppChatroomMemberLastTime } from '@/services/pinyin2';

import { MessageItem, SourceType } from '../types';

import { ClientProps, HandleSendMessageParams, MessageCallback } from './types';

export default function useClient(props: ClientProps) {
  const { chatId, messagesRef, setMessages, chatModule, onChapterStatus, onGameStatus, test } = props;
  const { conversations } = useGroupChatProvider();
  const { client, clientStatus } = useChatClientProvider();
  const { token, userInfo } = useAuth();
  // 用于识别是哪次订阅 userType-userId-chatModule-botId
  const sessionId = useMemo(
    () => `APPUSER-${userInfo?.userId}-${chatModule}-${chatId}`,
    [chatModule, chatId, userInfo?.userId],
  );

  /**
   * 消息发出后未收到回复的超时时间
   */
  const timeout = 10;

  // mqtt 消息事件分发
  const messageCallbackListRef = useRef<MessageCallback[]>([]);
  const addMessageCallback = (item: MessageCallback) => {
    const list = messageCallbackListRef.current;
    list.push(item);
  };
  const getMessageCallback = (clientMsgId: string) => {
    const list = messageCallbackListRef.current;
    return list.filter((x) => x.clientMsgId === clientMsgId);
  };
  const removeMessageCallback = (item: MessageCallback) => {
    const list = messageCallbackListRef.current;
    const index = list.findIndex((x) => x === item);
    if (index !== -1) {
      list.splice(index, 1);
    }
  };

  const getMessageById = useCallback(
    (clientMsgId: string) => {
      return messagesRef.current.find((x) => x.local?.clientMsgId === clientMsgId);
    },
    [messagesRef],
  );

  /**
   * 处理当前聊天对象的消息到达
   */
  const handleCurrentChatMsgArrived = useCallback(
    async (msg: MessageItem) => {
      const conversation = conversations?.find((x) => x.conversationId === msg.objectId);
      if (conversation) {
        await conversation.updateLastMessage(msg as unknown as GroupMsg, 0);
      }
      msg.isRead = true;
      msg.conversationId = msg.objectId;
      await saveGroupMessages([msg]);
      await putBotAppChatroomMemberLastTime({ roomIds: [msg.objectId] as any, type: 'READ' });
    },
    [conversations],
  );

  // 创建mqtt连接
  useEffect(() => {
    if (!userInfo || !token) return;

    const onMessageArrivedCallback = async (data: BaseMessageDTO<MsgType>) => {
      console.log('======================= onMessageArrivedCallback =======================');
      // console.log('PahoMQTT', 'onMessageArrived', JSON.stringify(data, null, 2));
      // 除了收到RESP_MSG，每条消息都要回复一个RESP_MSG
      if (data.msgType !== MsgType.RESP_MSG) {
        const message: BaseMessageDTO<MsgType.RESP_MSG> = {
          chatModule,
          msgType: MsgType.RESP_MSG,
          msgData: {
            msgId: data.msgData.msgId,
            code: 0,
            msg: 'ok',
          },
          clientMsgId: data.clientMsgId,
          sessionId: data.sessionId,
          test: data.test,
          locale: data.locale,
        };
        client?.sendMessage(message);
      }

      // IMAGE_RESP 转发成 CHAT_MSG
      if (data.msgType === MsgType.IMAGE_RESP) {
        const msgData = data.msgData as ImageMessageBO;

        // 查找消息 是否已经存在
        const item = messagesRef.current.find((x) => {
          return x.msgId === msgData.msgId;
        });
        // 如果不存在，就出bug了
        if (!item) return;
        const newMsgData: ChatMessageBO = {
          objectId: item.objectId!,
          userId: item.userId!,
          userType: UserType.APPUSER,
          contentType: item.contentType,
          json: item.json!,
          textContent: item.textContent!,
          msgId: item.msgId!,
          sourceType: item.sourceType,
          createdAt: item.createdAt!,
          digitHuman: item.digitHuman!,
          replyMessageId: item.replyMessageId,
          replyMessage: item.replyMessage,
          media: msgData.imageUrl,
          fileProperty: JSON.parse(item.fileProperty || '{}'),
          msgStatus: {
            IN_PROGRESS: ChatMsgStatus.PROCESSING,
            FAILURE: ChatMsgStatus.FAIL,
            SUCCESS: ChatMsgStatus.SUCCESS,
          }[msgData.status],
          avatar: item.avatar,
          nickname: item.nickname,
          forwardInfo: item.forwardInfo,
        };

        data.msgType = MsgType.CHAT_MSG;
        data.msgData = newMsgData;
      }

      const messageCallbackList = getMessageCallback(data.clientMsgId);
      if (messageCallbackList.length !== 0) {
        messageCallbackList.forEach((messageCallback) => {
          messageCallback.callback(data);
        });
        return;
      }

      if (data.msgType === MsgType.CHAT_MSG) {
        const msgData = data.msgData as ChatMessageBO;

        if (`${chatId}` !== `${msgData.objectId}`) return;
        // 仅处理当前聊天对象的消息列表等状态更新

        if (msgData.chapterStatus && msgData.chapterProcess) {
          onChapterStatus?.(msgData.chapterStatus, msgData.chapterProcess);
        }
        if (msgData.gameStatus) {
          onGameStatus?.(msgData.gameStatus);
        }

        const newItem = mqttMessageToHttpMessage(msgData);
        // console.log('PahoMQTT', 'onMessageArrived newItem', JSON.stringify(newItem, null, 2));

        // 查找消息 是否已经存在
        const item = messagesRef.current.find((x) => {
          return x.msgId === msgData.msgId;
        });

        if (chatModule === ChatModule.group && newItem.msgId) {
          await handleCurrentChatMsgArrived(newItem);
        }

        // 存在就更新，否则插入
        if (item) {
          Object.assign(item, newItem);
        } else {
          messagesRef.current.push(newItem);
        }
        setMessages([...messagesRef.current]);
        return;
      }
      console.log('onMessageArrived 未处理', data.clientMsgId, data.msgType);
    };

    client?.addMessageListener(onMessageArrivedCallback);

    return () => {
      messageCallbackListRef.current = [];
      client?.removeMessageListener(onMessageArrivedCallback);
    };
  }, [
    chatId,
    timeout,
    test,
    userInfo,
    token,
    chatModule,
    client,
    setMessages,
    onChapterStatus,
    onGameStatus,
    messagesRef,
    handleCurrentChatMsgArrived,
  ]);

  const handleSendMessage = useCallback(
    async function <T extends MsgType.CHAT_MSG>(params: HandleSendMessageParams<T>) {
      const CommunicationStyleKey = `expert-chat-${chatId}.CommunicationStyle`;
      const communicationStyleIndex = await getItem<number>(CommunicationStyleKey);

      // 'ExpertChat.more.CommunicationStyle.Neutral': 'Neutral and Informative',
      // 'ExpertChat.more.CommunicationStyle.Supportive': 'Supportive and Encouraging',
      // 'ExpertChat.more.CommunicationStyle.Light': 'Neutral and Informative',

      const communicationStyle =
        communicationStyleIndex !== null ? ['Neutral', 'Supportive', 'Light'][communicationStyleIndex] || '' : '';

      const message: BaseMessageDTO<T> = {
        ...params,
        communicationStyle,
        sessionId,
      };

      if (!client) return;
      // console.log('PahoMQTT', 'send', JSON.stringify(message, null, 2));

      // 标记是否超时,如果有RESP_MSG，会改成false,
      let isTimeout = true;

      const messageCallback: MessageCallback = {
        clientMsgId: message.clientMsgId,
        callback: (e) => {
          const data = e as BaseMessageDTO<MsgType.RESP_MSG | MsgType.IMAGE_RESP>;
          // 确认是否是本次响应

          if (data.msgType !== MsgType.RESP_MSG) return;
          if (data.clientMsgId + '' !== message.clientMsgId + '') return;
          isTimeout = false;

          if (data.msgType === MsgType.RESP_MSG) {
            const msgData = data.msgData as ResponseMessageBO;
            // 服务端返回失败
            if (msgData.code !== 0) {
              // 弹窗显示错误消息
              // Toast.error(msgData.msg);

              const listItem = getMessageById(message.clientMsgId);
              if (listItem?.local) {
                listItem.local.errorMsg = msgData.msg;
                listItem.local.status = 'FAIL';
              }
              setMessages([...messagesRef.current]);

              if (msgData.code === 1001) {
                // 额外需要添加一个充值消息
                setMessages([
                  ...messagesRef.current,
                  {
                    ...getEmptyHttpMessage(),
                    contentType: ContentType.recharge,
                    sourceType: {
                      bot: SourceType.bot,
                      assistant: SourceType.assistant,
                      story: SourceType.story,
                      game: SourceType.game,
                      post: SourceType.post,
                      group: SourceType.group,
                      heartbeat: SourceType.heartbeat,
                    }[chatModule],

                    textContent: msgData.msg,

                    local: {
                      clientMsgId: Date.now() + '',
                      status: 'DONE',
                    },
                  },
                ]);
              }

              return;
            }
          }

          const listItem = getMessageById(message.clientMsgId);
          if (listItem?.local) {
            listItem.msgId = data.msgData.msgId;
            listItem.local.status = 'DONE';
          }
          setMessages([...messagesRef.current]);

          if (chatModule === ChatModule.group && listItem?.msgId) {
            handleCurrentChatMsgArrived(listItem);
          }

          removeMessageCallback(messageCallback);
        },
      };

      // 超时失败
      setTimeout(() => {
        if (isTimeout) {
          const listItem = getMessageById(message.clientMsgId);
          if (listItem?.local) {
            listItem.local.status = 'FAIL';
          }
          setMessages([...messagesRef.current]);
          removeMessageCallback(messageCallback);
        }
      }, timeout * 1000);
      addMessageCallback(messageCallback);
      await client.sendMessage(message);
    },
    [chatId, sessionId, client, getMessageById, setMessages, messagesRef, chatModule, handleCurrentChatMsgArrived],
  );

  return { clientStatus, handleSendMessage };
}

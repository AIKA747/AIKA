import { Image } from 'expo-image';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { MessageItem, SourceType } from '@/components/Chat/types';
import Toast from '@/components/Toast';
import { useAuth } from '@/hooks/useAuth';
import { ChatMsgRegenerateBO, ChatMsgUndoBO, ContentType, MsgType, UserType } from '@/hooks/useChatClient';
import { Gift } from '@/pages/StoryChat/GiftModal/types';
import { getUserPublicVideoConvertResult } from '@/services/tongyongjiekou';
import getLocales from '@/utils/getLocales';
import s3ImageTransform from '@/utils/s3ImageTransform';
import uploadAsync from '@/utils/uploadAsync';

import { InputAreaSendData } from '../InputArea/types';
import { getEmptyHttpMessage, httpMessageToMqttMessage } from '../utils';

import { MessageSendProps } from './types';

export default function ({
  chatId,
  messagesRef,
  setMessages,
  chatModule,
  test,
  digitHuman,
  clientStatus,
  handleSendMessage,
}: MessageSendProps) {
  const { userInfo } = useAuth();
  const intl = useIntl();

  const handleListSet = useCallback(
    (listItem: MessageItem) => {
      setMessages([...messagesRef.current, listItem]);
    },
    [messagesRef, setMessages],
  );

  const handleInputSend = useCallback(
    async (data: InputAreaSendData) => {
      try {
        if (clientStatus !== 'Connected') {
          Toast.info('Session not connected, please refresh manually');
          return;
        }
        // 用于识别是哪次请求
        const clientMsgId = Date.now() + '';
        const emptyHttpMessage = getEmptyHttpMessage();
        if (emptyHttpMessage.local) {
          emptyHttpMessage.local.clientMsgId = clientMsgId;
        }

        const locales = getLocales();
        const languageCode = locales?.languageCode || 'en';

        // 转换成list数据
        if (data.contentType === ContentType.TEXT) {
          // 直接发送不做处理
          const listItem: MessageItem = {
            ...emptyHttpMessage,
            conversationId: chatId,
            objectId: chatId,
            userId: userInfo?.userId!,
            avatar: userInfo?.avatar,
            nickname: userInfo?.nickname,
            contentType: data.contentType,
            textContent: data.text,
            replyMessage: data.replyMessage,
            replyMessageId: data.replyMessageId,
            json: data.json,
            forwardInfo: data.forwardInfo ? JSON.stringify(data.forwardInfo) : undefined,
          };
          handleListSet(listItem);

          handleSendMessage({
            chatModule,
            msgType: MsgType.CHAT_MSG,
            msgData: {
              ...httpMessageToMqttMessage(listItem),
              userType: UserType.APPUSER,
              memberIds: data?.memberIds || '',
              digitHuman,
            },
            clientMsgId,
            test,
            locale: languageCode,
          });
        }

        // 语音消息
        if (data.contentType === ContentType.VOICE) {
          const listItem: MessageItem = {
            ...emptyHttpMessage,
            conversationId: chatId,
            objectId: chatId,
            userId: userInfo?.userId!,
            avatar: userInfo?.avatar,
            nickname: userInfo?.nickname,
            contentType: data.contentType,
            textContent: `[${data.contentType}]`,
            fileProperty: JSON.stringify({
              length: data.length,
              fileName: data.fileUrl,
            }),
            replyMessage: data.replyMessage,
            replyMessageId: data.replyMessageId,
            json: data.json,
            forwardInfo: data.forwardInfo ? JSON.stringify(data.forwardInfo) : undefined,
          };
          handleListSet(listItem);

          // TODO： 上传时离开会话界面 提醒消息丢失
          try {
            const s3Url = await uploadAsync({ fileUrl: data.fileUrl });
            if (!s3Url || typeof s3Url !== 'string') throw s3Url;
            listItem.media = s3Url;
          } catch {
            // 转换失败或者上传是失败
            // const msg = "Can't convert voice to text"; ???
            const msg = intl.formatMessage({ id: 'failed' });
            Toast.error(msg);
            if (listItem?.local) {
              listItem.local.errorMsg = msg;
              listItem.local.status = 'FAIL';
            }
            // setMessages([...listRef.current]);
            return;
          }
          handleSendMessage({
            chatModule,
            msgType: MsgType.CHAT_MSG,
            msgData: {
              ...httpMessageToMqttMessage(listItem),
              userType: UserType.APPUSER,
              digitHuman,
            },
            clientMsgId,
            test,
            locale: languageCode,
          });
        }
        // 图片消息
        if (data.contentType === ContentType.IMAGE) {
          const listItem: MessageItem = {
            ...emptyHttpMessage,
            conversationId: chatId,
            objectId: chatId,
            userId: userInfo?.userId!,
            avatar: userInfo?.avatar,
            nickname: userInfo?.nickname,
            contentType: data.contentType,
            textContent: `[${data.contentType}]`,
            fileProperty: JSON.stringify(data.rawData),
            media: data.fileUrl,
            replyMessage: data.replyMessage,
            replyMessageId: data.replyMessageId,
            json: data.json,
            forwardInfo: data.forwardInfo ? JSON.stringify(data.forwardInfo) : undefined,
          };

          handleListSet(listItem);

          if (data.fileUrl.startsWith('http')) {
            // 如果 data.fileUrl 是 http 开头图片，是转发的消息，可直接发送
            // 但存在一个问题，下面又在 setList，且同步 setList 了，不清楚之前这里的影响，异步一下兼容之前
            await new Promise((resolve) => setTimeout(resolve, 100));
          } else {
            try {
              const s3Url = await uploadAsync({ fileUrl: data.fileUrl });
              if (!s3Url || typeof s3Url !== 'string') throw s3Url;
              listItem.media = s3Url;
              // await downloadCacheFile({
              //   httpUrl: s3Url,
              //   localUrl: data.fileUrl,
              // });
              Image.loadAsync(s3ImageTransform(s3Url, 'small')).catch(() => {});
            } catch {
              const msg = intl.formatMessage({ id: 'failed' });
              Toast.error(msg);
              if (listItem?.local) {
                listItem.local.errorMsg = msg;
                listItem.local.status = 'FAIL';
              }
              // setMessages([...listRef.current]);
              return;
            }
          }

          // setMessages([...listRef.current]);
          handleSendMessage({
            chatModule,
            msgType: MsgType.CHAT_MSG,
            msgData: {
              ...httpMessageToMqttMessage(listItem),
              userType: UserType.APPUSER,
              digitHuman,
            },
            clientMsgId,
            test,
            locale: languageCode,
          });
        }
        // 视频消息
        if (data.contentType === ContentType.VIDEO) {
          const listItem: MessageItem = {
            ...emptyHttpMessage,
            conversationId: chatId,
            objectId: chatId,
            userId: userInfo?.userId!,
            avatar: userInfo?.avatar,
            nickname: userInfo?.nickname,
            contentType: data.contentType,
            textContent: `[${data.contentType}]`,
            fileProperty: JSON.stringify(data.rawData),
            media: data.fileUrl,
            replyMessage: data.replyMessage,
            replyMessageId: data.replyMessageId,
            json: data.json,
            forwardInfo: data.forwardInfo ? JSON.stringify(data.forwardInfo) : undefined,
          };
          handleListSet(listItem);

          if (data.fileUrl.startsWith('http')) {
            // 如果 data.fileUrl 是 http 开头图片，是转发的消息，可直接发送
            // 但存在一个问题，下面又在 setList，且同步 setList 了，不清楚之前这里的影响，异步一下兼容之前
            await new Promise((resolve) => setTimeout(resolve, 100));
          } else {
            try {
              const s3Url = await uploadAsync({ fileUrl: data.fileUrl });
              if (!s3Url || typeof s3Url !== 'string') throw s3Url;
              const res = await getUserPublicVideoConvertResult({ videoUrl: s3Url });
              listItem.media = s3Url;
              if (res.data.data.status === 'COMPLETE') {
                console.log('压缩后的视频链接：', res.data.data.videoUrl);
                listItem.media = res.data.data.videoUrl;
              }
            } catch {
              const msg = intl.formatMessage({ id: 'failed' });
              Toast.error(msg);
              if (listItem?.local) {
                listItem.local.errorMsg = msg;
                listItem.local.status = 'FAIL';
              }
              // setMessages([...listRef.current]);
              return;
            }
          }

          // setMessages([...listRef.current]);

          handleSendMessage({
            chatModule,
            msgType: MsgType.CHAT_MSG,
            msgData: {
              ...httpMessageToMqttMessage(listItem),
              userType: UserType.APPUSER,
              digitHuman,
            },
            clientMsgId,
            test,
            locale: languageCode,
          });
        }
      } catch (e) {
        console.log('handleInputSend error:', e);
      }
    },
    [
      clientStatus,
      chatId,
      userInfo?.userId,
      userInfo?.avatar,
      userInfo?.nickname,
      handleListSet,
      handleSendMessage,
      chatModule,
      digitHuman,
      test,
      intl,
    ],
  );

  /**
   * 发送礼物消息
   */
  const handleGiftSend = useCallback(
    (gift: Gift) => {
      const clientMsgId = Date.now() + '';
      if (clientStatus !== 'Connected') {
        Toast.info(intl.formatMessage({ id: 'bot.chat.not.connected' }));
        return;
      }
      const emptyHttpMessage = getEmptyHttpMessage();
      if (emptyHttpMessage.local) {
        emptyHttpMessage.local.clientMsgId = clientMsgId;
      }

      const locales = getLocales();
      const languageCode = locales?.languageCode || 'en';

      const listItem: MessageItem = {
        ...emptyHttpMessage,
        objectId: chatId,
        userId: userInfo?.userId!,
        contentType: ContentType.gift,
        json: JSON.stringify(gift),
      };
      handleListSet(listItem);
      handleSendMessage({
        chatModule,
        msgType: MsgType.CHAT_MSG,
        msgData: {
          ...httpMessageToMqttMessage(listItem),
          userType: UserType.APPUSER,
          digitHuman,
        },
        clientMsgId,
        test,
        locale: languageCode,
      });
    },
    [clientStatus, chatId, userInfo?.userId, handleListSet, handleSendMessage, chatModule, digitHuman, test, intl],
  );

  /**
   * 重新生成消息
   */
  const handleSendRegenerateMessage = useCallback(
    function (params: ChatMsgRegenerateBO) {
      if (clientStatus !== 'Connected') {
        Toast.info(intl.formatMessage({ id: 'bot.chat.not.connected' }));
        return;
      }

      const clientMsgId = Date.now() + '';
      const locales = getLocales();
      const languageCode = locales?.languageCode || 'en';
      handleSendMessage({
        chatModule,
        msgType: MsgType.CHAT_MSG_REGENERATE as any,
        msgData: {
          objectId: '',
          userId: '',
          userType: UserType.ADMINUSER,
          contentType: ContentType.TEXT,
          json: '',
          media: '',
          textContent: '',
          digitHuman: digitHuman,
          createdAt: '',
          sourceType: SourceType.user,
          ...params,
        },
        clientMsgId,
        test,
        locale: languageCode,
      });
    },
    [chatModule, clientStatus, digitHuman, handleSendMessage, intl, test],
  );

  /**
   * 撤回消息
   */
  const handleUndoMessage = useCallback(
    (params: ChatMsgUndoBO) => {
      if (clientStatus !== 'Connected') {
        Toast.info(intl.formatMessage({ id: 'bot.chat.not.connected' }));
        return;
      }

      const locales = getLocales();
      const languageCode = locales?.languageCode || 'en';
      handleSendMessage({
        chatModule,
        msgType: MsgType.CHAT_MSG,
        msgData: {
          ...params,
          objectId: '',
          userId: '',
          userType: UserType.ADMINUSER,
          contentType: ContentType.TEXT,
          json: '',
          media: '',
          textContent: '',
          digitHuman: digitHuman,
          createdAt: '',
          sourceType: SourceType.user,
        },
        clientMsgId: params.msgId,
        test,
        locale: languageCode,
      });
    },
    [chatModule, clientStatus, digitHuman, handleSendMessage, intl, test],
  );

  return { handleGiftSend, handleInputSend, handleSendRegenerateMessage, handleUndoMessage };
}

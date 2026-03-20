import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView } from 'react-native';

import { ForwardInfo, InputAreaSendData } from '@/components/Chat/InputArea/types';
import Modal from '@/components/Modal';
import { GroupConversation, GroupMsg } from '@/database/models';
import { createConversation, saveGroupMessages } from '@/database/services';
import { useAuth } from '@/hooks/useAuth';
import {
  BaseMessageDTO,
  ChatModule,
  ContentType,
  MsgType,
  useChatClientProvider,
  UserType,
} from '@/hooks/useChatClient';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import ChatCard from '@/pages/Chats/components/card/chat-card';
import getLocales from '@/utils/getLocales';

import { MessageItem, SourceType } from '../types';

type ForwardModalProps = {
  message: MessageItem | null | undefined;
  onClose: () => void;
  handleInputSend: (data: InputAreaSendData) => void;
};

function ForwardModal(props: ForwardModalProps) {
  const { message, onClose } = props;
  const intl = useIntl();

  const { userInfo } = useAuth();
  const { chatRoomDetail, conversations, fetchChatRoomDetail } = useGroupChatProvider();

  const { client } = useChatClientProvider();

  const handlePress = useCallback(
    (chat: API.ChatListVO) => {
      if (!message) return;

      const ifForwardToCurrentChat =
        chat.roomType === 'CHAT' && chatRoomDetail?.roomType === 'CHAT' // 当前聊天为一对一私聊且转发到当前聊天
          ? chatRoomDetail?.creator === chat.creator && chatRoomDetail?.updater === chat.updater
          : `${chatRoomDetail?.id}` === `${chat.id}`;

      const forwardInfo: ForwardInfo = {
        chatId: chat.id,
        type: SourceType.user,
        userId: message?.userId || '',
        username: message.username || '',
        nickname: message.nickname || '',
        avatar: message.avatar || '',
        sourceMsgId: message.msgId || '',
      };
      // 若是转发到当前聊天，视为直接发消息 --- ！！！！！ 目前仅可转发文本内容
      if (ifForwardToCurrentChat) {
        if (message.contentType === ContentType.TEXT) {
          props.handleInputSend({
            contentType: ContentType.TEXT,
            text: message.textContent!,
            forwardInfo,
          });
        } else if (message.contentType === ContentType.IMAGE) {
          props.handleInputSend({
            contentType: ContentType.IMAGE,
            fileUrl: message.media!,
            forwardInfo,
          });
        }
      } else {
        const now = new Date();
        const locales = getLocales();
        const languageCode = locales?.languageCode || 'en';

        let fileProperty: { fileName: undefined; length: undefined } | undefined = undefined;
        try {
          fileProperty =
            typeof message.fileProperty === 'object' ? message.fileProperty : JSON.parse(message.fileProperty || '');
        } catch (e) {
          console.log('e:', e);
        }

        const msg: BaseMessageDTO<MsgType.CHAT_MSG> = {
          chatModule: ChatModule.group,
          clientMsgId: now.getTime() + '',
          locale: languageCode,
          msgData: {
            contentType: message.contentType!,
            createdAt: now.toISOString(),
            digitHuman: false,
            fileProperty: undefined,
            json: '',
            media: message.media || '',
            msgId: message.msgId || '',
            objectId: `${chat.id}`,
            replyMessageId: '',
            sourceType: SourceType.user,
            textContent: message.textContent || '',
            userType: UserType.APPUSER,
            userId: userInfo?.userId!,
            avatar: userInfo?.avatar,
            nickname: userInfo?.nickname,
            forwardInfo: JSON.stringify(forwardInfo),
          },
          msgType: MsgType.CHAT_MSG,
          sessionId: `APPUSER${userInfo?.userId!}-group-${chat.id}`,
          test: false,
        };
        let filePropertyStr: string | undefined = undefined;
        if (fileProperty) {
          msg.msgData.fileProperty = fileProperty;
          filePropertyStr = JSON.stringify(fileProperty);
        }

        const msgCb = (data: BaseMessageDTO<MsgType>) => {
          if (`${data.clientMsgId}` !== `${now.getTime()}`) return;
          client?.removeMessageListener(msgCb);

          const cloudMsg = {
            ...msg.msgData,
            fileProperty: filePropertyStr,
            groupConversationId: `${chat.id}`,
            msgId: data.msgData.msgId,
            isRead: true,
          };
          saveGroupMessages([cloudMsg] as unknown as MessageItem[]).then(async () => {
            const conversation = conversations?.find((x) => x.conversationId === `${cloudMsg?.objectId}`);
            if (conversation) {
              await conversation.updateLastMessage(message as unknown as GroupMsg, 0);
            } else {
              // 新增会话
              await createConversation({
                ...chat,
                conversationId: `${cloudMsg.objectId}`,
                roomType: chat.roomType,
                creator: chat.creator,
                updater: chat.updater,
                lastMessageTime: cloudMsg.createdAt,
                lastMessage: message as unknown as GroupMsg,
              } as unknown as GroupConversation);
            }
            await fetchChatRoomDetail({ val: chat.id, type: 'id' });
            router.dismissTo({
              pathname: '/main/group-chat/chat/[roomId]',
              params: { roomId: chat.id, isPersonal: chat.roomType === 'CHAT' ? 'true' : undefined },
            });
          });
        };
        client?.addMessageListener(msgCb);
        client?.sendMessage(msg);
      }
      onClose();
    },
    [
      chatRoomDetail?.creator,
      chatRoomDetail?.id,
      chatRoomDetail?.roomType,
      chatRoomDetail?.updater,
      client,
      fetchChatRoomDetail,
      message,
      onClose,
      props,
      conversations,
      userInfo?.avatar,
      userInfo?.nickname,
      userInfo?.userId,
    ],
  );

  return (
    <Modal
      visible={!!message}
      onClose={onClose}
      title={intl.formatMessage({ id: 'chats.forwardMessage' })}
      position="BOTTOM">
      <ScrollView>
        {conversations?.map((chat) => (
          <ChatCard
            key={chat.id}
            showMessage={false}
            data={chat}
            onPress={() => handlePress(chat as unknown as API.ChatListVO)}
          />
        ))}
      </ScrollView>
    </Modal>
  );
}

export default ForwardModal;

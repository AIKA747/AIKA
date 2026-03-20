import dayjs from 'dayjs';

import { MessageItem, SourceType } from '@/components/Chat/types';
import { ChatMessageBO, ContentType, UserType } from '@/hooks/useChatClient/types';

export function mqttMessageToHttpMessage(mqttMessage: ChatMessageBO): MessageItem {
  return {
    msgId: mqttMessage.msgId,
    objectId: mqttMessage.objectId,
    conversationId: mqttMessage.objectId,
    userId: mqttMessage.userId,
    avatar: mqttMessage.avatar,
    userType: mqttMessage.userType,
    replyMessageId: mqttMessage.replyMessageId,
    replyMessage: mqttMessage.replyMessage,
    contentType: mqttMessage.contentType,
    fileProperty: mqttMessage.fileProperty ? JSON.stringify(mqttMessage.fileProperty) : undefined,
    media: mqttMessage.media,
    readFlag: true,
    readTime: dayjs().toISOString(),
    sourceType: mqttMessage.sourceType,
    textContent: mqttMessage.textContent,
    createdAt: mqttMessage.createdAt,
    json: mqttMessage.json,
    msgStatus: mqttMessage.msgStatus,
    digitHuman: mqttMessage.digitHuman,
    nickname: mqttMessage.nickname,
    username: mqttMessage.username,
    videoStatus: mqttMessage.videoStatus,
    videoUrl: mqttMessage.videoUrl,
    chapterStatus: mqttMessage.chapterStatus,
    chapterProcess: mqttMessage.chapterProcess,
    gameStatus: mqttMessage.gameStatus,
  };
}

export function httpMessageToMqttMessage(httpMessage: MessageItem): ChatMessageBO {
  const fileProperty = httpMessage.fileProperty ? JSON.parse(httpMessage.fileProperty) : undefined;
  return {
    objectId: httpMessage.objectId || '',
    conversationId: httpMessage.objectId || '',
    userId: httpMessage.userId || '',
    userType: UserType.APPUSER,
    contentType: httpMessage.contentType,

    json: httpMessage.json || '',
    media: httpMessage.media || '',
    textContent: httpMessage.textContent || '',
    fileProperty,

    msgId: httpMessage.msgId || '',
    replyMessageId: httpMessage.replyMessageId,
    replyMessage: httpMessage.replyMessage,
    sourceType: SourceType.user,
    digitHuman: false,
    createdAt: dayjs().toISOString(),
    // local: {
    //   clientMsgId,
    //   status: 'SENDING',
    // },
  } as any;
}

export function getEmptyHttpMessage(): MessageItem {
  return {
    msgId: undefined,
    objectId: undefined,
    conversationId: undefined,
    userId: undefined,
    replyMessageId: undefined,
    contentType: ContentType.TEXT,
    fileProperty: undefined,
    media: undefined,
    readFlag: true,
    readTime: dayjs().toISOString(),
    sourceType: SourceType.user,
    textContent: undefined,
    createdAt: dayjs().toISOString(),
    json: undefined,
    msgStatus: undefined,
    local: {
      clientMsgId: '',
      status: 'SENDING',
    },
  };
}

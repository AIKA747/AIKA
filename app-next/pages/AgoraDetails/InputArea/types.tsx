import React from 'react';

export interface FileProperty {
  length?: number;
  fileName?: string;
}
export enum ContentType {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  IMAGE = 'IMAGE',
}
// 公共转发信息类型定义
export type ForwardInfo = {
  /**
   * 转发的聊天ID
   */
  chatId: string;

  /**
   * 发送消息用户的类型
   */
  type: 'bot' | 'user';

  /**
   * 用户ID或机器人ID
   */
  userId: string;

  /**
   * 转发的用户名
   */
  username: string;

  /**
   * 转发的用户昵称
   */
  nickname: string;

  /**
   * 转发的用户头像
   */
  avatar: string;

  /**
   * 转发的源消息ID
   */
  sourceMsgId: string;
};

// 公共可选字段类型
export type CommonMessageFields = {
  /**
   * 回复消息内容
   */
  replyMessage?: string;

  /**
   * 回复消息ID
   */
  replyMessageId?: string;

  /**
   * 自定义JSON数据
   */
  json?: string;

  /**
   * 消息转发信息对象
   */
  forwardInfo?: string | ForwardInfo;

  /**
   * @的群成员ID，多个使用逗号分隔
   */
  memberIds?: string;
};

// 文本消息类型
export type TextMessage = CommonMessageFields & {
  contentType: ContentType.TEXT;
  /**
   * 文本内容
   */
  text: string;
};

// 语音消息类型
export type VoiceMessage = CommonMessageFields & {
  contentType: ContentType.VOICE;
  /**
   * 语音文件URL
   */
  fileUrl: string;

  /**
   * 语音时长（秒）
   */
  length: number;
};

// 图片消息类型
export type ImageMessage = CommonMessageFields & {
  contentType: ContentType.IMAGE;
  /**
   * 图片文件URL
   */
  fileUrl: string;
};

// 组合消息类型
export type InputAreaSendData = TextMessage | VoiceMessage | ImageMessage;

export interface InputAreaProps {
  onSend: (data: InputAreaSendData) => void;
  isTyping: boolean;
  replyMsg?: API.CommentDto;
  clearReplyMsg?: () => void;
}

export interface Point {
  x: number;
  y: number;
}

export interface InputAreaRef {
  setContentText: React.Dispatch<React.SetStateAction<string>>;
  sendText: (p: { text: string }) => void;
}

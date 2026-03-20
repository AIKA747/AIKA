import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types';

import { SourceType } from '@/components/Chat/types';
import { UserInfo } from '@/hooks/useAuth/types';

export abstract class Client {
  protected messageListeners: ((data: BaseMessageDTO<MsgType>) => void)[];

  constructor(
    public props: { id?: string },
    public userInfo: UserInfo,
    public token: string,
  ) {
    this.messageListeners = [];
  }

  public onConnectionLost?: (e: any) => Promise<void>;
  public abstract sendMessage(e: BaseMessageDTO<MsgType>): Promise<void>;
  public abstract connect(opt: { onSuccess: () => void; onFailure: () => void }): Promise<void>;
  public abstract disconnect(): Promise<void>;

  public addMessageListener(callback: (data: BaseMessageDTO<MsgType>) => void) {
    this.messageListeners.push(callback);
  }
  public removeMessageListener(callback: (data: BaseMessageDTO<MsgType>) => void) {
    this.messageListeners = this.messageListeners.filter((listener) => listener !== callback);
  }
  public clearMessageListener() {
    this.messageListeners = [];
  }
}

export interface ChatClientProps {
  client: Client | undefined;
  clientStatus: 'Connecting' | 'Connected';
}

export enum ChatModule {
  assistant = 'assistant', // 没有开发了
  bot = 'bot', // 机器人
  story = 'story',
  game = 'game',
  // post = 'post', // 帖子 这个已经独立了，不需要这个了
  group = 'group',
  heartbeat = 'heartbeat',
}

export enum ContentType {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  botRecommend = 'botRecommend',
  storyRecommend = 'storyRecommend',
  gift = 'gift',
  /**
   * 任务消息
   */
  task = 'task',
  /**
   * 充值提示
   */
  'recharge' = 'recharge',
  /**
   * markdown
   * textContent 为 markdown
   */
  'md' = 'md',
  gameResult = 'gameResult',
  postComment = 'postComment',
  memberChange = 'memberChange',
}

export enum MsgType {
  CHAT_MSG = 'CHAT_MSG',
  READ_MSG = 'READ_MSG',
  RESP_MSG = 'RESP_MSG',
  CHAT_MSG_REGENERATE = 'CHAT_MSG_REGENERATE',
  IMAGE_RESP = 'IMAGE_RESP',
  RECALL = 'RECALL',
}

export enum UserType {
  ADMINUSER = 'ADMINUSER',
  APPUSER = 'APPUSER',
}

export enum ChapterStatus {
  NOT_STARTED = 'NOT_STARTED',
  PLAYING = 'PLAYING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

export enum ChapterProcess {
  CURRENT = 'current',
  NEXT = 'next',
  PRE = 'pre',
}

export enum GameStatus {
  COMPLETE = 'COMPLETE',
  UNCOMPLETED = 'UNCOMPLETED',
}

export enum ChatMsgStatus {
  CREATED = 'created',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAIL = 'fail',
  RECANLLED = 'recanlled', // 撤回的消息状态
}

export interface FileProperty extends ImagePickerAsset {
  length?: number;
  fileName?: string;
}

/**
 * 聊天消息数据传输类
 */
export interface ChatMessageBO {
  /**
   * 目标id
   */
  objectId: string;
  /**
   * 用户id
   */
  userId: string;
  /**
   * 头像（群聊消息返回）
   */
  avatar?: string;
  /**
   * 用户昵称（群聊消息返回）
   */
  nickname?: string;
  /**
   * 用户类型：'ADMINUSER','APPUSER'
   */
  userType: UserType;
  /**
   * 消息类型：'TEXT','VOICE','IMAGE','VIDEO','botRecommend','storyRecommend','gift','md',
   * 'gameResult','task','memberChange'
   */
  contentType: ContentType;
  /**
   * 若contentType='botRecommend'或'storyRecommend'或'gift','gameResult'或task或'memberChange'时，则保存到该json字段
   */
  json: string;
  /**
   * 多媒体（oss文件链接）
   */
  media: string;
  /**
   * 文本内容,若 contentType=md,则文本内容为md格式文本
   */
  textContent: string;
  /**
   * 语音文件属性,json格式：{"length":"时长，单位：秒","fileName":"文件名称（本地文件绝对路径）"}
   */
  fileProperty?: FileProperty;

  /**
   * 响应的消息id
   */
  msgId: string;
  /**
   * （当前chatModule=story时，服务端发送给客户端的消息中，该字段不为空）章节状态：Fail\Playing\Success ，表示 ：章节失败、章节进行中、章节通关
   * NOT_STARTED PLAYING SUCCESS FAIL
   */
  chapterStatus?: ChapterStatus;
  /**
   * current，next，pre
   */
  chapterProcess?: ChapterProcess;
  /**
   * 是否为数字人聊天消息
   */
  digitHuman: boolean;
  /**
   * 消息回复状态，异步数据
   * created,processing,success,fail
   */
  msgStatus?: ChatMsgStatus;
  /**
   * 回复的消息id，client发送的消息可以为空，群聊时该id可以为引用的消息id,标识引用的消息id
   */
  replyMessageId?: string;
  /**
   * 回复消息的内容，格式定义为：type:content(前边的消息类型可保持与contentType一致，content为回复的消息内容，如果为文件则跟上文件链接，回复的文本如果超出200字符，截取前200个字符长度)
   */
  replyMessage?: string;
  /**
   * 消息创建时间
   */
  createdAt: string;

  /**
   * 来源类型：user，bot，assistant，story，game
   */
  sourceType: SourceType;

  /**
   * 游戏状态：COMPLETE，UNCOMPLETED
   */
  gameStatus?: GameStatus;
  /**
   * 聊天室名称
   */
  roomName?: string;
  /**
   * 聊天室头像
   */
  roomAvatar?: string;
  /**
   * @的群成员id，多个使用逗号分隔
   */
  memberIds?: string;
  /**
   * 消息转发信息对象
   */
  // forwardInfo?: string | ForwardInfo;
  forwardInfo?: string;

  username?: string;
  videoUrl?: string;
  videoStatus?: 'created' | 'success' | 'fail';
}

/**
 * 重新生成的消息正文
 */
export interface ChatMsgRegenerateBO {
  /**
   * 消息id
   */
  msgId: string;
}

/**
 * 撤回消息的消息正文
 */
export interface ChatMsgUndoBO {
  /**
   * 消息id
   */
  msgId: string;
}

/**
 * 消息实体
 */
export interface BaseMessageDTO<T extends MsgType> {
  /**
   * 模块：'assistant','bot','story','heartbeat','game','group'
   */
  chatModule: ChatModule;
  /**
   * 消息类型：CHAT_MSG,READ_MSG,RESP_MSG,IMAGE_RESP,CHAT_MSG_REGENERATE，RECALL
   */
  msgType: T;
  /**
   * 消息体内容：根据类型数据结构对应BO实体结构
   */
  msgData: T extends MsgType.CHAT_MSG
    ? ChatMessageBO
    : T extends MsgType.READ_MSG
      ? ReadMessageBO
      : T extends MsgType.RESP_MSG
        ? ResponseMessageBO
        : T extends MsgType.CHAT_MSG_REGENERATE
          ? ChatMsgRegenerateBO
          : T extends MsgType.RECALL
            ? ChatMsgUndoBO
            : T extends MsgType.IMAGE_RESP
              ? ImageMessageBO
              : ImageMessageBO;
  /**
   * 客户端生成消息唯一标识，服务端收到该消息后响应 客户端 收到该消息的唯一标识（推荐使用时间戳）
   */
  clientMsgId: string;
  /**
   * 会话唯一标识，组装字段，拼接规则：userType-userId-chatModule-objectId
   */
  sessionId: string;
  /**
   * 是否为测试调试消息，默认false；当test=true时为测试消息,不保存聊天记录
   */
  test: boolean;
  /**
   * 语言标识，例如：en-GB，zh-CN
   */
  locale: string;
  /** 用户昵称，若为空会使用链接emqx中的token中解析出来的username */
  username?: string;
  /**
   * 聊天风格 机器人聊天用
   */
  communicationStyle?: string;
}

/**
 * 客户端或服务端收到消息后需回应确认收到消息了，防止消息丢失
 */
export interface ResponseMessageBO {
  /**
   * 当服务端响应客户端时为clientMsgId，客户端响应服务端时，为msgId
   */
  msgId: string;
  /**
   * 0：接收成功，其他：接收失败（服务端会校验消息格式和参数）
   */
  code: number;
  /**
   * 说明
   */
  msg: string;
}

/**
 * 标记消息已读数据传输类
 */
export interface ReadMessageBO {
  /**
   * 消息id
   */
  msgId: string;
  /**
   * UTC时间
   */
  readAt: string;
}

export interface ImageMessageBO {
  /**
   * 生成图片的消息id，在图片未生成成功前，该消息记录的类型contentType=TEXT，生成成功后，消息contentType=IMAGE
   */
  msgId: string;
  /**
   * 图片链接
   */
  imageUrl: string;
  /**
   * 图片生成进度，类型为string，返回格式：“80%”
   */
  progress: string;
  /**
   * IN_PROGRESS,FAILURE,SUCCESS
   */
  status: 'IN_PROGRESS' | 'FAILURE' | 'SUCCESS';
}

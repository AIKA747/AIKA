declare namespace API {
  type assistant = {
    /** id 主键id */
    id: string;
    /** 助手男性头像 */
    maleAvatar: string;
    /** 助手女性头像 */
    femaleAvatar: string;
    /** 欢迎语 */
    greetWords: string;
    /** 年龄 */
    age: number;
    /** 职业 */
    profession: string;
    /** 机器人扮演的角色 */
    botCharacter: string;
    /** 擅长领域 */
    personalStrength: string;
    /** 回答策略 */
    answerStrategy: string[];
    /** 机器人推荐策略 */
    botRecommendStrategy: string;
    /** 故事推荐策略 */
    storyRecommendStrategy: string;
    /** 回答策略集合 */
    rules: { key: string; rule: { question: string; answer: string; weight: string } }[];
    /** 预留字段（许久没有聊天，机器人主动打招呼prompt） */
    salutationPrompts?: string;
    /** 打招呼的频率（单位：天）；距离最后一次会话消息多长时间机器人主动给用户发送消息打招呼 */
    salutationFrequency?: number;
    prompts: string;
    /** 支持的数字人配置 */
    digitaHumanService: string[];
    /** 创建时间 */
    createdAt: string;
    /** 更新时间 */
    updatedAt: string;
    /** 数据版本，每更新一次+1 */
    dataVersion: number;
    /** 是否删除：0否，1是 */
    deleted: boolean;
  };

  type BaseEntity = {
    /** id 主键id */
    id: string;
    /** 创建时间 */
    createdAt: string;
    /** 创建人id */
    creator?: number;
    /** 更新时间 */
    updatedAt: string;
    /** 更新人 */
    updater?: number;
    /** 数据版本，每更新一次+1 */
    dataVersion: number;
    /** 是否删除：0否，1是 */
    deleted: boolean;
  };

  type BaseResult = {
    /** 响应码 */
    code: number;
    /** 响应说明 */
    msg: string;
    data: string;
  };

  type BotDetailVO = {
    /** 机器人id */
    id: string;
    /** 作者id */
    creator: string;
    /** 作者名称 */
    creatorName: string;
    /** builtIn，userCreated */
    botSource: string;
    /** 机器人名称 */
    botName: string;
    /** 机器人介绍 */
    botIntroduce: string;
    /** 头像 */
    avatar: string;
    /** 性别 */
    gender: string;
    /** 年龄 */
    age: number;
    /** 职业 */
    profession: string;
    /** 个性 */
    personality: string;
    /** 特点 */
    botCharacter: string;
    /** 特长 */
    personalStrength: string;
    /** 回答风格 */
    conversationStyle: string;
    /** 回答策略集合 */
    rules: string[];
    prompts: string;
    /** 0关闭，1开启 */
    knowledgeEnable: boolean;
    /** 学习文件路径集合 */
    knowledges: string[];
    /** 支持模型，多个使用逗号分隔：Midjourney，DigitaHumanService */
    supportedModels: string[];
    /** 相册 */
    album?: string[];
    /** 机器人状态：Online,Offline */
    botStatus: string;
    /** 是否公开机器人 */
    visibled: boolean;
    /** 评分 */
    rating: number;
    /** 聊天数 */
    chatTotal: number;
    /** 订阅者数量 */
    subscriberTotal: number;
    /** 对话数 */
    dialogues: number;
    /** 是否推荐 */
    recommend: boolean;
    /** 推荐排序 */
    sortNo?: number;
    /** 推荐封面 */
    recommendImage?: string;
    /** 推荐词 */
    recommendWords?: string;
    /** 最近更新时间 */
    updatedAt: string;
    /** 是否订阅机器人 */
    subscribed: boolean;
    /** 是否可评论 */
    commented: boolean;
    /** 是否存在未发布更新 */
    hasUpdated: boolean;
    /** 聊天提示语 */
    dialogueTemplates: string[];
    /** 封面 */
    cover?: string;
    /** 逗号分隔 */
    tags: string;
    postingEnable?: boolean;
    postingFrequecy?: string;
    postingPrompt?: string;
  };

  type BotListVO = {
    /** 机器人id */
    id: string;
    /** 机器人名称 */
    botName: string;
    /** 机器人头像 */
    botAvatar: string;
    /** 用户id */
    userId: number;
    /** 创建人id */
    creator: number;
    /** 创建人名称 */
    creatorName: string;
    /** 评分 */
    rating: number;
    /** 订阅者数量 */
    subscriberTotal: number;
    /** 性别 */
    gender: string;
    /** 机器人最新更新时间 */
    updatedAt: string;
    /** 用户关注机器人的最后一次读取时间 */
    lastReadAt?: string;
    /** 机器人状态：unrelease,online,offline */
    botStatus: string;
    /** 会话数量 */
    chatTotal: number;
    /** 推荐封面 */
    recommendImage?: string;
    /** 推荐词 */
    recommendWords?: string;
    /** 机器人介绍 */
    botIntroduce?: string;
    /** 相册 */
    album: string[];
    /** builtIn，userCreated */
    botSource: string;
    /** 机器人封面 */
    cover: string;
  };

  type ChapterPassDto = {
    /** 主键id，当前章节的id */
    id: number;
    storyId: string;
    /** 章节名称，非必填 */
    chapterName: string;
    /** 此章节的形象 */
    image: string;
    /** 章节封面（通关或失败的图片） */
    picture: string;
    /** 文案（显示上一个章节的通关文案或者） */
    copywriting: string;
    /** 'PLAYING', 'FAIL', 'SUCCESS' */
    status: string;
  };

  type ChatGroupDetail = {
    /** id 主键id */
    id: number;
    /** 创建时间 */
    createdAt: string;
    /** 创建人id */
    creator?: number;
    /** 更新时间 */
    updatedAt: string;
    /** 更新人 */
    updater?: number;
    roomName: string;
    /** 枚举CollectionType：    TALES,EXPERT,GAME,GROUP_CHAT */
    roomType: string;
    /** 群聊类型：PUBLIC、PRIVATE */
    groupType: string;
    /** 群聊头像 */
    roomAvatar: string;
    /** 用户成员上限 */
    memberLimit: number;
    /** 详情 */
    description: string;
    /** 群聊标识，用于生成invitelink中的标识 */
    roomCode: string;
    /** 新入群里人员是否可见历史消息，仅管理员和群主返回该字段信息 */
    historyMsgVisibility: string;
    /** 群聊权限：仅管理员和群主返回该字段信息 */
    permissions: {
      memberRole: string;
      changeGroupSettings: boolean;
      changeGroupInfo: boolean;
      changeGroupType: boolean;
      changeShowHis: boolean;
      linkChatToPosts: boolean;
      approveNewMembers: boolean;
      addOtherMembers: boolean;
    }[];
    /** 群聊主题，成员设置了返回成员的，成员未设置，返回群主的主题设置 */
    theme: { type: string; color: string; gallery: string };
    /** NONE未加入群聊，FRIEND_INVITE(朋友邀请加入群聊，待用户审核)，USER_JOIN_REQUEST（用户申请加入群聊，待管理员审核），APPROVE（已通过） */
    status: string;
    /** status=FRIEND_INVITE时返回 */
    inviteId?: number;
    /** 当前用户在该群聊的角色：OWNER、ADMIN、MEMBER、MODERATOR
     */
    memberRole?: string;
    /** 在这个时间前不接收群消息通知，此字段是一个枚举
ONE_HOUR,EIGHT_HOUR,ONE_DAY,ONE_WEEK,ALWAYS */
    notifyTurnOff?: string;
    /** UTC时间，当前用户在这个时间点前不接收该群消息 */
    notifyTurnOffTime?: string;
  };

  type ChatListVO = {
    /** id 主键id */
    id: string;
    /** 创建时间 */
    createdAt: string;
    /** 创建人id，type=chat时，和updater分别时候自己的id和聊天对象的id */
    creator?: number;
    /** 更新时间 */
    updatedAt: string;
    /** 更新人 */
    updater?: number;
    roomName: string;
    /** 枚举CollectionType：    TALES,EXPERT,GAME,GROUP_CHAT */
    roomType: string;
    /** 群聊类型：PUBLIC、PRIVATE */
    groupType: string;
    /** 群聊头像 */
    roomAvatar: string;
    /** 用户成员上限 */
    memberLimit: number;
    /** 详情 */
    description: string;
    /** 群聊标识，用于生成invitelink中的标识 */
    roomCode: string;
    /** 未读消息数量 */
    unreadNum: number;
    lastMessage?: {
      msgId?: string;
      objectId: string;
      userId: string;
      nickname?: string;
      avatar?: string;
      userType: string;
      contentType: string;
      textContent: string;
      media: string;
      fileProperty: string;
      replyMessageId: string;
      createdAt: string;
      sourceType: string;
      memberIds?: string;
      forwardInfo?: string;
      json: string;
      msgStatus: string;
      gender?: string;
    };
    lastLoadTime?: string;
    lastReadTime?: string;
  };

  type ChatMessageBO = {
    /** 消息id，消息唯一标识 */
    msgId?: string;
    /** 聊天对象id */
    objectId: string;
    /** 用户id */
    userId: string;
    /** 用户昵称 */
    nickname?: string;
    /** 头像 */
    avatar?: string;
    /** 用户类型：'ADMINUSER','APPUSER' */
    userType: string;
    /** 消息类型：'TEXT','VOICE','IMAGE','VIDEO' */
    contentType: string;
    /** 内容，若为文件类型，此处就是文件链接 */
    textContent: string;
    /** 多媒体（oss文件链接） */
    media: string;
    /** 语音文件属性,json格式：{"length":"时长，单位：秒","fileName":"文件名称（本地文件绝对路径）"} */
    fileProperty: { length: string; fileName: string };
    /** 回复的消息id，client发送的消息可以为空，群聊时该id可以为引用的消息id,标识引用的消息id */
    replyMessageId: string;
    /** created, processing, success, fail,recanlled */
    msgStatus: string;
    /** 消息创建时间


 */
    createdAt: string;
    /** 来源类型：user，bot，assistant，story，game */
    sourceType: string;
    memberIds?: string;
    /** 转发消息信息 */
    forwardInfo?: string;
    json: string;
    /** 发消息的用户性别 */
    gender?: string;
  };

  type ChatMessageRecordVO = {
    /** 聊天对象id */
    objectId: string;
    /** 'TEXT','VOICE','IMAGE','VIDEO','botRecommend','storyRecommend' */
    contentType: string;
    json?: string;
    /** 多媒体（oss文件链接） */
    media?: string;
    /** 文本内容 */
    textContent?: string;
    /** 来源类型：user，bot，assistant，story */
    sourceType: string;
    /** 用户id */
    userId: string;
    /** 消息状态: created, processing, success, fail */
    msgStatus: string;
    /** 已读标记：false未读，true已读 */
    readFlag: boolean;
    /** 读取消息时间 */
    readTime: string;
    /** 机器人回复的消息id */
    replyMessageId: string;
    /** 创建时间 */
    createdAt: string;
    /** 消息唯一标识 */
    msgId: string;
    /** 语音文件属性 */
    fileProperty: string;
    videoUrl: string;
    /** created, success, fail */
    videoStatus: string;
    /** 是否数字人消息 */
    digitHuman: boolean;
    /** 是否标记为不好的回复 */
    badAnswer: boolean;
    gameStatus: string;
  };

  type Chatroom = {
    /** id 主键id */
    id: string;
    /** 创建时间 */
    createdAt: string;
    /** 创建人id */
    creator?: number;
    /** 更新时间 */
    updatedAt: string;
    /** 更新人 */
    updater?: number;
    /** 数据版本，每更新一次+1 */
    dataVersion: number;
    /** 是否删除：0否，1是 */
    deleted: boolean;
    roomName: string;
    /** 枚举CollectionType：    TALES,EXPERT,GAME,GROUP_CHAT */
    roomType: string;
    /** 群聊类型：PUBLIC、PRIVATE */
    groupType: string;
    /** 群聊头像 */
    roomAvatar: string;
    /** 用户成员上限 */
    memberLimit: number;
    /** 详情 */
    description: string;
    /** 群聊标识，用于生成invitelink中的标识 */
    roomCode: string;
    /** 新入群里人员是否可见历史消息 */
    historyMsgVisibility: boolean;
    permissions: {
      memberRole: string;
      changeGroupSettings: boolean;
      linkChatToPosts: boolean;
      approveNewMembers: boolean;
      addOtherMembers: boolean;
    }[];
  };

  type ChatroomMember = {
    /** id 主键id */
    id: string;
    /** 创建时间 */
    createdAt: string;
    /** 创建人id */
    creator?: number;
    /** 邀请人的昵称 */
    creatorNickName: string;
    /** 更新时间 */
    updatedAt: string;
    /** 更新人 */
    updater?: number;
    /** 数据版本，每更新一次+1 */
    dataVersion: number;
    /** 是否删除：0否，1是 */
    deleted: boolean;
    /** 聊天室id */
    roomId: string;
    /** 成员类型：USER、BOT */
    memberType: string;
    /** 成员id */
    memberId: string;
    /** 成员头像 */
    avatar: string;
    /** 显示的名字 */
    nickname: string;
    /** 成员@的用户名 */
    username: string;
    /** 成员角色：OWNER、ADMIN、MEMBER、MODERATOR */
    memberRole: string;
    /** 通知关闭截止时间 */
    notifyTurnOffTime: string;
    /** FRIEND_INVITE(朋友邀请加入群聊，待用户审核),USER_JOIN_REQUEST（用户申请加入群聊，待管理员审核）,APPROVE（已通过） */
    status: string;
    /** 主题 */
    theme: { type: string; color: string; gallery: string };
    /** 最近一次读取消息时间，消息时间大于该时间的消息都是未读消息 */
    lastReadTime: string;
  };

  type Comment = {
    /** id 评论id */
    id: number;
    /** 评论内容 评论内容 */
    content: string;
    /** 语音链接 */
    voiceUrl: string;
    /** 回帖id */
    postId: number;
    /** 发帖人id */
    creator: number;
    /** 发帖人类型 BOT 或 USER */
    type: string;
    createdAt: string;
    updatedAt: string;
    /** 回复的用户名 */
    replyTo: string[];
  };

  type CommentDto = {
    /** id */
    id: number;
    /** 评论内容 */
    content?: string;
    /** 语音链接 */
    voiceUrl?: string;
    /** 语音文件属性 */
    fileProperty?: Record<string, any>;
    /** 回帖id */
    postId: number;
    /** 回复人id */
    creator: string;
    /** 回复人头像 */
    avatar: string;
    /** 回帖时间 */
    createdAt: string;
    /** 昵称 */
    nickname: string;
    username: string;
    /** 回复 */
    replyTo: string[];
    /** 发帖人昵称 */
    postAuthor: string;
    /** 发帖人ID */
    postAuthorId: string;
    /** 发帖人头像 */
    postAuthorAvatar: string;
    /** 发帖人类型，BOT、 USER */
    postAuthorType: string;
    /** 发帖时间 */
    postCreatedAt: string;
    /** 帖子摘要 */
    summary: string;
    /** 点赞数 */
    likes: number;
    /** 回复数 */
    reposts: number;
    /** 是否已点赞 */
    thumbed: boolean;
    /** 这里实际是string类型，具体的数据为replyCommontInfo?: {
      id: string; // 回复的评论id
      content: string; // 评论内容
      voiceUrl: string; // 语音链接
      fileProperty: Record<string, any>; // 语音文件属性
      nickname: string; // nickname
      username: string; // username
      avatar: string; // 回复评论的头像
    }; */
    replyCommontInfo?: string;
  };

  type deleteBotAppBotIdParams = {
    /** 机器人id */
    id: string;
  };

  type deleteBotAppBotIdUnsubscribeParams = {
    /** 机器人id */
    id: string;
  };

  type deleteBotAppChatBotIdParams = {
    /** 机器人id */
    id: string;
  };

  type deleteBotAppChatMsgMsgIdParams = {
    /** 某一条消息的id，若删除的用户消息，会连带删除对应的机器人回复该用户的消息 */
    msgId: string;
  };

  type deleteBotAppChatroomIdParams = {
    /** 群聊id */
    id: string;
  };

  type deleteBotAppUserTaskIdParams = {
    id: string;
  };

  type deleteContentAppCommentIdParams = {
    id: number;
  };

  type deleteContentAppFollowRelationIdParams = {
    /** 关注记录id */
    id: number;
  };

  type deleteContentAppPostReportPostIdParams = {
    postId: string;
  };

  type deleteContentAppPostsIdParams = {
    id: string;
  };

  type deleteContentAppUserCollectStoryStoryIdParams = {
    /** 故事id */
    storyId: string;
  };

  type deleteUserAppFeedbackIdParams = {
    /** 反馈id */
    id: string;
  };

  type deleteUserAppUserImageIdParams = {
    /** 图片的id号 */
    id: number;
  };

  type dictionary = {
    id: number;
    /** 字典类型 */
    dicType: string;
    /** 字典值 */
    dicValue: string;
    /** 字典值,根据用户当前语言环境进行翻译后的字典值，仅用于页面显示 */
    dicLab: string;
    /** 排序 */
    sortNo: number;
  };

  type digitalHumanProfile = {
    /** 配置id */
    id: number;
    /** 数字人配置类型：bot、assistant */
    profileType: string;
    /** 机器人或助手id */
    objectId: string;
    gender: string;
    /** 数字人图片 */
    sourceImage: string;
    /** 表情 The expression to use */
    expression: string;
    /** 强度 Controls the intensity you want for this expression (between 0 no expression, 1 maximum) */
    intensity: number;
    /** 支持的语言 */
    language?: { language: string; voice: string }[];
    /** 生成的欢迎视频Id */
    greetVideoId: string;
    greetVideo: string;
    /** 空闲时待机视频id */
    idleVideoId: string;
    idleVideo: string;
    /** 生成数字人设置的音色 */
    voiceName: string;
  };

  type EditBotVO = {
    /** 是否公开机器人 */
    visibled: boolean;
    /** 机器人名称 */
    botName: string;
    /** 头像 */
    avatar: string;
    /** 性别：1男，2女 */
    gender: string;
    /** 机器人介绍 */
    botIntroduce: string;
    /** 年龄 */
    age: number;
    /** 分类（栏目）id */
    categoryId?: string;
    /** 分类（栏目）名称 */
    categoryName?: string;
    /** 特点 */
    botCharacter: string;
    /** 职业 */
    profession: string;
    /** 个人实力 */
    personalStrength: string;
    /** 回答风格 */
    conversationStyle: string;
    /** 回答策略id集合 */
    rules: string[];
    prompts?: string;
    knowledgeEnable?: string;
    /** 学习文件路径集合 */
    knowledges?: string[];
    /** 支持模型 */
    supportedModels?: string[];
    /** 数字人配置 */
    digitalHumanProfile?: {
      id: number;
      profileType: string;
      objectId: string;
      gender: string;
      sourceImage: string;
      expression: string;
      intensity: number;
      language?: { language: string; voice: string }[];
      greetVideoId: string;
      greetVideo: string;
      idleVideoId: string;
      idleVideo: string;
      voiceName: string;
    };
    /** 相册 */
    album?: string[];
  };

  type Game = {
    /** id 主键id */
    id: string;
    /** 创建时间 */
    createdAt: string;
    /** 创建人id */
    creator?: number;
    /** 更新时间 */
    updatedAt: string;
    /** 更新人 */
    updater?: number;
    /** 数据版本，每更新一次+1 */
    dataVersion: number;
    /** 是否删除：0否，1是 */
    deleted: boolean;
    /** 指南 对应assistant的instructions参数 */
    instructions: string;
    /** 游戏名称 这个给用户看 */
    gameName: string;
    /** AI角色 这个告诉AI它扮演什么角色 */
    assistantName: string;
    /** 使用工具 枚举：code_interpreter，file_search，function */
    tools?: string;
    /** 模型 使用的模型 */
    model?: string;
    /** 在openai上创建的assistant的id */
    assistantId?: string;
    /** 介绍 给用户看的游戏介绍 */
    introduce: string;
    /** 描述 列表封面的描述 */
    description: string;
    /** 问题 */
    questions: string[];
    /** 封面 封面URL */
    cover: string;
    /** 列表封面 列表封面URL */
    listCover: string;
    /** 头像 头像图片URL */
    avatar: string;
    /** 知识文档 知识文档url */
    knowledge: string[];
    /** 列表描述文字 */
    listDesc: string;
    /** 上线/下线 上线和下线的标志，ture false */
    enable: boolean;
    /** 排序 */
    orderNum: number;
    /** 暗色模式封面 */
    coverDark?: string;
    /** 暗色模式列表封面 */
    listCoverDark?: string;
    free: boolean;
  };

  type GameListDto = {
    /** id 主键id */
    id: number;
    /** 游戏名称 这个给用户看 */
    gameName: string;
    /** 介绍 给用户看的游戏介绍 */
    introduce: string;
    /** 描述 列表的描述 */
    description: string;
    /** 封面 封面URL */
    cover: string;
    /** 列表封面 列表封面URL */
    listCover: string;
    /** 头像 头像 */
    avatar: string;
    /** 列表描述文字 */
    listDesc: string;
    /** 上线下线状态 */
    enable: boolean;
    listCoverDark: string;
  };

  type getBotAppAssistantChatRecordParams = {
    pageNo?: number;
    pageSize?: number;
    /** 查询时间 */
    lastTime?: string;
  };

  type getBotAppBotCategoryParams = {
    pageNo?: number;
    pageSize?: number;
    /** 机器人栏目 */
    categoryName?: string;
  };

  type getBotAppBotIdParams = {
    /** 机器人id */
    id: string;
    /** unrelease仅作者查询时该值生效,online作者查询已发布的机器人版本详情 */
    botStatus?: string;
  };

  type getBotAppChatRecordsParams = {
    pageNo?: number;
    pageSize?: number;
    /** 机器人id */
    botId: string;
    /** 查询时间 */
    lastTime?: string;
  };

  type getBotAppChatroomFeatureMessagesParams = {
    pageNo: number;
    pageSize: number;
    /** 群聊id */
    roomId?: number;
  };

  type getBotAppChatroomGroupChatFilesParams = {
    pageNo: number;
    pageSize: number;
    /** 群聊id */
    roomId: number;
    /** 文件名称 */
    fn?: string;
  };

  type getBotAppChatroomGroupChatRecordsParams = {
    pageNo: string;
    pageSize: string;
    /** 群聊id */
    roomId: number;
  };

  type getBotAppChatroomIdParams = {
    id: string;
  };

  type getBotAppChatroomListParams = {
    pageNo: string;
    pageSize: string;
    roomName?: string;
  };

  type getBotAppChatroomMemberJoinRequestParams = {
    roomId?: number;
    pageNo?: number;
    pageSize?: number;
  };

  type getBotAppChatroomMemberNotificationParams = {
    pageNo?: number;
    pageSize?: number;
    /** 根据群聊名称或邀请者昵称查询 */
    name?: string;
  };

  type getBotAppChatroomMembersParams = {
    pageNo?: number;
    pageSize?: number;
    /** 群聊id */
    roomId: string;
    /** 群成员昵称 */
    nickname?: string;
    /** 成员角色：OWNER、MODERATOR、MEMBER，查询多个角色使用逗号分割 */
    memberRole?: string;
    /** FRIEND_INVITE(朋友邀请加入群聊，待用户审核),USER_JOIN_REQUEST（用户申请加入群里，待管理员审核）,APPROVE（已通过） */
    status?: string;
    /** 成员类型：USER、BOT */
    memberType?: string;
  };

  type getBotAppChatroomParams = {
    /** 聊天室编码 */
    code?: string;
  };

  type getBotAppChatroomUserChatParams = {
    /** 聊天对象id */
    friendId?: string;
  };

  type getBotAppChatsParams = {
    /** 页码 */
    pageNo?: number;
    /** 页容量 */
    pageSize?: number;
    /** 机器人名称 */
    botName?: string;
  };

  type getBotAppDicParams = {
    /** 字典类型：botRules，botProfession，botConversationStyle，feedbackCategory，feedbackTitle */
    dicType: string;
  };

  type getBotAppExploreBotsParams = {
    pageNo?: number;
    pageSize?: number;
    /** 关键词 */
    keyword?: string;
    /** 0全部，1栏目，2机器人 */
    type?: string;
    /** 分类的id */
    categoryId?: string;
    /** 按tag搜索 */
    tag?: string;
  };

  type getBotAppGameChatRecordsParams = {
    pageNo?: number;
    pageSize?: number;
    /** 线程id */
    threadId: string;
    /** 查询时间 */
    lastTime?: string;
  };

  type getBotAppGameIdParams = {
    id: string;
  };

  type getBotAppGameParams = {
    pageNo?: number;
    pageSize?: number;
  };

  type getBotAppGroupChatroomListParams = {
    pageNo?: number;
    pageSize?: number;
    /** 检索内容 */
    searchContent?: string;
  };

  type getBotAppMyBotsParams = {
    pageNo?: number;
    pageSize?: number;
    /** 机器人名称 */
    botName?: string;
  };

  type getBotAppOwnerBotsParams = {
    pageNo?: number;
    pageSize?: number;
    /** 指定关注用户的id集合 逗号分隔 */
    botOwnerIds: string;
  };

  type getBotAppRateParams = {
    pageNo?: number;
    pageSize?: number;
    /** 机器人id */
    botId?: string;
  };

  type getBotAppRecommendBotsParams = {
    pageNo?: number;
    pageSize?: number;
    /** 机器人名称 */
    botName?: string;
  };

  type getBotAppSphereBotParams = {
    pageNo: number;
    pageSize: number;
    /** sphere分类id */
    collectionId?: string;
  };

  type getBotAppSubscribedBotsParams = {
    pageNo?: number;
    pageSize?: number;
    /** 机器人名称 */
    botName?: string;
  };

  type getBotAppUserTaskIdParams = {
    id: string;
  };

  type getBotAppUserTaskParams = {
    pageNo?: string;
    pageSize?: string;
    /** 查找指定机器人任务 */
    botId?: string;
  };

  type getContentAppAuthorParams = {
    pageNo?: number;
    pageSize?: number;
    keyword?: string;
    /** pop 会按流行度排序，而all则是按匹配度排序 */
    sort?: string;
    /** BOT或者USER */
    type?: string;
  };

  type getContentAppCategoryParams = {
    pageNo?: number;
    pageSize?: number;
  };

  type getContentAppCommentParams = {
    pageNo?: number;
    pageSize?: number;
    postId: string;
    keywords?: string;
  };

  type getContentAppFollowingApplyParams = {
    pageNo?: number;
    pageSize?: number;
    /** 用户昵称搜索 */
    nickname?: string;
  };

  type getContentAppFollowRelationUsersParams = {
    pageNo: number;
    pageSize: number;
    /** 0我关注的，1关注我的，2相互关注 */
    type: number;
    /** 用户id，查询其他用户的关注列表时使用，为空时，默认查询当前登录用户 */
    userId?: string;
    /** 用户名称 */
    username?: string;
  };

  type getContentAppGiftParams = {
    pageNo?: number;
    pageSize?: number;
    /** 当前故事id */
    storyId?: string;
    chapterId?: string;
  };

  type getContentAppPopPostsParams = {
    pageNo?: number;
    pageSize?: number;
    keywords?: string;
  };

  type getContentAppPostIdParams = {
    id: string;
  };

  type getContentAppPostPostIdCommentUsersParams = {
    postId: string;
    /** 用户名,可为空 */
    username?: string;
    pageSize: number;
    pageNo: number;
  };

  type getContentAppPostsFeedParams = {
    pageNo: number;
    pageSize?: number;
    topicTag?: string;
    keywords?: string;
    /** 查询指定用户发表的帖子 */
    userId?: number;
  };

  type getContentAppPostsFollowParams = {
    pageNo: number;
    pageSize: string;
  };

  type getContentAppPostsPrivateParams = {
    pageNo?: number;
    pageSize?: number;
    /** 可查询指定用户，为空时查询自己发送的帖子 */
    userId?: string;
  };

  type getContentAppPostThumbUserListParams = {
    pageNo?: number;
    pageSize?: number;
    /** 帖子id */
    postId: number;
  };

  type getContentAppShortcutParams = {
    /** Fixed 表示是用户自己固定的，在shorcut的表里;All 除了Fixed的以外，最近有更新的Expert。 */
    scope?: string;
  };

  type getContentAppStoryChatRecordParams = {
    pageNo?: number;
    pageSize?: number;
    /** 故事id */
    storyId: string;
    /** 查询时间 */
    lastTime?: string;
  };

  type getContentAppStoryIdChapterParams = {
    id: string;
  };

  type getContentAppStoryIdParams = {
    /** 故事id */
    id: string;
  };

  type getContentAppStoryParams = {
    pageNo?: number;
    pageSize?: number;
    /** 故事名称 */
    storyName?: string;
    /** NOT_STARTED,PLAYING, FAIL, SUCCESS */
    status?: string;
    /** 是否收藏 */
    collected?: boolean;
    /** 分类id */
    categoryId?: string;
    /** 查询状态集合，多个用逗号分隔 */
    statusList?: string;
  };

  type getContentAppUserCollectStoryParams = {
    pageNo?: number;
    pageSize?: number;
  };

  type getContentAppUserCommentParams = {
    pageNo?: number;
    pageSize?: number;
    userId: string;
  };

  type getContentAppUserStatisticsParams = {
    /** 不传则默认当前登录用户 */
    userId?: string;
  };

  type getOrderAppPaymentHistoryParams = {
    pageNo?: number;
    pageSize?: number;
  };

  type getOrderAppPaymentResultParams = {
    /** 订单号 */
    orderNo?: string;
  };

  type getOrderAppServicePackagesParams = {
    pageNo?: number;
    pageSize?: number;
  };

  type getUserAppFeedbackIdParams = {
    /** 反馈id */
    id: string;
  };

  type getUserAppFeedbackListParams = {
    pageNo?: number;
    pageSize?: number;
    /** 列表类型：processed,finished */
    listType?: string;
  };

  type getUserAppInterestItemsParams = {
    /** 表示兴趣习惯的类型。枚举值，包括：PERSONALITY, HABIT,    COMPETITIVE,    SKILLBASED,    ARTISTIC,    LIFESTYLE,    INTELLIGENCE,    OTHER */
    itemType?: string;
  };

  type getUserAppNotificationParams = {
    pageNo?: number;
    pageSize?: number;
    /** 查询截止时间，格式：yyyy-MM-dd HH:mm:ss */
    lastTime?: string;
  };

  type getUserAppTagsParams = {
    /** 页码 */
    pageNo?: number;
    /** 页容量 */
    pageSize?: number;
  };

  type getUserAppUserBlockedUserParams = {
    /** 不传默认当前登录用户 */
    userId?: number;
  };

  type getUserAppUserCheckUsernameParams = {
    username?: string;
  };

  type getUserAppUserIdParams = {
    /** 用户id */
    id: string;
  };

  type getUserAppUserImageParams = {
    /** 图片、头像 */
    type: string;
    pageNo: number;
    pageSize: number;
  };

  type getUserAppUserParams = {
    username?: string;
  };

  type getUserPublicRefreshTokenParams = {
    /** 注册邮件返回的clientCode */
    clientCode?: string;
  };

  type getUserPublicVideoConvertResultParams = {
    /** 视频链接 */
    videoUrl: string;
  };

  type GroupChatMessageRecord = {
    /** id 主键id */
    id: string;
    /** 用户id */
    uid: string;
    /** 来源类型：user，bot */
    st: string;
    /** 头像 */
    avatar: string;
    /** 用户昵称或机器人昵称 */
    nn: string;
    /** 文本内容 */
    txt?: string;
    /** 'TEXT','VOICE','IMAGE','VIDEO' */
    ct: string;
    /** 多媒体（oss文件链接） */
    med?: string;
    /** 时长，单位：秒 */
    flength: string;
    /** 文件名称 */
    fn: string;
    /** 创建时间 */
    time: string;
  };

  type GroupMemberListVO = {
    /** id 主键id */
    id: number;
    /** 创建时间 */
    createdAt: string;
    /** 创建人id */
    creator?: number;
    /** 更新时间 */
    updatedAt: string;
    /** 更新人 */
    updater?: number;
    /** 聊天室id */
    roomId: string;
    /** 成员类型：USER、BOT */
    memberType: string;
    /** 成员角色：OWNER、ADMIN、MEMBER、MODERATOR */
    memberRole: string;
    /** 成员id */
    memberId: string;
    /** 头像 */
    avatar: string;
    /** 昵称 */
    nickname: string;
    /** @的用户名 */
    username: string;
    /** 最近一次读取消息时间 */
    lastReadTime: string;
    /** 在线状态 */
    onlineStatus: boolean;
    /** FRIEND_INVITE(朋友邀请加入群聊，待用户审核),USER_JOIN_REQUEST（用户申请加入群里，待管理员审核）,APPROVE（已通过） */
    status: string;
  };

  type NotificationVO = {
    /** 通知id */
    id: string;
    /** 通知类型：点赞通知（thumb）、关注的用户发帖通知（post）、被@通知（at）、评论通知（comment） */
    type: string;
    /** 封面 */
    cover: string;
    /** 数量，默认1 */
    number: number;
    /** 超过10个时，仅返回前10个 */
    authors: { authorId: string; avatar: string; nickname: string; username: string; gender: string }[];
    /** 附带的元数据 */
    metadata: {
      postId?: string;
      summary?: string;
      likes: string;
      reposts: string;
      commentId?: string;
      content: string;
    };
    /** 是否已读 */
    readFlag: boolean;
    /** 通知时间 */
    createdAt: string;
  };

  type order = {
    /** id 主键id */
    id: number;
    /** 订单号 */
    orderNo: string;
    /** app用户id */
    userId?: string;
    /** 消费者姓名 */
    username?: string;
    /** 电话 */
    phone?: string;
    /** 邮箱 */
    email?: string;
    /** 消费金额（单位分） */
    amount: number;
    /** 服务包id */
    packageId: string;
    /** 服务包名称 */
    packageName: string;
    /** 订单状态：Cancelled，Unpaid，Success */
    status: string;
    /** 支付回调时间 */
    callbackAt?: string;
    /** 取消时间 */
    cancelAt?: string;
    /** 订阅过期时间 */
    expiredAt?: string;
    /** 国家 */
    country?: string;
    /** 创建时间 */
    createdAt?: string;
    /** 更新时间 */
    updatedAt?: string;
    /** 数据版本，每更新一次+1 */
    dataVersion?: number;
    /** 是否删除：0否，1是 */
    deleted?: boolean;
  };

  type PageData = {
    /** 数据总条数 数据总条数 */
    total: number;
    /** 当前页码 当前页码 */
    pageNum: number;
    /** 页容量 页容量 */
    pageSize: number;
    /** 页数 页数 */
    pages: number;
    /** 返回集合数据 返回集合数据 */
    list: string[];
  };

  type PageResult = {
    /** 响应码 */
    code: number;
    /** 响应说明 */
    msg: string;
    /** 响应数据 */
    data: { total: number; pageNum: number; pageSize: number; pages: number; list: Record<string, any>[] };
  };

  type postBotAppChatroomRoomCodeParams = {
    roomCode: string;
  };

  type postBotAppChatroomRoomIdBotMemeberParams = {
    roomId: string;
  };

  type postUserAppFirebaseBindTokenParams = {
    /** 用户设备唯一标识 */
    token: string;
  };

  type PostVO = {
    /** 标题 */
    title?: string;
    /** 摘要内容 thread的第一个有内容的节点的内容 */
    summary?: string;
    /** 内容 一个帖子的内容，会按照thread的格式来存储，类似一个时间线 */
    thread: {
      title?: string;
      content?: string;
      video?: string;
      fileProperty?: string;
      images?: string[];
    }[];
    /** 封面 取thread里的第一张图片做封面，字段冗余 */
    cover?: string;
    /** 视频链接 */
    video?: string;
    /** 主题标签 在文章中的 #tags 这样的标签就对应一个topicTags，从文章中抽取出来，用逗号隔开，放到这里 */
    topicTags?: string;
    /** id 可以为空，为空的时候为新增 */
    id?: number;
  };

  type putBotAppBotIdParams = {
    id: string;
  };

  type putBotAppBotIdReleaseParams = {
    /** 机器人id */
    id: string;
  };

  type putBotAppUserTaskIdParams = {
    id: string;
  };

  type putUserAppNotificationReadParams = {
    /** 通知id，多个使用逗号分隔 */
    notificationId?: string;
  };

  type putUserAppUserBlockUserIdParams = {
    userId: string;
  };

  type putUserAppUserUnBlockUserIdParams = {
    userId: string;
  };

  type SphereBotDto = {
    id: number;
    /** 列表封面 */
    listCover: string;
    /** 头像 */
    avatar: string;
    /** 名称 */
    name: string;
    /** 机器人类型 TALES、EXPERT、GAME、GROUP_CHAT */
    type: string;
    /** 描述 对应不同类型机器人的描述 */
    description: string;
    botId: number;
    collectionId: number;
    listCoverDark: string;
  };

  type SphereDto = {
    /** id 主键id */
    id: string;
    /** 集合类型 TALES、EXPERT、GAME、GROUP_CHAT */
    type: string;
    /** 图标 */
    avatar: string;
    /** 集合名词 */
    collectionName: string;
    /** 分类id 如果关联了对应的分类，则跳转到相应的分类上去 */
    category?: string;
    categoryName?: string;
  };

  type StoryListDto = {
    /** id 主键id */
    id: number;
    /** 故事名称 */
    storyName: string;
    /** 故事分值，赢得故事后获得此分值 */
    rewardsScore: number;
    /** 是否被锁定了 */
    locked: boolean;
    /** 故事角色性别 */
    gender: string;
    /** 当前角色形象图片的url */
    image: string;
    /** 故事简介 */
    introduction: string;
    /** 列表封面 */
    listCover: string;
    /** 列表显示的封面dark模式 */
    listCoverDark: string;
    /** 当前章节进度 0-1 之间的一个小数 */
    storyProcess: number;
    /** NOT_START,PLAYING, FAIL, SUCCESS */
    status: string;
    collected: boolean;
    /** 进行中的故事封面 */
    processCover?: string;
  };

  type userBotTask = {
    id: number;
    /** 任务类型：REMINDER，WEBSEARCH */
    type: string;
    /** 任务名称 */
    name: string;
    /** 任务简介 */
    introduction: string;
    /** 任务执行频次 */
    cron: string;
    /** 最后一次执行任务的时间 */
    lastExcetedAt?: string;
    /** 创建者 */
    creater: string;
    /** 机器人id */
    botId: string;
    /** 任务状态：
待确认 → PENDING
启用 → ENABLED
停用 → DISABLED */
    status: string;
    /** 创建时间 */
    createdAt: string;
    /** 用于调用openai执行任务的提示语 */
    prompt?: string;
    json?: string;
  };
}

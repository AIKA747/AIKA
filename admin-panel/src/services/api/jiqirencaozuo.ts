// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建机器人 机器人成功发布后发送下列消息到rabbitmq队列中，更新用户机器人数量
```
rabbitTemplate.convertAndSend(
    USER_COUNT_DIRECT_EXCHANGE, USER_BOT_INFO_ROUTE_KEY,“”“ {"userId": 1,"count": 1,"updateAt":"2023-12-27 08:00:00"}“”“
)
//参数说明：
//userId：用户id
//count：用户当前机器人数量
//updateAt：查询用户机器人数量更新时间
```
user-service监听：
```
    @RabbitHandler
    @RabbitListener(queues = [USER_BOT_INFO_QUEUE])
    fun userBotCountReceiver(msg: String) {
            //更新用户机器人数量，记录一下updateAt，需根据updateAt做一下判断，仅更新比最后一条消息时间晚的数据
    }
``` POST /bot/app/bot */
export async function postBotAppBot(
  body: {
    /** 是否公开机器人 */
    visibled: boolean;
    /** 机器人名称 */
    botName: string;
    /** 头像 */
    avatar: string;
    /** 性别 */
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
    knowledgeEnable?: boolean;
    /** 学习文件路径集合 */
    knowledges?: string[];
    /** 支持模型 */
    supportedModels?: string[];
    /** 相册 */
    album: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      creator: string;
      creatorName: string;
      botSource: string;
      botName: string;
      botIntroduce: string;
      avatar: string;
      gender: string;
      age: number;
      profession: string;
      personality: string;
      botCharacter: string;
      personalStrength: string;
      conversationStyle: string;
      rules: string[];
      prompts: string;
      knowledgeEnable: boolean;
      knowledges: string[];
      supportedModels: string[];
      album: string[];
      botStatus: string;
      visibled: boolean;
      rating: number;
      chatTotal: number;
      subscriberTotal: number;
      dialogues: number;
      recommend: boolean;
      sortNo: number;
      recommendImage: string;
      recommendWords: string;
      updatedAt: string;
      subscribed: boolean;
      commented: boolean;
      hasUpdated: boolean;
      dialogueTemplates: string[];
      cover: string;
      tags: string;
    };
  }>('/bot/app/bot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 编辑机器人 PUT /bot/app/bot/${param0} */
export async function putBotAppBotId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putBotAppBotIdParams,
  body: {
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
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: API.BotDetailVO }>(
    `/bot/app/bot/${param0}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 删除机器人 发送下列消息到rabbitmq队列中，更新用户的机器人数量
```
rabbitTemplate.convertAndSend(
    USER_COUNT_DIRECT_EXCHANGE, USER_BOT_INFO_ROUTE_KEY,“”“ {"userId": 1,"count": 1,"updateAt":"2023-12-27 08:00:00"}“”“
)
//参数说明：
//userId：用户id
//count：用户当前机器人数量
//updateAt：查询用户机器人数量更新时间
```
user-service监听：
```
    @RabbitHandler
    @RabbitListener(queues = [USER_BOT_INFO_QUEUE])
    fun userBotCountReceiver(msg: String) {
            //更新用户机器人数量，记录一下updateAt，需根据updateAt做一下判断，仅更新比最后一条消息时间晚的数据
    }
``` DELETE /bot/app/bot/${param0} */
export async function deleteBotAppBotId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotAppBotIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(
    `/bot/app/bot/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 机器人发布 机器人成功发布后发送下列消息到rabbitmq队列中，更新用户最后一次发布机器人时间
```
rabbitTemplate.convertAndSend(
    USER_COUNT_DIRECT_EXCHANGE, USER_BOT_INFO_ROUTE_KEY,“”“ {"userId": 1,"lastReleaseBotAt": "2023-12-27 08:00:00","bots":[{"id":1,"avatar":"http://xxxx.jpg"},{"id":2,"avatar":"http://xxxx.jpg"}],"updateAt":"2023-12-27 08:00:00"}“”“
)
//参数说明：
//userId：用户id
//lastReleaseBotAt：最后一次发布机器人时间
//updateAt：更新时间
//bots:该用户最新发布的机器人list，数量超过4个，则只需要查询4个就行了
```
user-service监听：
```
    @RabbitHandler
    @RabbitListener(queues = [USER_BOT_INFO_QUEUE])
    fun userBotCountReceiver(msg: String) {
            //逻辑处理
    }
``` PUT /bot/app/bot/${param0}/release */
export async function putBotAppBotIdRelease(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putBotAppBotIdReleaseParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(
    `/bot/app/bot/${param0}/release`,
    {
      method: 'PUT',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 获取角色职业集合 GET /bot/app/profession */
export async function getBotAppProfession(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppProfessionParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      total: number;
      pageNum: number;
      pageSize: number;
      pages: number;
      list: { id: number; profession: string }[];
    };
  }>('/bot/app/profession', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 回答规则集合 GET /bot/app/rules */
export async function getBotAppRules(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotAppRulesParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      total: number;
      pageNum: number;
      pageSize: number;
      pages: number;
      list: { key: string; rule: string }[];
    };
  }>('/bot/app/rules', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

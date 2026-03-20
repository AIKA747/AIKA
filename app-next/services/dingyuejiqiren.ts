// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 取消订阅机器人 机器人被取消订阅后发送下列消息到rabbitmq队列中，更新当前用户订阅机器人数量
```
rabbitTemplate.convertAndSend(
    USER_COUNT_DIRECT_EXCHANGE, USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY,“”“ {"userId": 1,"count": 1,"updateAt":"2023-12-27 08:00:00"}“”“
)
//参数说明：
//userId：用户id
//count：用户订阅机器人数量（当前服务查询）
//updateAt：查询用户订阅机器人数量更新时间
```
user-service监听：
```
    @RabbitHandler
    @RabbitListener(queues = [USER_SUBSCRIPT_BOT_COUNT_QUEUE])
    fun userSubscriptBotCountReceiver(msg: String) {
            //更新用户订阅机器人数量，记录一下updateAt，需根据updateAt做一下判断，仅更新比最后一条消息时间晚的数据
    }
``` DELETE /bot/app/bot/${param0}/unsubscribe */
export async function deleteBotAppBotIdUnsubscribe(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotAppBotIdUnsubscribeParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(`/bot/app/bot/${param0}/unsubscribe`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 订阅机器人 机器人被订阅后发送下列消息到rabbitmq队列中，更新当前用户订阅机器人数量
```
rabbitTemplate.convertAndSend(
    USER_COUNT_DIRECT_EXCHANGE, USER_SUBSCRIPT_BOT_COUNT_ROUTE_KEY,“”“ {"userId": 1,"count": 1,"updateAt":"2023-12-27 08:00:00"}“”“
)
//参数说明：
//userId：用户id
//count：用户订阅机器人数量（当前服务查询）
//updateAt：查询用户订阅机器人数量更新时间
```
user-service监听：
```
    @RabbitHandler
    @RabbitListener(queues = [USER_SUBSCRIPT_BOT_COUNT_QUEUE])
    fun userSubscriptBotCountReceiver(msg: String) {
            //更新用户订阅机器人数量，记录一下updateAt，需根据updateAt做一下判断，仅更新比最后一条消息时间晚的数据
    }
``` POST /bot/app/subscription */
export async function postBotAppSubscription(
  body: {
    /** 机器人id */
    botId: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>('/bot/app/subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

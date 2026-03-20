// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发起苹果内购支付 内购流程图：

![20191111113502479.png](https://api.apifox.cn/api/v1/projects/3612779/resources/430783/image-preview) POST /order/app/in-app-purchase */
export async function postOrderAppInAppPurchase(
  body: {
    /** 订单号 */
    orderNo: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { payNo: string; productId: string };
  }>('/order/app/in-app-purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 苹果内购支付后支付结果校验 POST /order/app/in-app-purchase/check */
export async function postOrderAppInAppPurchaseCheck(
  body: {
    /** app支付后获取到的交易凭证 */
    receipt: string;
    /** 支付单号 */
    payNo: string;
    transactionId: string;
    /** 是否沙箱支付，默认false */
    test?: boolean;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      payMethod: string;
      type: string;
      amount: number;
      payNo: string;
      orderNo: string;
      status: string;
      reason: string;
      refundNo: string;
      payTime: string;
      callbackTime: string;
      creditCard: string;
      createdAt: string;
    };
  }>('/order/app/in-app-purchase/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

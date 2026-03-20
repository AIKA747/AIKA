// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 发起google内购支付 内购流程图：

![20191111113502479.png](https://api.apifox.cn/api/v1/projects/3612779/resources/430783/image-preview) POST /order/app/google/in-app-purchase */
export async function postOrderAppGoogleInAppPurchase(
  body: {
    /** 订单号 */
    orderNo: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: { payNo: string; productId: string } }>(
    '/order/app/google/in-app-purchase',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** google内购订单校验 POST /order/app/google/in-app-purchase/check */
export async function postOrderAppGoogleInAppPurchaseCheck(
  body: {
    packageName: string;
    productId: string;
    purchaseToken: string;
    /** 发起支付时返回的支付单号 */
    payNo: string;
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
  }>('/order/app/google/in-app-purchase/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发起stripe支付 stripe收款文档请求参考：https://stripe.com/docs/payments/accept-a-payment?platform=ios&ui=payment-sheet POST /order/app/payment/stripe/create-payment-intent */
export async function postOrderAppPaymentStripeCreatePaymentIntent(
  body: {
    /** 订单号 */
    orderNo: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      'customerId ': string;
      ephemeralKey: string;
      clientSecret: string;
      publishableKey: string;
    };
  }>('/order/app/payment/stripe/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** stripe事件通知 GET /order/public/payment/stripe/webhook */
export async function getOrderPublicPaymentStripeWebhook(
  body: string,
  options?: { [key: string]: any },
) {
  return request<string>('/order/public/payment/stripe/webhook', {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    },
    data: body,
    ...(options || {}),
  });
}

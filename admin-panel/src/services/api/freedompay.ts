// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发起支付获取支付页面链接 POST /order/app/payment/freedompay/init-payment */
export async function postOrderAppPaymentFreedompayInitPayment(
  body: {
    /** 订单号 */
    orderNo: string;
    /** 客户端支付成功后跳转的页面 */
    successUrl?: string;
    /** 客户端支付失败后跳转的页面 */
    failureUrl?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      pg_redirect_url_type: string;
      pg_payment_id: string;
      pg_salt: string;
      pg_redirect_url: string;
      pg_status: string;
      pg_sig: string;
    };
  }>('/order/app/payment/freedompay/init-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

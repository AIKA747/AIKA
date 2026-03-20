// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** 支付后门接口 POST /order/app/payment */
export async function postOrderAppPayment(
  body: {
    /** 订单号 */
    orderNo: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/order/app/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 支付历史记录 GET /order/app/payment/history */
export async function getOrderAppPaymentHistory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderAppPaymentHistoryParams,
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
      list: {
        payMethod: string;
        amount: number;
        payTime: string;
        expiredAt: string;
        refundNo?: string;
        orderNo: string;
        packageId: string;
        packageName: string;
      }[];
    };
  }>('/order/app/payment/history', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 支付结果查询 GET /order/app/payment/result */
export async function getOrderAppPaymentResult(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderAppPaymentResultParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      payMethod: string;
      amount: number;
      payNo: string;
      orderNo: string;
      status: string;
      refundNo: string;
      callbackTime: string;
      creditCard: string;
      createdAt: string;
    };
  }>('/order/app/payment/result', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询总金额 GET /order/app/payment/total-amount */
export async function getOrderAppPaymentTotalAmount(options?: { [key: string]: any }) {
  return request<{ code: number; msg: string; data: number }>('/order/app/payment/total-amount', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 下订单 POST /order/app/place-order */
export async function postOrderAppPlaceOrder(
  body: {
    /** 服务包id */
    packageId: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      orderNo: string;
      userId: string;
      username: string;
      phone: string;
      email: string;
      amount: number;
      packageId: string;
      packageName: string;
      status: string;
      callbackAt: string;
      cancelAt: string;
      expiredAt: string;
      country: string;
      createdAt: string;
      updatedAt: string;
      dataVersion: number;
      deleted: boolean;
    };
  }>('/order/app/place-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 服务包列表 GET /order/app/service-packages */
export async function getOrderAppServicePackages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderAppServicePackagesParams,
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
      list: {
        id: string;
        packageName: string;
        subPeriod: number;
        price: number;
        cover: string;
        description: string;
        createdAt: string;
        purchaseLimit?: number;
        purchaseNum?: number;
      }[];
    };
  }>('/order/app/service-packages', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取用户订阅过期时间 GET /order/app/subscription/expired-time */
export async function getOrderAppSubscriptionExpiredTime(options?: { [key: string]: any }) {
  return request<{ code: number; msg: string; data?: string }>('/order/app/subscription/expired-time', {
    method: 'GET',
    ...(options || {}),
  });
}

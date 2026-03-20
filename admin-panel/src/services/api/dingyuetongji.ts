// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 周新订阅 GET /admin/analytics/new-subcribers/week */
export async function getAdminAnalyticsNewSubcribersWeek(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: {
      newSubscribers: number;
      wowChange: string;
      dailyNewSubscribers: number;
      dodChange: string;
    };
  }>('/admin/analytics/new-subcribers/week', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 月订阅 GET /admin/analytics/new-subscribers/month */
export async function getAdminAnalyticsNewSubscribersMonth(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: {
      newSubscribers: number;
      momChange: string;
      monthlyNewSubscribers: number;
    };
  }>('/admin/analytics/new-subscribers/month', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 订阅者数量统计 GET /admin/analytics/subscribers/num */
export async function getAdminAnalyticsSubscribersNum(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: {
      totalUsers: number;
      totalSubscribers: number;
      upcomingExpiringSubscribers: number;
      totalExpiredSubscribers: number;
      totalWowChange: string;
      totalDodChange: string;
    };
  }>('/admin/analytics/subscribers/num', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 订阅者数量统计排名 GET /admin/country/subscriber-count-ranking */
export async function getAdminCountrySubscriberCountRanking(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminCountrySubscriberCountRankingParams,
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
      list: { country: string; data: number }[];
    };
  }>('/admin/country/subscriber-count-ranking', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 过期订阅者折线图 GET /admin/expired-subscribers/line-chart */
export async function getAdminExpiredSubscribersLineChart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminExpiredSubscribersLineChartParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { numYaxis: string; dateXaxis: string }[];
  }>('/admin/expired-subscribers/line-chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新订阅者折线图 GET /admin/new-subscribers/line-chart */
export async function getAdminNewSubscribersLineChart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminNewSubscribersLineChartParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { numYaxis: string; dateXaxis: string }[];
  }>('/admin/new-subscribers/line-chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 总订阅者折线图 GET /admin/total-subscribers/line-chart */
export async function getAdminTotalSubscribersLineChart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminTotalSubscribersLineChartParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { numYaxis: string; dateXaxis: string }[];
  }>('/admin/total-subscribers/line-chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

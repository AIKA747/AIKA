// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 月收入统计 GET /admin/analytics/income/month */
export async function getAdminAnalyticsIncomeMonth(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: { income: number; momChange: string; monthlyIncome: string };
  }>('/admin/analytics/income/month', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 周收入统计 GET /admin/analytics/income/week */
export async function getAdminAnalyticsIncomeWeek(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: { income: number; wowChange: string; dailyIncome: string };
  }>('/admin/analytics/income/week', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 年收入统计 GET /admin/analytics/income/year */
export async function getAdminAnalyticsIncomeYear(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: { income: number; yoyChange: string; annualIncome: number };
  }>('/admin/analytics/income/year', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 收入统计排名 GET /admin/country/income-ranking */
export async function getAdminCountryIncomeRanking(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminCountryIncomeRankingParams,
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
  }>('/admin/country/income-ranking', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 日收入折线图 GET /admin/daily-income/line-chart */
export async function getAdminDailyIncomeLineChart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminDailyIncomeLineChartParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { numYaxis: string; dateXaxis: string }[];
  }>('/admin/daily-income/line-chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 总收入折线图 GET /admin/total-income/line-chart */
export async function getAdminTotalIncomeLineChart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminTotalIncomeLineChartParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { numYaxis: string; dateXaxis: string }[];
  }>('/admin/total-income/line-chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

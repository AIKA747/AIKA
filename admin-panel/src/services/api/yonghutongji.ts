// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 活跃用户折线图 GET /admin/active-users/line-chart */
export async function getAdminActiveUsersLineChart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminActiveUsersLineChartParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { numYaxis: string; dateXaxis: string }[];
  }>('/admin/active-users/line-chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 活跃用户统计 周同比：如：今天15日，8-14日总数/1-7日总数
日同比：昨天/前天

若没有那么多天的数据，则默认为100% GET /admin/analytics/today/active-users */
export async function getAdminAnalyticsTodayActiveUsers(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: {
      activeUsers: number;
      dailyActiveUsers: number;
      dodChange: string;
      wowChange: string;
    };
  }>('/admin/analytics/today/active-users', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 不活跃用户统计 周同比：如：今天15日，14日/7日
日同比：昨天/前天

若没有那么多天的数据，则默认为100% GET /admin/analytics/today/inactive-users */
export async function getAdminAnalyticsTodayInactiveUsers(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: {
      inactiveUsers: number;
      dailyInactiveUsers: number;
      dodChange: string;
      wowChange: string;
    };
  }>('/admin/analytics/today/inactive-users', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新用户统计 周同比：如：今天15日，8-14日总数/1-7日总数
日同比：昨天/前天

若没有那么多天的数据，则默认为100% GET /admin/analytics/today/new-users */
export async function getAdminAnalyticsTodayNewUsers(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: {
      newUsers: number;
      dailyNewUsers: number;
      dodChange: string;
      wowChange: string;
    };
  }>('/admin/analytics/today/new-users', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 总用户统计 周同比：如：今天15日，14日/7日
日同比：昨天/前天

没那么多天的数据，则默认为100% GET /admin/analytics/today/total-users */
export async function getAdminAnalyticsTodayTotalUsers(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: {
      totalUsers: number;
      totalSubscribers: number;
      dodChange: string;
      wowChange: string;
    };
  }>('/admin/analytics/today/total-users', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 用户数量统计排名 GET /admin/country/user-count-ranking */
export async function getAdminCountryUserCountRanking(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminCountryUserCountRankingParams,
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
  }>('/admin/country/user-count-ranking', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 不活跃用户折线图 GET /admin/inactive-users/line-chart */
export async function getAdminInactiveUsersLineChart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminInactiveUsersLineChartParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { numYaxis: string; dateXaxis: string }[];
  }>('/admin/inactive-users/line-chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增用户折线图 GET /admin/new-users/line-chart */
export async function getAdminNewUsersLineChart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminNewUsersLineChartParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { numYaxis: string; dateXaxis: string }[];
  }>('/admin/new-users/line-chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 总用户数折线图 GET /admin/total-users/line-chart */
export async function getAdminTotalUsersLineChart(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminTotalUsersLineChartParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { numYaxis: string; dateXaxis: string }[];
  }>('/admin/total-users/line-chart', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 帖子举报列表 GET /content/manage/post-reports */
export async function getContentManagePostReports(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManagePostReportsParams,
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
        id: number;
        reportId: number;
        postId: number;
        createdAt: string;
        postAuthorName: string;
        postAuthorAvatar?: string;
        authorName: string;
        authorAvatar?: string;
      }[];
    };
  }>('/content/manage/post-reports', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 举报分类列表 GET /content/manage/report-list */
export async function getContentManageReportList(options?: {
  [key: string]: any;
}) {
  return request<{
    code: number;
    msg: string;
    data: { id: number; title: string; description: string }[];
  }>('/content/manage/report-list', {
    method: 'GET',
    ...(options || {}),
  });
}

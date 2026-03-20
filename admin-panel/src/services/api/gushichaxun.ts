// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 故事列表(改） 获得当前的故事列表 GET /content/app/story */
export async function getContentAppStory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppStoryParams,
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
        storyName: string;
        rewardsScore: number;
        locked: boolean;
        gender: string;
        image: string;
        introduction: string;
        listCover: string;
        listCoverDark: string;
        storyProcess: number;
        status: string;
        collected: boolean;
      }[];
    };
  }>('/content/app/story', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 故事详情（改） 故事详情 GET /content/app/story/${param0} */
export async function getContentAppStoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppStoryIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      storyName: string;
      rewardsScore: number;
      cutoffScore: number;
      gender: string;
      image: string;
      introduction: string;
      cover: string;
      coverDark: string;
      unlocked: boolean;
      chapterId: string;
      status: string;
      collected: boolean;
      passedCopywriting: string;
      passedPicture: string;
      failureCopywriting: string;
      failurePicture: string;
      chapterName: string;
      backgroundPicture: string;
      backgroundPictureDark: string;
      friendDegree: number;
      chapterProcess: number;
      storyProcess: number;
      category: { id: string; name: string }[];
    };
  }>(`/content/app/story/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查看过关/失败的信息 获得当前章节的通关状态。当收到通关或者失败的消息以后，访问此接口，从而获得通关信息。 GET /content/app/story/${param0}/chapter */
export async function getContentAppStoryIdChapter(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppStoryIdChapterParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: API.ChapterPassDto }>(
    `/content/app/story/${param0}/chapter`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 获得用户收藏的故事 GET /content/app/user-collect-story */
export async function getContentAppUserCollectStory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppUserCollectStoryParams,
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
      list: API.StoryListDto[];
    };
  }>('/content/app/user-collect-story', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建收藏 POST /content/app/user-collect-story */
export async function postContentAppUserCollectStory(
  body: {
    /** 故事id */
    storyId: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: { id: number } }>(
    '/content/app/user-collect-story',
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

/** 取消收藏 用户取消对某个故事的收藏 DELETE /content/app/user-collect-story/${param0} */
export async function deleteContentAppUserCollectStoryStoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteContentAppUserCollectStoryStoryIdParams,
  options?: { [key: string]: any },
) {
  const { storyId: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(
    `/content/app/user-collect-story/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

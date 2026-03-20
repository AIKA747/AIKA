// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获得当前章节的礼物 GET /content/app/gift */
export async function getContentAppGift(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppGiftParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      code: number;
      msg: string;
      total: number;
      pageNum: number;
      pageSize: number;
      pages: number;
      list: { id?: string; giftName?: string; image?: string }[];
    };
  }>('/content/app/gift', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 开始一个新的故事对话 删除原来的故事会话记录，重新开始对话 POST /content/app/story-recorder */
export async function postContentAppStoryRecorder(
  body: {
    storyId: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: API.ChapterPassDto }>(
    '/content/app/story-recorder',
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

/** 故事聊天的消息记录 该接口排序，按照消息记录的时间，越新越靠前 进行排序

查询当前登录用户与传入的botId之间的聊天记录 GET /content/app/story/chat-record */
export async function getContentAppStoryChatRecord(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentAppStoryChatRecordParams,
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
        objectId: string;
        contentType: string;
        json?: string;
        media?: string;
        textContent?: string;
        sourceType: string;
        userId: string;
        msgStatus: string;
        readFlag: boolean;
        readTime: string;
        replyMessageId: string;
        createdAt: string;
        msgId: string;
        fileProperty: string;
        videoUrl: string;
        videoStatus: string;
        digitHuman: boolean;
        badAnswer: boolean;
        gameStatus: string;
        storyRecorderId: string;
        chapterId: string;
      }[];
    };
  }>('/content/app/story/chat-record', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 章节列表 GET /content/manage/chapter */
export async function getContentManageChapter(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManageChapterParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      list: {
        id?: number;
        storyId?: number;
        chapterName?: string;
        chapterOrder?: number;
        cover?: string;
        listCover?: string;
        image?: string;
        personality?: string;
        summary: string;
        introduction?: string;
        passedCopywriting?: string;
        passedPicture?: string;
        backgroundPrompt?: string;
        tonePrompt?: string;
        wordNumberPrompt?: 'short' | 'normal' | 'detail';
        chapterScore?: number;
        chapterRule: {
          key: string;
          rule: {
            question: string;
            recommendAnswer: string;
            weight: number;
            friendDegree: number;
            storyDegree: number;
          }[];
        };
        createdAt?: string;
        updatedAt?: string;
        dataVersion?: string;
        deleted?: number;
        creator?: number;
        chapterGifts: API.gift[];
      }[];
    };
  }>('/content/manage/chapter', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改章节 PUT /content/manage/chapter */
export async function putContentManageChapter(
  body: {
    /** 主键id */
    id: number;
    /** 章节名称，非必填 */
    chapterName: string;
    /** 章节顺序，从1开始。 */
    chapterOrder: number;
    /** 章节封面 */
    cover: string;
    /** 章节封面dark模式 */
    coverDark: string;
    /** 列表显示的封面 */
    listCover: string;
    /** 列表显示的封面dark模式 */
    listCoverDark: string;
    /** 此阶段的形象 */
    image: string;
    /** 描述个性的Prompt */
    personality: string;
    /** 章节情节说明 */
    introduction: string;
    /** 通关文案 */
    passedCopywriting: string;
    /** 通关图片 */
    passedPicture: string;
    /** 背景介绍提示词 */
    backgroundPrompt: string;
    /** 回答语气限定提示词 */
    tonePrompt: string;
    /** 字数限制提示词：short简短回答（20字以内） normal普通篇幅（20-50）detail详细回答（50-100） */
    wordNumberPrompt: string;
    /** 本章目标分 */
    chapterScore: number;
    /** 章节游戏规则 */
    chapterRule: {
      key: string;
      rule: {
        question: string;
        RecommendAnswer: string;
        weight: number;
        friendDegree: number;
        storyDegree: number;
      };
    }[];
    /** 章节聊天分钟数 */
    chatMinutes?: number;
    /** 章节任务信息 */
    taskIntroduction: string;
    /** 背景图片 */
    backgroundPicture: string;
    /** 背景图片dark模式 */
    backgroundPictureDark: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/content/manage/chapter', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建章节 POST /content/manage/chapter */
export async function postContentManageChapter(
  body: {
    storyId: string;
    /** 章节名称，非必填 */
    chapterName: string;
    /** 章节顺序，从1开始。 */
    chapterOrder: number;
    /** 章节封面 */
    cover: string;
    /** 章节封面dark */
    coverDark: string;
    /** 列表显示的封面 */
    listCover: string;
    /** 列表显示的封面dark模式 */
    listCoverDark: string;
    /** 此阶段的形象 */
    image: string;
    /** 描述个性的Prompt */
    personality: string;
    /** 章节情节说明 */
    introduction: string;
    /** 通关文案 */
    passedCopywriting: string;
    /** 通关图片 */
    passedPicture: string;
    /** 背景介绍提示词 */
    backgroundPrompt: string;
    /** 回答语气限定提示词 */
    tonePrompt: string;
    /** 字数限制提示词：short简短回答（20字以内） normal普通篇幅（20-50）detail详细回答（50-100） */
    wordNumberPrompt: string;
    /** 本章目标分 */
    chapterScore: number;
    /** 章节游戏规则 */
    chapterRule: {
      key: string;
      rule: {
        question: string;
        RecommendAnswer: string;
        weight: number;
        friendDegree: number;
        storyDegree: number;
      };
    }[];
    /** 章节聊天分钟数 */
    chatMinutes?: number;
    /** 章节任务信息 */
    taskIntroduction: string;
    /** 背景图片 */
    backgroundPicture: string;
    /** 背景图片dark模式 */
    backgroundPictureDark: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: {
        storyId: number;
        chapterName: string;
        chapterOrder: number;
        cover: string;
        listCover: string;
        image: string;
        personality: string;
        introduction: string;
        passedCopywriting: string;
        passedPicture: string;
        backgroundPrompt: string;
        tonePrompt: string;
        wordNumberPrompt: string;
        chapterScore: number;
        chapterRule: {
          key?: string;
          rule: {
            question: string;
            recommendAnswer: string;
            weight: number;
            friendDegree: number;
            storyDegree: number;
          };
        }[];
      };
      storyId: number;
      chapterName: string;
      chapterOrder: number;
      cover: string;
      listCover: string;
      image: string;
      personality: string;
      introduction: string;
      passedCopywriting: string;
      passedPicture: string;
      backgroundPrompt: string;
      tonePrompt: string;
      wordNumberPrompt: string;
      chapterScore: number;
      chapterRule: {
        key?: string;
        rule: {
          question: string;
          recommendAnswer: string;
          weight: number;
          friendDegree: number;
          storyDegree: number;
        };
      }[];
    };
  }>('/content/manage/chapter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 章节详情 GET /content/manage/chapter/${param0} */
export async function getContentManageChapterId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManageChapterIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      storyId: number;
      chapterName: string;
      chapterOrder: number;
      cover: string;
      coverDark: string;
      listCover: string;
      listCoverDark: string;
      image: string;
      personality: string;
      introduction: string;
      passedCopywriting: string;
      backgroundPrompt: string;
      tonePrompt: string;
      wordNumberPrompt: string;
      chapterScore: number;
      chatMinutes: number;
      taskIntroduction: string;
      backgroundPicture: string;
      backgroundPictureDark: string;
      chapterRule: {
        key?: string;
        rule: {
          question: string;
          recommendAnswer: string;
          weight: number;
          friendDegree: number;
          storyDegree: number;
        };
      }[];
      createdAt: string;
      updatedAt: string;
      dataVersion: string;
      deleted: number;
      creator: number;
      passedPicture: string;
    };
  }>(`/content/manage/chapter/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除章节 DELETE /content/manage/chapter/${param0} */
export async function deleteContentManageChapterId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteContentManageChapterIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/content/manage/chapter/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 修改章节顺序 PUT /content/manage/chapter/order */
export async function putContentManageChapterOrder(
  body: { id: number; order: number }[],
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data?: string }>(
    '/content/manage/chapter/order',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 礼物列表接口 如果没有storyId和chapterId，则筛选全局；有storyId，筛选storyId满足条件，且chapterId为空的（故事级）；有chapterId，则按chapterId筛选。（章节级） GET /content/manage/gift */
export async function getContentManageGift(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManageGiftParams,
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
      list: API.gift[];
    };
  }>('/content/manage/gift', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改礼物 PUT /content/manage/gift */
export async function putContentManageGift(
  body: {
    id: number;
    /** 礼物名称 */
    giftName: string;
    /** 每个礼物增加的友好分 */
    friendDegree: number;
    /** 每个礼物增加的情节分 */
    storyDegree: number;
    /** 故事id，可以为空，为空表示全局通用 */
    storyId?: number;
    /** 章节id，可以为空，为空表示故事通用 */
    chapterId?: number;
    image: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: API.gift }>(
    '/content/manage/gift',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 新建礼物 POST /content/manage/gift */
export async function postContentManageGift(
  body: {
    /** 礼物名称 */
    giftName: string;
    /** 每个礼物增加的友好分，如不加分则为0 */
    friendDegree?: number;
    /** 每个礼物增加的情节分，如不加分则为0 */
    storyDegree?: number;
    /** 故事id，可以为空，为空表示全局通用 */
    storyId?: number;
    /** 章节id，可以为空，为空表示故事通用 */
    chapterId?: number;
    image: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: { id: number } }>(
    '/content/manage/gift',
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

/** 礼物详情 GET /content/manage/gift/${param0} */
export async function getContentManageGiftId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManageGiftIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: API.gift }>(
    `/content/manage/gift/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 删除礼物 DELETE /content/manage/gift/${param0} */
export async function deleteContentManageGiftId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteContentManageGiftIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data?: string }>(
    `/content/manage/gift/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 故事管理列表 GET /content/manage/story */
export async function getContentManageStory(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManageStoryParams,
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
        id?: number;
        storyName?: string;
        rewardsScore?: number;
        locked?: boolean;
        gender?: string;
        image?: string;
        introduction?: string;
        cover?: string;
        createdAt?: string;
        status?: 'valid' | 'invalid';
        cutoffScore?: number;
      }[];
    };
  }>('/content/manage/story', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改故事（改） PUT /content/manage/story */
export async function putContentManageStory(
  body: {
    /** 主键id */
    id: number;
    /** 故事名称 */
    storyName: string;
    /** 故事分值，赢得故事后获得此分值 */
    rewardsScore: number;
    /** 开启游戏的分值，只有获得超过这个分值才能玩这个游戏 */
    cutoffScore: number;
    /** 故事角色性别 */
    gender: string;
    /** 默认形象 */
    defaultImage: string;
    /** 故事简介 */
    introduction: string;
    /** 封面 */
    cover: string;
    /** 封面dark模式 */
    coverDark: string;
    /** 列表用的封面 */
    listCover: string;
    /** 列表用的封面dark模式 */
    listCoverDark: string;
    /** 故事失败的文案 */
    failureCopywriting: string;
    /** 故事失败的图片 */
    failurePicture: string;
    status: 'valid' | 'invalid';
    tags: string;
    /** 故事任务信息 */
    taskIntroduction?: string;
    /** 默认背景图片 */
    defaultBackgroundPicture: string;
    /** 默认背景图片dark模式 */
    defaultBackgroundPictureDark: string;
    categoryId: number[];
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: API.story }>(
    '/content/manage/story',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 新建故事（改） POST /content/manage/story */
export async function postContentManageStory(
  body: {
    /** 故事名称 */
    storyName: string;
    /** 故事分值，赢得故事后获得此分值 */
    rewardsScore: number;
    /** 封面 */
    cover: string;
    /** 封面dark模式 */
    coverDark: string;
    /** 开启游戏的分值，只有获得超过这个分值才能玩这个游戏 */
    cutoffScore: number;
    /** 故事角色性别 */
    gender: string;
    /** 默认形象 */
    defaultImage: string;
    /** 故事简介 */
    introduction: string;
    /** 列表显示的封面 */
    listCover: string;
    /** 列表显示的封面dark模式 */
    listCoverDark: string;
    /** 故事失败的文案 */
    failureCopywriting: string;
    /** 故事失败的图片 */
    failurePicture: string;
    tags?: string;
    /** 故事任务信息 */
    taskIntroduction: string;
    /** 默认背景图片 */
    defaultBackgroundPicture: string;
    /** 默认背景图片dark模式 */
    defaultBackgroundPictureDark: string;
    categoryId: number[];
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: string;
  }>('/content/manage/story', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 故事详情 GET /content/manage/story/${param0} */
export async function getContentManageStoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getContentManageStoryIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      storyName: string;
      rewardsScore: number;
      cutoffScore: number;
      gender: string;
      defaultImage: string;
      introduction: string;
      cover: string;
      coverDark: string;
      listCover: string;
      listCoverDark: string;
      failureCopywriting: string;
      failurePicture: string;
      status: 'valid' | 'invalid';
      updatedAt: string;
      createdAt: string;
      dataVersion: number;
      chapterScore: number;
      tags: { name: string; id: string }[];
      taskIntroduction: string;
      defaultBackgroundPicture: string;
      defaultBackgroundPictureDark: string;
      category: { name: string; id: number }[];
    };
  }>(`/content/manage/story/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除故事 DELETE /content/manage/story/${param0} */
export async function deleteContentManageStoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteContentManageStoryIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data?: string }>(
    `/content/manage/story/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 开始一个故事的preview POST /content/manage/story/preview */
export async function postContentManageStoryPreview(
  body: {
    /** 故事id */
    storyId: string;
    /** 章节id */
    chapterId: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/content/manage/story/preview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 设置故事发布状态 PUT /content/manage/story/status */
export async function putContentManageStoryStatus(
  body: {
    /** 故事id */
    id: number;
    status: 'valid' | 'invalid';
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/content/manage/story/status',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

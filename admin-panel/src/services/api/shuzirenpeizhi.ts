// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 设置空闲视频 PUT /bot/manage/assistant/digita-human/idle-animation */
export async function putBotManageAssistantDigitaHumanIdleAnimation(
  body: {
    /** 数字人配置id */
    profileId: string;
    /** 视频id */
    videoId: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>(
    '/bot/manage/assistant/digita-human/idle-animation',
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

/** 删除视频 DELETE /bot/manage/assistant/digita-human/video/${param0} */
export async function deleteBotManageAssistantDigitaHumanVideoVideoId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteBotManageAssistantDigitaHumanVideoVideoIdParams,
  options?: { [key: string]: any },
) {
  const { videoId: param0, ...queryParams } = params;
  return request<{ code: number; msg: string; data: string }>(
    `/bot/manage/assistant/digita-human/video/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 设置打招呼视频 PUT /bot/manage/assistant/digital-human/salutation */
export async function putBotManageAssistantDigitalHumanSalutation(
  body: {
    /** 数字人配置id */
    profileId: string;
    /** 视频id */
    videoId: string;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>(
    '/bot/manage/assistant/digital-human/salutation',
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

/** 数字人声音试听 POST /bot/manage/bot/digita-human/audition */
export async function postBotManageBotDigitaHumanAudition(
  body: {
    /** 试听文本 */
    text: string;
    /** 人物音色名称 */
    voiceName: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; data: string }>(
    '/bot/manage/bot/digita-human/audition',
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

/** 空闲动画生成 json配置请参考文档：https://docs.d-id.com/reference/createanimation POST /bot/manage/bot/digita-human/idle-animation */
export async function postBotManageBotDigitaHumanIdleAnimation(
  body: {
    /** 配置id */
    profileId: number;
    /** 动画视频参考视频链接 */
    driverUrl?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      created_at: string;
      created_by: string;
      status: string;
      object: string;
    };
  }>('/bot/manage/bot/digita-human/idle-animation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取空闲动画链接 status=done时表示视频生成完成，result_url属性为视频链接
 GET /bot/manage/bot/digita-human/idle-animation/${param0} */
export async function getBotManageBotDigitaHumanIdleAnimationId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageBotDigitaHumanIdleAnimationIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: { id: string; status: string; result_url: string };
  }>(`/bot/manage/bot/digita-human/idle-animation/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 打招呼视频生成 生成打招呼视频，参数请参考：https://docs.d-id.com/reference/createtalk
 POST /bot/manage/bot/digital-human/salutation */
export async function postBotManageBotDigitalHumanSalutation(
  body: {
    /** 语音文件路径 */
    audioUrl: string;
    /** 配置id */
    profileId: number;
    /** 数字人配置类型：bot、assistant */
    profileType: string;
    /** 音色名称 */
    voiceName: string;
    /** 文本内容 */
    content: string;
    /** 语言 */
    language: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: string;
      created_at: string;
      created_by: string;
      status: string;
      object: string;
    };
  }>('/bot/manage/bot/digital-human/salutation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取打招呼视频链接 status=done时表示视频生成完成，result_url属性为视频链接
 GET /bot/manage/bot/digital-human/salutation/${param0} */
export async function getBotManageBotDigitalHumanSalutationId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageBotDigitalHumanSalutationIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: { id: string; status: string; result_url: string };
  }>(`/bot/manage/bot/digital-human/salutation/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 视频记录列表 GET /bot/manage/bot/digital-human/video/records */
export async function getBotManageBotDigitalHumanVideoRecords(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageBotDigitalHumanVideoRecordsParams,
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
        botId: string;
        videoUrl: string;
        type: string;
        flag: number;
        createdAt: string;
        voiceName: string;
      }[];
    };
  }>('/bot/manage/bot/digital-human/video/records', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 数字人配置查询 GET /bot/manage/digita-human-profile */
export async function getBotManageDigitaHumanProfile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageDigitaHumanProfileParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      profileType: string;
      objectId: string;
      gender: string;
      sourceImage: string;
      expression: 'neutral' | 'happy' | 'surprise' | 'serious';
      intensity: number;
      language: { language: string; voice: string }[];
      greetVideoId: string;
      greetVideo: string;
      idleVideoId: string;
      idleVideo: string;
      voiceName: string;
    };
  }>('/bot/manage/digita-human-profile', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增/修改数字人配置 POST /bot/manage/digita-human-profile */
export async function postBotManageDigitaHumanProfile(
  body: {
    /** 配置id，新增配置该值为空 */
    id?: number;
    /** 数字人配置类型：bot、assistant */
    profileType: string;
    /** 机器人或助手id */
    objectId: string;
    gender: string;
    /** 数字人图片 */
    sourceImage: string;
    /** The expression to use */
    expression: string;
    /** Controls the intensity you want for this expression (between 0 no expression, 1 maximum) */
    intensity: number;
    /** 生成的欢迎视频Id */
    greetVideoId: string;
    greetVideo: string;
    /** 空闲时待机视频id */
    idleVideoId: string;
    idleVideo: string;
    /** 生成数字人设置的音色 */
    voiceName: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      profileType: string;
      objectId: string;
      gender: string;
      sourceImage: string;
      expression: string;
      intensity: number;
      language: { language: string; voice: string }[];
      greetVideoId: string;
      greetVideo: string;
      idleVideoId: string;
      idleVideo: string;
      voiceName: string;
    };
  }>('/bot/manage/digita-human-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 语言列表 GET /bot/manage/tts/language */
export async function getBotManageTtsLanguage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageTtsLanguageParams,
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
      list: { language: string }[];
    };
  }>('/bot/manage/tts/language', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 指定语言的音色列表 GET /bot/manage/tts/language/voices */
export async function getBotManageTtsLanguageVoices(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageTtsLanguageVoicesParams,
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
      list: { voiceName: string; gender: 'male' | 'femal' }[];
    };
  }>('/bot/manage/tts/language/voices', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** openai的音色列表-new GET /bot/manage/tts/voices */
export async function getBotManageTtsVoices(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBotManageTtsVoicesParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: { voiceName: string; gender: string }[];
  }>('/bot/manage/tts/voices', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

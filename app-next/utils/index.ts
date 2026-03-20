import dayjs, { OpUnitType, QUnitType } from 'dayjs';

import { getIntl } from '@/hooks/useLocale';
import { DefaultLocal } from '@/hooks/useLocale/constants';

export const capitalizeFirstLetter = (str: string) => {
  return str.replace(/^./, (match) => match.toUpperCase());
};
export const capitalizeEachWord = (str: string) => {
  return str
    .split(' ') // 按空格分割为单词数组
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // 每个单词首字母大写
    .join(' '); // 重新拼接为字符串
};

export const formatToRelativeDay = (date: string) => {
  const intl = getIntl();
  const diffDays = dayjs().startOf('days').diff(dayjs(date).startOf('days'), 'days');

  if (diffDays === 0) {
    return intl.formatMessage({ id: 'Today' });
  } else if (diffDays === 1) {
    return intl.formatMessage({ id: 'Notifications.yesterday' });
  } else {
    return `${diffDays} ${intl.formatMessage({ id: 'passTime.days' })} ${intl.formatMessage({ id: 'passTime.ago' })}`;
  }
};

export const capitalizeFirstLetterAndLowerRest = (str?: string | null): string => {
  if (!str) {
    return ''; // 如果字符串为空、null 或 undefined，返回空字符串
  }

  const trimmedStr = str.trim(); // 去除首尾空格
  if (trimmedStr.length === 0) {
    return trimmedStr; // 如果去除空格后为空，直接返回
  }

  const firstChar = trimmedStr.charAt(0);
  const restOfString = trimmedStr.slice(1);

  // 检查第一个字符是否为字母，如果不是则保持原样
  const capitalizedFirstChar = /[A-Za-z]/.test(firstChar) ? firstChar.toUpperCase() : firstChar;
  // 将其余部分转换为小写
  const lowerCaseRest = restOfString.toLowerCase();

  return capitalizedFirstChar + lowerCaseRest;
};

/**
 * 自定义相对时间格式
 * @param date
 * @param options
 */
export const customFromNow = (
  date: dayjs.ConfigType,
  { locale = DefaultLocal, localeSuffix }: { locale?: FormatjsIntl.IntlConfig['locale']; localeSuffix?: string },
) => {
  const now = dayjs();
  const target = dayjs(date);
  const diffSeconds = now.diff(target, 'second');
  // 创建多语言映射
  const localeMap: Record<
    FormatjsIntl.IntlConfig['locale'],
    { y: string; m: string; d: string; h: string; min: string }
  > = {
    en: { y: 'y', m: 'm', d: 'd', h: 'h', min: 'min' },
    fr: {
      y: 'a', // année (年)的缩写，法语中表示"年"
      m: 'm', // mois (月) 的缩写，与英语相同
      d: 'j', // jour (日) 的缩写，法语中表示"日"
      h: 'h', // heure (小时) 的缩写，与英语相同
      min: 'min', // minute (分钟) 的缩写，与英语相同
    },
    ja: { y: 'y', m: 'm', d: 'd', h: 'h', min: 'min' },
    kk: { y: 'y', m: 'm', d: 'k', h: 'h', min: 'min' },
    ko: { y: 'y', m: 'm', d: 'd', h: 'h', min: 'min' },
    ru: { y: 'y', m: 'm', d: 'д', h: 'ч', min: 'мин' },
    zh: { y: '年', m: '月', d: '天', h: '小时', min: '分钟' },
  };
  // 定义时间单位和阈值
  const thresholds: {
    unit: QUnitType | OpUnitType;
    seconds: number;
    suffix: keyof typeof localeMap.en;
  }[] = [
    { unit: 'year', seconds: 31536000, suffix: 'y' },
    { unit: 'month', seconds: 2592000, suffix: 'm' }, // 按30天计算
    { unit: 'day', seconds: 86400, suffix: 'd' },
    { unit: 'hour', seconds: 3600, suffix: 'h' },
  ];

  const suffixes = localeMap[locale];
  // 查找最大匹配单位
  for (const { unit, suffix } of thresholds) {
    const diff = Math.abs(now.diff(target, unit));
    if (diff >= 1) {
      const times = [` ${Math.floor(diff)} ${suffixes[suffix]}`, `${localeSuffix ? ` ${localeSuffix}` : ''}`];
      if (locale === 'fr') {
        times.reverse();
      }
      return times.join('');
    }
  }

  // 小于1小时显示分钟
  const times = [` ${Math.floor(diffSeconds / 60)} ${suffixes['min']}`, `${localeSuffix ? ` ${localeSuffix}` : ''}`];
  if (locale === 'fr') {
    times.reverse();
  }
  return times.join('');
};

/**
 * 解析关键字
 * @param str
 * @param keyword
 */
export const resolveKeywords = (str: string, keyword: string) => {
  const re = [];
  while (str.length) {
    const index = str.indexOf(keyword);
    if (index !== -1) {
      if (index !== 0) {
        // 不是开头就匹配上关键词,要把没匹配上的拿出来，比如  "iloveyou" "love" => ["i","love", "you"]
        re.push(str.slice(0, index));
      }
      re.push(str.slice(index, index + keyword.length)); // 把关键词截取出来
      str = str.slice(index + keyword.length); // 截取到末尾
    } else {
      re.push(str);
      break;
    }
  }
  return re;
};

/**
 * 将字节数转换为 MB
 * @param bytes 字节数
 * @param decimals 保留小数位数（默认 2）
 * @returns 转换后的 MB 数字
 */
export function bytesToMB(bytes: number, decimals: number = 2): number {
  if (bytes <= 0 || isNaN(bytes)) return 0;
  const MB = 1024 * 1024;
  return parseFloat((bytes / MB).toFixed(decimals));
}

/**
 * 使用正则表达式将视频URL从带格式后缀的格式转换为标准格式
 * @param url 原始视频URL
 * @returns 转换后的视频URL
 */
export function convertVideoUrlRegex(url: string): string {
  // 验证URL格式
  if (!url || typeof url !== 'string') {
    throw new Error('无效的URL输入');
  }

  // 使用正则表达式匹配模式：下划线 + 字母数字组合 + .mp4
  const pattern = /_([a-zA-Z0-9]+)\.mp4$/;

  // 执行匹配
  const match = url.match(pattern);

  if (match) {
    // 提取格式部分并替换
    const format = match[1];
    return url.replace(pattern, `.${format}`);
  }

  // 如果没有匹配，返回原始URL
  console.warn('URL格式不符合预期，无法转换:', url);
  return url;
}

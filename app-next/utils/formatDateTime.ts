import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/ja';
import 'dayjs/locale/ko';
import 'dayjs/locale/ru';
import 'dayjs/locale/kk';
import { getIntl } from '@/hooks/useLocale';
import { capitalizeFirstLetter } from '@/utils/index';

const locales = {
  en: 'en',
  fr: 'fr',
  zh: 'zh-cn',
  ja: 'ja',
  ko: 'ko',
  ru: 'ru',
  kk: 'kk',
} as const;

dayjs.extend(relativeTime);

export function formatDateTime(previousDate: string | undefined) {
  if (!previousDate) return '';
  const intl = getIntl();
  dayjs.locale(locales[intl.locale]);

  const now = dayjs();
  const prev = dayjs(previousDate);

  // 计算时间差（分钟）
  const diffMinutes = now.diff(prev, 'minute');

  // 规则1: 超过24小时但不足48小时 - 显示"昨天"
  if (diffMinutes >= 24 * 60 && diffMinutes < 48 * 60) {
    return intl.formatMessage({ id: 'Notifications.yesterday' });
  }

  // 规则2: 超过48小时但不足7天 - 显示星期几
  if (diffMinutes >= 48 * 60 && diffMinutes < 7 * 24 * 60) {
    return capitalizeFirstLetter(
      prev.format(intl.locale === 'ru' ? 'dd' : intl.locale === 'ja' ? 'dddd' : 'ddd'),
    ).replace('.', '');
  }

  // 规则3: 超过7天 - 显示完整日期
  if (diffMinutes >= 7 * 24 * 60) {
    return prev.format('DD.MM.YYYY');
  }
  // 默认处理（不足24小时）
  return prev.format('HH:mm');
}
export const formatMilliseconds = (ms: number): string => {
  // 将毫秒转换为秒
  const totalSeconds = Math.floor(ms / 1000);

  // 计算分钟和秒
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // 格式化为两位数
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
};

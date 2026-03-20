import en from './en';
import fr from './fr';
import ja from './ja';
import kk from './kk';
import ko from './ko';
import ru from './ru';
import zh from './zh';

export const messageMap: Record<FormatjsIntl.IntlConfig['locale'], typeof en> = {
  en,
  fr: fr as typeof en,
  ja: ja as typeof en,
  kk: kk as typeof en,
  ko: ko as typeof en,
  ru: ru as typeof en,
  zh: zh as typeof en,
};

// 英语、俄语、日语、韩语、中文、哈萨克语
// https://baike.baidu.com/item/%E8%AF%AD%E8%A8%80%E4%BB%A3%E7%A0%81/6594123#:~:text=ISO%20639%2D1%E6%98%AF%E5%9B%BD%E9%99%85,%EF%BC%88English%EF%BC%89%E7%94%A8en%E8%A1%A8%E7%A4%BA%E3%80%82
export const languages: {
  value: FormatjsIntl.IntlConfig['locale'];
  label: string;
  key: string;
  localLabel: string;
}[] = [
  {
    label: 'English',
    value: 'en',
    key: 'en',
    localLabel: 'English (US)',
  },
  {
    label: 'France',
    value: 'fr',
    key: 'fr',
    localLabel: 'Français (France)',
  },
  {
    label: 'Japanese',
    value: 'ja',
    key: 'ja',
    localLabel: '日本語',
  },
  {
    label: 'Kazakh',
    value: 'kk',
    key: 'kk',
    localLabel: 'Қазақ',
  },
  {
    label: 'Korean',
    value: 'ko',
    key: 'ko',
    localLabel: '한국어',
  },
  {
    label: 'Russian',
    value: 'ru',
    key: 'ru',
    localLabel: 'Русский',
  },
  {
    label: 'Chinese',
    value: 'zh',
    key: 'zh',
    localLabel: '中文(简体)',
  },
];

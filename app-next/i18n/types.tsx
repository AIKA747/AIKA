import en from './en';

// https://www.51cto.com/article/751463.html
declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: keyof typeof en;
    }
    interface IntlConfig {
      locale: 'en' | 'ru' | 'ja' | 'fr' | 'ko' | 'kk' | 'zh';
    }
  }
}

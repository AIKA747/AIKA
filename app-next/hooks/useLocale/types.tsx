export interface LocaleContextProps {
  locale: FormatjsIntl.IntlConfig['locale'];
  setLocale: (locale: FormatjsIntl.IntlConfig['locale']) => void;
  isLoaded: boolean;
}

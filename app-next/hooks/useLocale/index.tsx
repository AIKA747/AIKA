import React, { PropsWithChildren, createContext, useContext, useEffect } from 'react';
import { createIntl } from 'react-intl';

import { LocaleKey } from '@/constants/StorageKey';
import { messageMap } from '@/i18n';

import { useStorageState } from '../useStorageState';

import { DefaultLocal } from './constants';
import { LocaleContextProps } from './types';

let intl = createIntl({
  locale: DefaultLocal,
  messages: messageMap[DefaultLocal],
});

function setIntl(locale: FormatjsIntl.IntlConfig['locale']) {
  intl = createIntl({
    locale,
    messages: messageMap[locale],
  });
}

const LocaleContext = createContext<LocaleContextProps>({
  locale: DefaultLocal,
  setLocale: () => null,
  isLoaded: false,
});

const LocaleProvider = (props: PropsWithChildren) => {
  const [locale, setLocale, isLoaded] = useStorageState<FormatjsIntl.IntlConfig['locale']>(LocaleKey);
  useEffect(() => {
    if (!locale) return;
    setIntl(locale);
  }, [locale]);

  return (
    <LocaleContext.Provider
      value={{
        setLocale: (locale: FormatjsIntl.IntlConfig['locale']) => {
          setLocale(locale);
        },
        locale: locale || DefaultLocal,
        isLoaded,
      }}>
      {props.children}
    </LocaleContext.Provider>
  );
};

export function getIntl() {
  return intl;
}
// This hook can be used to access the user info.
export const useLocale = () => useContext(LocaleContext);
export default LocaleProvider;

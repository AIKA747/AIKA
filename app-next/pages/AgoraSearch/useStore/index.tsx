import React, { PropsWithChildren, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { CategorySearchFormValues, Step, StoreContextProps } from './types';

import useForm from '@/components/Form/useForm';
import { RecentSearches } from '@/constants/StorageKey';
import { useStorageState } from '@/hooks/useStorageState';

const StoreContext = createContext<StoreContextProps>({
  step: 'AutoComplete',
  setStep: () => {},

  recentSearch: [],
  setRecentSearch: () => {},
  addRecentSearch: () => {},

  innerKeyword: '',
  setInnerKeyword: () => {},
  form: {} as any,
  isInputFocus: false,
  setIsInputFocus: () => {},
  tabViewIndex: 0,
  setTabViewIndex: () => {},
});

export function useStore() {
  return useContext(StoreContext);
}

export function StoreProvider(props: PropsWithChildren) {
  const [tabViewIndex, setTabViewIndex] = useState<number>(0);

  const [recentSearch, setRecentSearch] = useStorageState<string[]>(RecentSearches, []);
  const addRecentSearch = useCallback(
    (keyword: string) => {
      const v = [...(recentSearch || [])];
      if (!v.includes(keyword)) {
        v.push(keyword);
      }
      setRecentSearch(v.slice(-10)); // 最多10个
    },
    [recentSearch, setRecentSearch],
  );

  const inputRef = useRef<TextInput>(null);
  const [isInputFocus, setIsInputFocus] = useState<boolean>(false);

  const form = useForm<CategorySearchFormValues>();

  const { setFieldsValue } = form;

  const [step, setStep] = useState<Step>('AutoComplete');

  const [innerKeyword, setInnerKeyword] = useState<string>('');

  useEffect(() => {
    if (innerKeyword) {
      setFieldsValue({ keyword: innerKeyword });
    }
  }, [innerKeyword, setFieldsValue]);

  return (
    <StoreContext.Provider
      value={{
        step,
        setStep,

        recentSearch,
        setRecentSearch,
        addRecentSearch,

        inputRef,
        innerKeyword,
        setInnerKeyword,

        form,

        isInputFocus,
        setIsInputFocus,

        tabViewIndex,
        setTabViewIndex,
      }}>
      {props.children}
    </StoreContext.Provider>
  );
}

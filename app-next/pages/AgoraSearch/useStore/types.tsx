import React from 'react';
import { TextInput } from 'react-native';

import { FormInstance } from '@/components/Form/types';

export type Step = 'AutoComplete' | 'Result';
export type SearchFrom = 'search';

export interface SearchParams {}

export interface StoreContextProps {
  step: Step;
  setStep: (step: Step) => void;

  recentSearch: string[] | null;
  setRecentSearch: (params: string[]) => void;
  addRecentSearch: (keyword: string) => void;

  inputRef?: React.RefObject<TextInput | null>;
  innerKeyword: string;
  setInnerKeyword: (params: string) => void;

  form: FormInstance<CategorySearchFormValues>;

  isInputFocus: boolean;
  setIsInputFocus: React.Dispatch<React.SetStateAction<boolean>>;

  tabViewIndex: number;
  setTabViewIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface CategorySearchFormValues {
  keyword: string;
}

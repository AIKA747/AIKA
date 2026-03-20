import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

import AutoComplete from './AutoComplete';
import Result from './Result';
import SearchBar from './SearchBar';
import styles from './styles';
import { StoreProvider, useStore } from './useStore';
import { useConfigProvider } from '@/hooks/useConfig';

function AgoraSearchContent() {
  const { computedThemeColor } = useConfigProvider();
  const { isInputFocus, setInnerKeyword, step } = useStore();
  const { query } = useLocalSearchParams<{ query: string }>();

  useEffect(() => {
    if (query) {
      setInnerKeyword(query);
    }
  }, [query, setInnerKeyword]);

  return (
    <View
      style={[
        styles.page,
        {
          // paddingTop: insets.top,
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <SearchBar />
      <View
        style={[
          {
            position: 'relative',
            flex: 1,
            width: '100%',
          },
        ]}>
        {step === 'Result' && <Result />}
        {step === 'AutoComplete' || isInputFocus ? <AutoComplete /> : undefined}
      </View>
    </View>
  );
}

export default function AgoraSearch() {
  return (
    <StoreProvider>
      <AgoraSearchContent />
    </StoreProvider>
  );
}

import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';

import { CloseOutline, SearchOutline } from '@/components/Icon';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function SearchBar(props: { onSearch?: (keywords: string) => void }) {
  const { onSearch } = props;
  const intl = useIntl();

  const inputRef = useRef<TextInput>(null);
  const [isInputFocus, setIsInputFocus] = useState(false);

  const [innerKeyword, setInnerKeyword] = useState<string>('');
  // useEffect(() => {
  //   setInnerKeyword(values.keyword || '');
  // }, [values.keyword]);

  const { computedThemeColor, computedTheme } = useConfigProvider();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <View
        style={[
          styles.input,
          {
            backgroundColor: computedTheme === Theme.DARK ? 'rgba(27, 27, 34, 1)' : '#F3F3F3',
          },
        ]}>
        <View style={[styles.inputSearch]}>
          <SearchOutline style={[styles.inputSearchIcon]} color="#80878E" width={pxToDp(30)} height={pxToDp(30)} />
        </View>
        <TextInput
          ref={inputRef}
          style={[
            styles.inputText,
            {
              color: computedTheme === Theme.DARK ? '#FFF' : '#000',
            },
          ]}
          value={innerKeyword}
          placeholder={intl.formatMessage({ id: 'Search' })}
          placeholderTextColor={computedTheme === Theme.DARK ? '#FFFFFF8F' : '#80878E'}
          onChange={(e) => {
            setInnerKeyword(e.nativeEvent.text);
          }}
          onFocus={() => {
            setIsInputFocus(true);
          }}
          onBlur={() => {
            setIsInputFocus(false);
          }}
          onSubmitEditing={() => {
            if (!innerKeyword) {
              return;
            }
            const keyword = innerKeyword.trim();
            setInnerKeyword(keyword);
            onSearch?.(keyword);
          }}
        />
        {innerKeyword && (
          <TouchableOpacity
            style={[
              styles.inputClear,
              {
                backgroundColor: '#A07BED',
              },
            ]}
            onPress={() => {
              setInnerKeyword('');
              onSearch?.('');
            }}>
            <CloseOutline style={[styles.inputClearIcon]} width={pxToDp(16)} height={pxToDp(16)} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      {isInputFocus ? (
        <TouchableOpacity
          style={[styles.cancel]}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <Text
            style={[
              styles.cancelText,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {intl.formatMessage({ id: 'Cancel' })}
          </Text>
        </TouchableOpacity>
      ) : undefined}
    </View>
  );
}

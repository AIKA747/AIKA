import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

import useForm from '@/components/Form/useForm';
import { ArrowLeftOutline, CloseOutline, SearchOutline } from '@/components/Icon';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function SearchBar(props: {
  placeholder?: string;
  onSearch?: (keywords: string) => void;
  onChange?: (keywords: string) => void;
}) {
  const { onSearch, onChange, placeholder } = props;
  const insets = useSafeAreaInsets();
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();

  const inputRef = useRef<TextInput>(null);
  const { setFieldsValue } = useForm();
  const [innerKeyword, setInnerKeyword] = useState<string>('');
  const [isInputFocus, setIsInputFocus] = useState(false);

  return (
    <Shadow
      startColor="rgba(0, 0, 0, 0.03)"
      distance={10}
      sides={{
        start: false,
        end: false,
        top: false,
        bottom: true,
      }}
      style={[
        styles.Shadow,
        {
          // backgroundColor: 'red',
        },
      ]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: computedThemeColor.bg_primary,
            paddingTop: insets.top + pxToDp(16),
          },
        ]}>
        <TouchableOpacity
          style={[styles.back]}
          onPress={() => {
            router.back();
          }}>
          <ArrowLeftOutline
            style={styles.backIcon}
            height={pxToDp(40)}
            width={pxToDp(40)}
            color={computedThemeColor.text}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.input,
            {
              backgroundColor: computedTheme === Theme.DARK ? '#FFFFFF0D' : '#F3F3F3',
            },
          ]}>
          <View style={[styles.inputSearch]}>
            <SearchOutline style={[styles.inputSearchIcon]} color="#80878E" width={pxToDp(30)} height={pxToDp(30)} />
          </View>
          <TextInput
            autoFocus
            ref={inputRef}
            style={[styles.inputText, { color: computedThemeColor.text }]}
            value={innerKeyword}
            returnKeyType="search"
            selectionColor={computedThemeColor.primary}
            placeholder={placeholder || intl.formatMessage({ id: 'agora.search.SearchBar.Search' })}
            placeholderTextColor={computedTheme === Theme.DARK ? '#FFFFFF8F' : '#80878E'}
            onChange={(e) => {
              setInnerKeyword(e.nativeEvent.text);
              onChange?.(e.nativeEvent.text);
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
              setFieldsValue({
                keyword,
              });
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
                setFieldsValue({
                  keyword: '',
                });
              }}>
              <CloseOutline style={[styles.inputClearIcon]} width={pxToDp(16)} height={pxToDp(16)} color="#fff" />
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
              {intl.formatMessage({ id: 'agora.search.SearchBar.Cancel' })}
            </Text>
          </TouchableOpacity>
        ) : undefined}
      </View>
    </Shadow>
  );
}

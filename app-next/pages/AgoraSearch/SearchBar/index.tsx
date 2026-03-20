import { router } from 'expo-router';
import { useIntl } from 'react-intl';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

import { useStore } from '../useStore';
import styles from './styles';

import { ArrowLeftOutline, CloseCircleFilled, SearchOutline } from '@/components/Icon';
import pxToDp from '@/utils/pxToDp';
import { Theme, useConfigProvider } from '@/hooks/useConfig';

export default function SearchBar() {
  const insets = useSafeAreaInsets();
  const intl = useIntl();

  const {
    isInputFocus,
    setIsInputFocus,
    inputRef,
    innerKeyword,
    setInnerKeyword,
    setStep,
    form,
    step,
    addRecentSearch,
  } = useStore();

  const { setFieldsValue } = form;
  const { computedThemeColor, computedTheme } = useConfigProvider();
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
          backgroundColor: 'red',
        },
      ]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: computedThemeColor.bg_primary,
            // backgroundColor: 'purple',
            paddingTop: insets.top + pxToDp(16),
          },
        ]}>
        <TouchableOpacity
          style={[styles.back]}
          onPress={() => {
            if (step === 'Result') {
              setInnerKeyword('');
              setFieldsValue({ keyword: '' });
              setStep('AutoComplete');
            } else {
              router.back();
            }
          }}>
          <ArrowLeftOutline
            style={styles.backIcon}
            width={pxToDp(40)}
            height={pxToDp(40)}
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
            ref={inputRef}
            style={[
              styles.inputText,
              {
                color: computedTheme === Theme.DARK ? '#FFF' : '#000',
              },
            ]}
            value={innerKeyword}
            returnKeyType={'search'}
            selectionColor={computedThemeColor.primary}
            placeholder={intl.formatMessage({ id: 'agora.search.SearchBar.Search' })}
            placeholderTextColor={computedTheme === Theme.DARK ? '#FFFFFF8F' : '#80878E'}
            onChange={(e) => {
              setInnerKeyword(e.nativeEvent.text);
              setIsInputFocus(true);
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
              addRecentSearch(keyword);
              setStep('Result');
            }}
          />
          {innerKeyword && (
            <TouchableOpacity
              style={[styles.inputClear]}
              onPress={() => {
                setInnerKeyword('');
                setFieldsValue({
                  keyword: '',
                });
                setStep('AutoComplete');
              }}>
              <CloseCircleFilled
                style={[styles.inputClearIcon]}
                width={pxToDp(40)}
                height={pxToDp(40)}
                color="#A07BED"
              />
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

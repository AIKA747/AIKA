import { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useConfigProvider } from '@/hooks/useConfig';

import styles from './styles';
import { CodeInputProps } from './types';

export default function CodeInput(props: CodeInputProps) {
  const { style, value, length = 6, onChange, error } = props;
  const { computedThemeColor } = useConfigProvider();

  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          onChange?.(e.nativeEvent.text);
        }}
        keyboardType="numeric"
        style={[styles.valueInput]}
        maxLength={length}
        autoFocus
      />

      <TouchableOpacity
        style={styles.blocks}
        activeOpacity={1}
        onPress={() => {
          inputRef.current?.blur();
          inputRef.current?.focus();
        }}>
        {new Array(length).fill(0).map((_item, index) => {
          const vPre = inputValue?.[index - 1];
          const v = inputValue?.[index];

          // 闪烁动画
          const showCursor = (!v && vPre) || (!v && index === 0);

          return (
            <View
              key={index}
              style={[
                styles.block,
                {
                  backgroundColor: computedThemeColor.bg_secondary,
                  borderColor: error ? computedThemeColor.text : computedThemeColor.text,
                },
              ]}>
              {showCursor ? (
                <Text style={[styles.blockText, { color: computedThemeColor.text }]}>|</Text>
              ) : (
                <Text style={[styles.blockText, { color: computedThemeColor.text }]}>{v}</Text>
              )}
            </View>
          );
        })}
      </TouchableOpacity>
    </View>
  );
}

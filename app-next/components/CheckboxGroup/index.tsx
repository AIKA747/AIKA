import { Text, TouchableOpacity, View } from 'react-native';

import { CheckboxTwoTone } from '@/components/Icon';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import { blockStyles, pickerStyles, radioStyles, tagStyles } from './styles';
import { CheckboxGroupProps } from './types';

function CheckboxGroup<T extends string | number, K extends boolean>({
  mode = 'radio',
  multi = false as K,
  options,
  value = [],
  onChange,
  style,
  itemStyle,
  ...restProps
}: CheckboxGroupProps<T>) {
  const { computedThemeColor } = useConfigProvider();

  const styles = {
    radio: radioStyles,
    block: blockStyles,
    tag: tagStyles,
    picker: pickerStyles,
  }[mode];

  return (
    <View style={[styles.items, style]} {...restProps}>
      {options.map((option) => {
        const isChecked = (value || []).includes(option.key);
        const onPress = () => {
          if (isChecked) {
            if (value.length === 1) {
              onChange?.([]);
            } else {
              const index = value.indexOf(option.key);
              value.splice(index, 1);
              onChange?.([...value]);
            }
          } else {
            if (multi) {
              onChange?.([...value, option.key]);
            } else {
              onChange?.([option.key]);
            }
          }
        };

        const radio = (
          <CheckboxTwoTone
            width={pxToDp(24 * 2)}
            height={pxToDp(24 * 2)}
            color={computedThemeColor.primary}
            twoToneColor="#000"
            checked={isChecked}
            style={[styles.itemIcon]}
          />
        );

        return mode === 'block' ? (
          <TouchableOpacity
            style={[{ marginRight: pxToDp(20), marginTop: pxToDp(20) }]}
            onPress={onPress}
            key={option.key}>
            <View
              style={[
                styles.item,
                itemStyle,
                { marginRight: pxToDp(0), marginTop: pxToDp(0) },
                isChecked
                  ? {
                      backgroundColor: computedThemeColor.primary,
                      borderColor: computedThemeColor.primary,
                    }
                  : {
                      backgroundColor: computedThemeColor.bg_secondary,
                      borderColor: computedThemeColor.bg_secondary,
                    },
              ]}
              key={option.key}>
              <Text
                style={[
                  styles.itemText,
                  {
                    color: isChecked ? '#FFF' : computedThemeColor.text,
                  },
                ]}>
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onPress}
            key={option.key}
            style={[
              styles.item,
              itemStyle,
              isChecked
                ? {
                    // backgroundColor: computedThemeColor.primary,
                    // borderColor: computedThemeColor.primary,
                  }
                : {
                    // backgroundColor: computedThemeColor.bgOpacity,
                    // borderColor: computedThemeColor.bgOpacity,
                  },
            ]}>
            {mode === 'radio' && radio}
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>{option.label}</Text>
            {mode === 'picker' && radio}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default CheckboxGroup;

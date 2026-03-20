import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';

import { ArrowDownOutline } from '@/components/Icon';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import CheckboxGroup from '../CheckboxGroup';
import Modal from '../Modal';

import styles from './styles';
import { CheckboxGroupProps } from './types';

export default function Picker<T extends string | number>(
  props: CheckboxGroupProps<T> & {
    title?: string;
    placeholder?: string;
    required?: boolean;
  },
) {
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const { style, options, value, onChange, title, placeholder, required, ...restProps } = props;
  const [visible, setVisible] = useState(false);
  const [innerValue, setInnerValue] = useState<typeof value>();
  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const intl = useIntl();

  const label = options.find((x) => x.key === value)?.label;

  return (
    <View style={[styles.container, style]} {...restProps}>
      <TouchableOpacity
        style={[
          styles.selectContainer,
          {
            backgroundColor:
              computedTheme === Theme.LIGHT ? computedThemeColor.text_gray : computedThemeColor.bg_secondary,
          },
        ]}
        onPress={() => {
          setVisible(true);
        }}>
        <Text
          style={[
            styles.selectContainerText,
            {
              color: computedThemeColor.text,
            },
          ]}>
          {label || placeholder || title || 'Select one'}
          {!label && required ? (
            <Text
              style={{
                color: '#FF2D55',
              }}>
              {' *'}
            </Text>
          ) : undefined}
        </Text>
        <ArrowDownOutline
          style={[styles.selectContainerArrow]}
          color={computedThemeColor.text}
          width={pxToDp(48)}
          height={pxToDp(48)}
        />
      </TouchableOpacity>

      <Modal
        title={title}
        position="BOTTOM"
        visible={visible}
        okButtonProps={{
          disabled: !innerValue,
          children: intl.formatMessage({ id: 'Choose' }),
        }}
        onOk={() => {
          onChange?.(innerValue);
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
        }}>
        <View
          style={[
            styles.modalContainer,
            {
              paddingTop: title ? pxToDp(0) : pxToDp(80),
            },
          ]}>
          <CheckboxGroup
            mode="radio"
            value={innerValue ? [innerValue] : []}
            onChange={(v) => {
              setInnerValue(v[0]);
            }}
            options={options}
          />
        </View>
      </Modal>
    </View>
  );
}

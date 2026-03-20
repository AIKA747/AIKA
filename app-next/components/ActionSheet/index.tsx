import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RootSiblingsManager from 'react-native-root-siblings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseOutline } from '@/components/Icon';
import Modal from '@/components/Modal';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import { ActionSheetStyles } from './styles';
import { ActionSheetProps } from './types';

function ActionSheet(props: ActionSheetProps) {
  const { visible, title, items, onCancel, position, value, onChange, layout = 'vertical' } = props;
  const insets = useSafeAreaInsets();

  const { computedThemeColor } = useConfigProvider();

  // 左右都显示，保持中间文字居中
  const activeIcon = (position: 'left' | 'right') => {
    return (
      <CloseOutline
        style={[
          ActionSheetStyles.itemIcon,
          {
            opacity: position === 'left' ? 0 : undefined,
          },
        ]}
        color={computedThemeColor.text_black}
        width={pxToDp(20)}
        height={pxToDp(20)}
      />
    );
  };

  return (
    <Modal
      fullWidth
      maskBlur={false}
      maskClosable
      position={position}
      visible={visible}
      onClose={onCancel}
      title={<Text style={[ActionSheetStyles.titleText, { color: computedThemeColor.text_white }]}>{title}</Text>}>
      <View
        style={{
          flexDirection: layout === 'horizontal' ? 'row' : 'column',
          paddingHorizontal: pxToDp(32),
          paddingBottom: insets.bottom ? insets.bottom + pxToDp(24) : pxToDp(32),
          gap: pxToDp(16),
        }}>
        {items.map((item) => {
          const active = value === item.value;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                ActionSheetStyles.item,
                {
                  backgroundColor: computedThemeColor.text_white,
                },
                item?.style,
              ]}
              key={item.value}
              onPress={() => {
                onChange(item.value);
              }}>
              {item.icon && <View>{item.icon}</View>}
              {typeof item.label === 'string' ? (
                <>
                  {active ? activeIcon('left') : undefined}
                  <Text
                    style={[
                      ActionSheetStyles.itemText,
                      {
                        color: item.type === 'danger' ? computedThemeColor.text_error : computedThemeColor.primary,
                      },
                    ]}>
                    {item.label}
                  </Text>
                </>
              ) : (
                item.label
              )}
              {active ? activeIcon('right') : undefined}
            </TouchableOpacity>
          );
        })}
      </View>
    </Modal>
  );
}

function show(props: ActionSheetProps) {
  const { onChange, onCancel, ...resetProps } = props;
  let instance = { destroy: () => {} };
  instance = new RootSiblingsManager(
    (
      <ActionSheet
        {...resetProps}
        visible
        position="BOTTOM"
        onChange={(...v) => {
          onChange?.(...v);
          instance.destroy();
        }}
        onCancel={() => {
          onCancel?.();
          instance.destroy();
        }}
      />
    ),
  );
  return instance;
}
export default Object.assign(ActionSheet, { show });

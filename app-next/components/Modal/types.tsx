import { type BlurTint } from 'expo-blur/build/BlurView.types';
import { ReactNode } from 'react';
import { ColorValue, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import { ButtonProps } from '../Button/types';

export type ModalProps = {
  position?: 'CENTER' | 'BOTTOM';
  direction?: 'vertical' | 'horizontal';
  children?: ReactNode;
  visible?: boolean;
  title?: string | ReactNode;
  onClose?: () => void;
  onOk?: () => void | Promise<void>;
  okButtonProps?: ButtonProps;
  onCancel?: () => void | Promise<void>;
  cancelButtonProps?: ButtonProps;
  maskBlur?: boolean;
  blurType?: BlurTint;
  maskColor?: ColorValue;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  keyboardAvoidingViewEnabled?: boolean;
  fullWidth?: boolean;
  closable?: boolean; // 是否显示右上角的关闭按钮
  maskClosable?: boolean; // 点击蒙层是否允许关闭 默认为 true
};

export type UseConfirmModalProps = object;
export type UseConfirmModalShowOptions = {
  title?: string;
  text?: string;
  maskBlur?: boolean;
  maskClosable?: boolean; // 点击蒙层是否允许关闭 默认为 true
  onOk?: () => void | Promise<void>;
  okButtonProps?: ButtonProps;
  onCancel?: () => void | Promise<void>;
  cancelButtonProps?: ButtonProps;
};
export type UseConfirmModalReturn = {
  el: ReactNode;
  show: (options: UseConfirmModalShowOptions) => void;
};

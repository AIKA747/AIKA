import { type LinearGradientProps } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ButtonProps = Omit<LinearGradientProps, 'colors' | 'start' | 'end'> & {
  icon?: ReactNode;
  iconAfter?: ReactNode;
  type?: 'primary' | 'default' | 'confirm' | 'link' | 'text' | 'ghost';
  borderType?: 'circle' | 'square';
  disabled?: boolean;
  loading?: boolean;
  size?: 'large' | 'middle' | 'small';
  /**
   * 外层容器样式，主要用于大小、距离、间隔等设置
   *
   */
  wrapperStyle?: StyleProp<ViewStyle>;
  /**
   * 内部容器样式，主要用于设置边框、背景颜色等
   */
  style?: StyleProp<ViewStyle>;
  /**
   * 按钮文字颜色
   */
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void | Promise<void>;
};

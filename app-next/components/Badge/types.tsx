import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface BadgeProps {
  /**
   * 自定义小圆点的颜色
   */
  color?: string;
  /**
   * 展示的数字，大于 overflowCount 时显示为 ${overflowCount}+，为 0 时隐藏
   */
  count: number;
  /**
   * 没有children时将作用于数字区域
   */
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /**
   * 仅仅显示红点，不显示具体数字
   */
  showDot?: boolean;
  /**
   * 展示封顶的数字值, 默认值： 99
   */
  overflowCount?: number;
  offset?: {
    x: number;
    y: number;
  };
}

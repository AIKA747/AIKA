import { StyleProp, ViewStyle } from 'react-native';

export interface TextGradientProps {
  content: string;
  content2?: [string, string]; // 文字溢出时自动降级
  content3?: [string, string]; // 文字溢出时自动降级
  fontSize?: number;
  fontFamily?: 'Inter' | 'Inter-Bold' | 'ProductSansRegular' | 'ProductSansBold';
  textAlign?: 'left' | 'center';
  style?: StyleProp<ViewStyle>;
}

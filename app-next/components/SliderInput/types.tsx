import { SliderProps } from '@react-native-community/slider';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type SliderInputProps = Omit<SliderProps, ''> & {
  sliderStyle?: ViewStyle;
};

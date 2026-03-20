import Slider from '@react-native-community/slider';
import { Platform, Text, View } from 'react-native';

import styles from './styles';
import { SliderInputProps } from './types';

export default function SliderInput({
  style,
  sliderStyle,
  step,
  value,
  minimumValue = 0,
  maximumValue = 100,
  ...restProps
}: SliderInputProps) {
  return (
    <View style={[styles.container, style]}>
      <Slider
        style={[styles.slider, sliderStyle]}
        step={1}
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        minimumTrackTintColor="#7B6E9D"
        maximumTrackTintColor="#1B1D26"
        thumbTintColor="#ECA0FF"
        thumbImage={Platform.OS === 'ios' ? undefined : require('./thumbImage.png')}
        {...restProps}
      />
      <Text style={[styles.sliderValue]}>{value}</Text>
    </View>
  );
}

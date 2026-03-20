import { TouchableOpacity, View } from 'react-native';

import { StarFilled, StarOutline } from '@/components/Icon';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { RatingProps } from './types';

export default function Rate({ style, value, color = '#fff', size = pxToDp(28), onChange, ...restProps }: RatingProps) {
  return (
    <View style={[styles.ratingBox, style]} {...restProps}>
      {new Array(5).fill(0).map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange?.(index + 1);
          }}>
          {index < value ? (
            <StarFilled color={color} width={size} height={size} style={{ marginRight: pxToDp(20) }} />
          ) : (
            <StarOutline color={color} height={size} width={size} style={{ marginRight: pxToDp(20) }} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

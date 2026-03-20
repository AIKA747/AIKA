import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import pxToDp from '@/utils/pxToDp';

import { ButtonProps } from './types';

import Button from '.';

export default function ButtonDemo() {
  const typeList: ButtonProps['type'][] = ['primary', 'confirm', 'link', 'default', 'text', 'ghost'];
  const sizeList: ButtonProps['size'][] = ['large', 'middle', 'small'];
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{
        flex: 1,
        // backgroundColor: 'red',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}>
      {typeList.map((type, index) => {
        return (
          <View key={index}>
            {sizeList.map((size) => {
              return (
                <>
                  <Button
                    type={type}
                    size={size}
                    disabled
                    wrapperStyle={{
                      margin: pxToDp(10),
                    }}
                    onPress={() => {}}>
                    {`${type} - ${size} - disabled`}
                  </Button>
                  <Button
                    type={type}
                    size={size}
                    wrapperStyle={{
                      margin: pxToDp(10),
                    }}
                    onPress={() => {}}>
                    {`${type} - ${size}`}
                  </Button>
                </>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
}

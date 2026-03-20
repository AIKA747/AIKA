import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DropShadow from 'react-native-drop-shadow';

import { useConfigProvider } from '@/hooks/useConfig';

import styles from './styles';
import { TabsType } from './types';

export default function TabsView(props: TabsType) {
  const { items, onIndexChange } = props;
  const { computedThemeColor } = useConfigProvider();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: computedThemeColor.bg_secondary,
        },
      ]}>
      {items.map((item, index) => {
        return (
          <DropShadow
            key={item.key}
            style={[
              styles.itemDropShadow,
              {
                shadowColor: '#301190',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: activeIndex === index ? 0.4 : 0,
                shadowRadius: activeIndex === index ? 5 : 0,
              },
            ]}>
            <TouchableOpacity
              style={[
                styles.item,
                activeIndex === index
                  ? {
                      backgroundColor: computedThemeColor.text_gray,
                    }
                  : {},
              ]}
              onPress={() => {
                setActiveIndex(index);
                onIndexChange?.(index);
              }}>
              <Text
                style={[
                  styles.itemText,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          </DropShadow>
        );
      })}
    </View>
  );
}

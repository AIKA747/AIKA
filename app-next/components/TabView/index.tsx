import React, { useEffect } from 'react';
import { Dimensions, type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { TabView as RNTabView, SceneMap, SceneRendererProps, TabBar } from 'react-native-tab-view';
import type { NavigationState } from 'react-native-tab-view';

import { Theme, useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

const renderTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<{ key: string; title: string }>;
    selectIndex?: number;
    selectedColor?: string;
    color?: string;
    tabStyle?: StyleProp<ViewStyle>;
    scrollEnabled?: boolean;
    hideTabBar?: boolean;
  },
) => {
  const { selectedColor, selectIndex, hideTabBar = false, color, ...rest } = props;
  const focused = selectIndex === props.navigationState.index;
  return (
    <View style={{ paddingHorizontal: pxToDp(16 * 2) }}>
      <TabBar
        indicatorStyle={[
          styles.indicator,
          {
            backgroundColor: focused ? selectedColor : color,
          },
        ]}
        indicatorContainerStyle={[styles.indicatorContainer]}
        style={[
          { minHeight: pxToDp(40 * 2), backgroundColor: 'transparent', elevation: 0 },
          hideTabBar ? { display: 'none' } : {},
        ]}
        {...rest}
      />
    </View>
  );
};

function TabView(props: {
  routes: { key: string; title: string; scene: React.ComponentType<unknown> }[];
  index?: number;
  onChangeIndex?: (index: number) => void;
  selectedColor?: string;
  style?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
  hideTabBar?: boolean;
}) {
  const { routes, index = 0, onChangeIndex, style, hideTabBar, selectedColor, tabStyle, scrollEnabled } = props;
  const [innerIndex, setInnerIndex] = React.useState<number>(index);

  const renderScene = SceneMap(routes.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.scene }), {}));

  const { computedTheme, computedThemeColor } = useConfigProvider();

  useEffect(() => {
    setInnerIndex(index);
  }, [index]);

  return (
    <RNTabView
      style={style}
      overScrollMode="auto"
      orientation="horizontal"
      initialLayout={{ width: Dimensions.get('window').width }}
      navigationState={{ index: innerIndex, routes }}
      renderScene={renderScene}
      onIndexChange={(index) => {
        setInnerIndex(index);
        onChangeIndex?.(index);
      }}
      onTabSelect={({ index }) => {
        setInnerIndex(index);
        onChangeIndex?.(index);
      }}
      renderTabBar={(p) =>
        renderTabBar({
          ...p,
          tabStyle,
          scrollEnabled,
          selectIndex: innerIndex,
          selectedColor: selectedColor || computedThemeColor.primary,
          hideTabBar,
          color: computedTheme === Theme.DARK ? computedThemeColor.text_secondary : 'rgba(11, 12, 10, 0.2)',
        })
      }
      commonOptions={{
        label: ({ focused, route }) => (
          <Text
            style={[
              styles.normalLabel,
              focused
                ? [
                    styles.focusedLabel,
                    {
                      color: selectedColor || computedThemeColor.primary,
                    },
                  ]
                : {
                    color: computedTheme === Theme.DARK ? computedThemeColor.text_secondary : 'rgba(11, 12, 10, 0.2)',
                  },
            ]}>
            {route.title}
          </Text>
        ),
      }}
    />
  );
}

export default React.memo(TabView);

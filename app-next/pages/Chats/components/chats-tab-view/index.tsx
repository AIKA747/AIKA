import React, { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';
import { SceneRendererProps, TabBar, TabView as RNTabView } from 'react-native-tab-view';
import type { NavigationState } from 'react-native-tab-view';

import { GroupConversation } from '@/database/models';
import ChatsScene from '@/pages/Chats/components/scene/chats-scene';
import ExpertsScene from '@/pages/Chats/components/scene/experts-scene';
import FairyTalesScene from '@/pages/Chats/components/scene/fairy-tales-scene';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

const ChatsTabView = ({
  conversations,
  onTabChange,
  filter,
  showMoreAction,
  setShowMoreAction,
  selectable,
  setSelectable,
}: {
  conversations: GroupConversation[];
  filter: string;
  onTabChange: (index: number) => void;
  showMoreAction: boolean;
  selectable: boolean;
  setSelectable: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMoreAction: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const intl = useIntl();

  const routes = useMemo(
    () => [
      { key: '0', title: intl.formatMessage({ id: 'chats.tab.0' }) },
      { key: '1', title: intl.formatMessage({ id: 'chats.tab.1' }) },
      { key: '2', title: intl.formatMessage({ id: 'chats.tab.2' }) },
    ],
    [intl],
  );

  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    onTabChange(index);
  }, [index, onTabChange]);

  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => {
      switch (route.key) {
        case '0':
          return (
            <ChatsScene
              conversations={conversations}
              filter={index === 0 ? filter : ''}
              selectable={selectable}
              showMoreAction={showMoreAction}
              setSelectable={setSelectable}
              setShowMoreAction={setShowMoreAction}
            />
          );
        case '1':
          return <FairyTalesScene filter={index === 1 ? filter : ''} />;
        case '2':
          return <ExpertsScene filter={index === 2 ? filter : ''} />;
        default:
          return null;
      }
    },
    [conversations, index, filter, selectable, showMoreAction, setSelectable, setShowMoreAction],
  );

  return (
    <RNTabView
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
    />
  );
};

export default React.memo(ChatsTabView);

function renderTabBar(
  props: SceneRendererProps & {
    navigationState: NavigationState<{ key: string; title: string }>;
  },
) {
  return (
    <View style={{ paddingHorizontal: pxToDp(32), marginTop: pxToDp(16) }}>
      <TabBar
        {...props}
        gap={pxToDp(16)}
        renderTabBarItem={({ labelText, defaultTabWidth, key }) => {
          const focused = +props.navigationState.index === +key;
          return (
            <TouchableOpacity
              onPress={() => props.jumpTo(key)}
              style={[
                styles.tabItem,
                {
                  width: defaultTabWidth,
                  backgroundColor: focused ? '#C60C93' : '#1b1b22',
                },
              ]}>
              <Text style={{ color: focused ? '#fff' : '#80878E' }}>{labelText}</Text>
            </TouchableOpacity>
          );
        }}
        indicatorStyle={[styles.indicator]}
        indicatorContainerStyle={[styles.indicatorContainer]}
        style={{ height: pxToDp(36 * 2), backgroundColor: 'transparent', elevation: 0 }}
      />
    </View>
  );
}

import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { View } from 'react-native';

import TabView from '@/components/TabView';

import { useStore } from '../useStore';

import Chats from './Chats';
import Popular from './Popular';
import Users from './Users';

export default function AutoComplete() {
  const { form, tabViewIndex, setTabViewIndex } = useStore();
  const { getFieldsValue } = form;
  const values = getFieldsValue();

  const intl = useIntl();

  const routes = useMemo(
    () => [
      {
        key: 'Popular',
        title: intl.formatMessage({ id: 'agora.search.Result.tab.Popular' }),
        scene: Popular,
      },
      {
        key: 'Users',
        title: intl.formatMessage({ id: 'agora.search.Result.tab.Users' }),
        scene: Users,
      },
      {
        key: 'Chats',
        title: intl.formatMessage({ id: 'agora.search.Result.tab.Chats' }),
        scene: Chats,
      },
    ],
    [intl],
  );

  if (!values.keyword) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <TabView
        routes={routes}
        index={tabViewIndex}
        selectedColor="#fff"
        onChangeIndex={(index) => {
          setTabViewIndex(index);
        }}
      />
    </View>
  );
}

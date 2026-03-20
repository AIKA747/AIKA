import dayjs from 'dayjs';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import TabsView from '@/components/TabsView';
import { useConfigProvider } from '@/hooks/useConfig';
import { getUserAppFeedbackList } from '@/services/yonghufankuijiekou';
import pxToDp from '@/utils/pxToDp';

import { getTabs } from './constants';
import styles from './styles';

export default function Report() {
  const insets = useSafeAreaInsets();
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  const listRef = useRef<ListRef>(null);
  const tabIndexRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      listRef.current?.refresh();
    }, []),
  );

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <NavBar title={intl.formatMessage({ id: 'Report' })} />
      <View style={styles.TabsView}>
        <TabsView
          items={getTabs()}
          onIndexChange={(index) => {
            tabIndexRef.current = index;
            listRef.current?.reload();
          }}
        />
      </View>
      <View style={styles.container}>
        <List
          footerProps={{
            noMoreText: '',
          }}
          ref={listRef}
          request={async (params) => {
            const res = await getUserAppFeedbackList({
              pageNo: params.pageNo,
              pageSize: params.pageSize,
              listType: ['processed', 'finished'][tabIndexRef.current],
            });
            return {
              data: res.data.data.list || [],
              total: res.data.data.total || 0,
            };
          }}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: pxToDp(20) }} />}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={[
                  styles.listItem,
                  {
                    backgroundColor: computedThemeColor.bg_secondary,
                  },
                ]}
                onPress={() => {
                  router.push({
                    pathname: '/main/report/details/[reportId]',
                    params: {
                      reportId: item.id! + '',
                    },
                  });
                }}>
                <Text
                  style={[
                    styles.listItemTitle,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}>
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.listItemDate,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}>
                  {dayjs(item.submissionAt).locale(intl.locale).format('MMM D, YYYY')}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View
        style={[
          styles.buttonWrapper,
          {
            paddingBottom: pxToDp(32) + insets.bottom,
          },
        ]}>
        <Button
          type="primary"
          textStyle={{ lineHeight: pxToDp(44) }}
          onPress={() => {
            router.push({
              pathname: '/main/report/create',
            });
          }}>
          {intl.formatMessage({ id: 'NewReport' })}
        </Button>
      </View>
    </View>
  );
}

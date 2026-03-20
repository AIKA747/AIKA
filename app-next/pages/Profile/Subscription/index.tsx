import dayjs from 'dayjs';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getOrderAppPaymentHistory } from '@/services/orderService';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

type SubscriptionItem = Awaited<ReturnType<typeof getOrderAppPaymentHistory>>['data']['data']['list'][number];
function Subscription() {
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const intl = useIntl();
  const listRef = useRef<ListRef>(null);

  return (
    <View style={[styles.container]}>
      <List<SubscriptionItem>
        ref={listRef}
        footerProps={{
          noMoreText: '',
        }}
        request={async (params) => {
          const res = await getOrderAppPaymentHistory({
            pageNo: params.pageNo,
            pageSize: params.pageSize,
          });
          return {
            data: res.data.data.list || [],
            total: res.data.data.total || 0,
          };
        }}
        contentContainerStyle={styles.historyList}
        renderItem={({ item }) => {
          const price = ((item.amount || 0) / 100)?.toFixed(2) || '0.0';
          const priceInteger = price.split('.')[0];
          const priceDecimal = price.split('.')[1];
          return (
            <TouchableOpacity
              key={item.orderNo}
              style={[
                styles.historyListItem,
                {
                  backgroundColor:
                    computedTheme === Theme.LIGHT ? computedThemeColor.bg_primary : computedThemeColor.bg_secondary,
                },
              ]}>
              <View style={[styles.info]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: pxToDp(12),
                    gap: pxToDp(12),
                  }}>
                  <Text
                    style={[
                      styles.name,
                      {
                        color: computedThemeColor.text,
                      },
                    ]}>
                    {item.packageName}
                  </Text>
                  <Text
                    style={[
                      styles.amount,
                      {
                        color: computedThemeColor.text,
                      },
                    ]}>
                    $ {priceInteger}.
                    <Text
                      style={[
                        styles.amountSub,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      {priceDecimal}
                    </Text>
                  </Text>
                </View>
                <Text
                  style={[
                    styles.period,
                    {
                      color: computedThemeColor.text_secondary,
                    },
                  ]}>
                  {intl.formatMessage({ id: 'Payments.PayModal.ValidUntil' })}{' '}
                  {dayjs(item.payTime).locale(intl.locale).format('YYYY MMM DD')}
                </Text>
                <Text
                  style={[
                    styles.period,
                    {
                      color: computedThemeColor.text_secondary,
                    },
                  ]}>
                  {intl.formatMessage({ id: 'Payments.PayModal.Bought' })}{' '}
                  {dayjs(item.expiredAt).locale(intl.locale).format('YYYY MMM DD')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: pxToDp(24), backgroundColor: 'transparent' }} />}
      />
    </View>
  );
}

export default React.memo(Subscription);

import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, View, TouchableOpacity, Platform } from 'react-native';

import Button from '@/components/Button';
import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Skeleton from '@/components/Skeleton';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getOrderAppPaymentHistory } from '@/services/orderService';
import pxToDp from '@/utils/pxToDp';

import PayModal from './PayModal';
import styles from './styles';

export default function Payments() {
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const [payModalVisible, setPayModalVisible] = useState(false);

  const listRef = useRef<ListRef>(null);

  return (
    <PageView
      style={[
        styles.page,
        {
          paddingBottom: Platform.OS === 'ios' ? pxToDp(32) : 0,
        },
      ]}>
      <NavBar title={intl.formatMessage({ id: 'Payments.title' })} />
      <View style={[styles.container]}>
        <List
          ref={listRef}
          footerProps={{
            noMoreText: '',
          }}
          showFirstScreenSkeleton
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
          keyExtractor={(item) => item.orderNo}
          contentContainerStyle={styles.historyList}
          ItemSeparatorComponent={() => <View style={{ height: pxToDp(20) }} />}
          renderItem={({ item }) => {
            const price = ((item.amount || 0) / 100)?.toFixed(2) || '0.0';
            const priceInteger = price.split('.')[0];
            const priceDecimal = price.split('.')[1];
            return (
              <Skeleton.Card title={{ rows: 1 }} paragraph={{ rows: 2 }} loading={item.loading}>
                <TouchableOpacity
                  style={[
                    styles.historyListItem,
                    {
                      backgroundColor:
                        computedTheme === Theme.LIGHT ? computedThemeColor.bg_primary : computedThemeColor.bg_secondary,
                    },
                  ]}>
                  <View style={[styles.packageName]}>
                    <Text
                      numberOfLines={1}
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
                  <View style={[styles.info]}>
                    {/*<Text*/}
                    {/*  style={[*/}
                    {/*    styles.period,*/}
                    {/*    {*/}
                    {/*      color: computedThemeColor.text,*/}
                    {/*    },*/}
                    {/*  ]}*/}
                    {/*>*/}
                    {/*  {intl.formatMessage({ id: 'Payments.PayModal.ValidUntil' })}{' '}*/}
                    {/*  {dayjs(item.payTime).locale(intl.locale).format('YYYY MMM DD')}*/}
                    {/*</Text>*/}
                    <Text
                      style={[
                        styles.period,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      {intl.formatMessage({ id: 'Payments.PayModal.Bought' })}{' '}
                      {dayjs(item.payTime).locale(intl.locale).format('YYYY MMM DD')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Skeleton.Card>
            );
          }}
        />
      </View>
      <View style={[styles.buttonWrapper]}>
        <Button
          type="primary"
          textStyle={{
            lineHeight: pxToDp(42),
          }}
          onPress={() => {
            setPayModalVisible(true);
          }}>
          {intl.formatMessage({ id: 'Deposit' })}
        </Button>
      </View>

      <PayModal
        from="history"
        visible={payModalVisible}
        onClose={(refresh) => {
          if (refresh) {
            listRef.current?.reload();
          }
          setPayModalVisible(false);
        }}
      />
    </PageView>
  );
}

import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';

import List from '@/components/List';
import NavBar from '@/components/NavBar';
import Rate from '@/components/Rate';
import { getBotAppRate } from '@/services/pinglunjiqiren';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function RatingList() {
  const intl = useIntl();

  const { botId, rating } = useLocalSearchParams<{
    botId: string;
    rating: string;
  }>();

  const [total, setTotal] = useState(0);

  return (
    <View style={styles.page}>
      <NavBar title={intl.formatMessage({ id: 'RatingList.title' })} />
      <View style={styles.container}>
        <View style={styles.ratingListTop}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.ratingListCount}>{total}</Text>
            <Text
              style={{
                color: '#fff',
                fontSize: pxToDp(32),
                marginTop: pxToDp(60),
              }}>
              {intl.formatMessage({ id: 'RatingList.total' })}
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.ratingListCount}>{rating}</Text>
            <Rate
              value={parseInt(rating, 10)}
              size={pxToDp(42)}
              color="#A07BED"
              style={{
                marginTop: pxToDp(58),
              }}
            />
          </View>
        </View>
        <List
          request={async (params) => {
            const res = await getBotAppRate({
              pageNo: params.pageNo,
              pageSize: params.pageSize,
              botId,
            });

            setTotal(res.data.data.total || 0);
            return {
              data: res.data.data.list || [],
              total: res.data.data.total || 0,
            };
          }}
          footerProps={{
            noMoreText: '',
          }}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.ratingContent} key={item.id}>
              <View style={styles.ratingContentTop}>
                <Text style={{ color: '#fff', fontSize: pxToDp(32) }}>{item.username}</Text>
                <Text style={{ color: '#fff', opacity: 0.5 }}>
                  {dayjs(item.commentAt).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </View>
              <View style={{ marginTop: pxToDp(30) }}>
                <Rate value={item.rating || 0} color="#A07BED" />
              </View>
              <Text
                style={{
                  color: '#fff',
                  opacity: 0.6,
                  fontSize: pxToDp(24),
                  marginTop: pxToDp(46),
                }}>
                {item.content}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

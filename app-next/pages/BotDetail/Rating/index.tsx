import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { ScrollView, View, Text } from 'react-native';

import Rate from '@/components/Rate';
import { getBotAppRate } from '@/services/pinglunjiqiren';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function Rating({ botId, refreshKey, color }: { botId?: string; refreshKey: string; color?: string }) {
  const intl = useIntl();
  const { data: rateList } = useRequest(
    async () => {
      if (!botId) return [];

      const resp = await getBotAppRate({
        botId,
        pageNo: 1,
        pageSize: 5,
      });
      return resp.data.data.list;
    },
    {
      refreshDeps: [botId, refreshKey],
    },
  );
  return (
    <View style={styles.ratingMain}>
      <ScrollView horizontal style={styles.ScrollView} showsHorizontalScrollIndicator={false}>
        {(rateList || []).map((item, index) => (
          <View key={index} style={styles.ratingContent}>
            <View style={styles.ratingContentTop}>
              <Text style={{ color: '#fff', fontSize: pxToDp(32) }}>{item.username}</Text>
              <Text style={{ color: '#fff', opacity: 0.5 }}>{dayjs(item.commentAt).format('YYYY-MM-DD')}</Text>
            </View>
            <View style={{ marginTop: pxToDp(30) }}>
              <Rate color={color} value={item.rating || 0} />
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
        ))}
      </ScrollView>
      {rateList?.length === 0 && (
        <Text style={styles.ratingContentEmpty}>{intl.formatMessage({ id: 'bot.detail.rating.noData' })}</Text>
      )}
    </View>
  );
}

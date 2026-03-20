import { useCountDown } from 'ahooks';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';

import DotLoading from '@/components/DotLoading';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import { footerStyles } from './styles';
import { ListFooterProps } from './types';

export default function Footer(props: ListFooterProps) {
  const intl = useIntl();
  const {
    loading,
    hasMore,
    dataLength,
    moreText = intl.formatMessage({ id: 'components.List.Footer.More' }),
    noMoreText = intl.formatMessage({ id: 'components.List.Footer.NoMore' }),
    doneText = '',
  } = props;
  const { computedThemeColor } = useConfigProvider();

  const isCompleted = !loading && !hasMore && dataLength !== 0;

  const [leftTime, setLeftTime] = useState(0);
  useEffect(() => {
    setLeftTime(isCompleted ? 5 * 1000 : 0);
  }, [isCompleted]);

  const [countdown] = useCountDown({
    leftTime,
  });

  return (
    <View style={[footerStyles.container]}>
      {loading && <DotLoading size={pxToDp(10)} color={computedThemeColor.text} />}

      {!loading && hasMore && (
        <Text
          style={[
            footerStyles.text,
            {
              color: computedThemeColor.text,
            },
          ]}>
          {moreText}
        </Text>
      )}

      {isCompleted && (
        <Text
          style={[
            footerStyles.text,
            {
              color: computedThemeColor.text_secondary,
            },
          ]}>
          {noMoreText}
        </Text>
      )}

      {isCompleted && !!countdown && (
        <Text
          style={[
            footerStyles.text,
            {
              color: computedThemeColor.text,
            },
          ]}>
          {/* {intl.formatMessage({ id: 'components.List.Footer.Done' })} */}
          {doneText}
        </Text>
      )}
    </View>
  );
}

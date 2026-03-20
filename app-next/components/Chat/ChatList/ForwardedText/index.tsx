import { isEmpty } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { Text, View, ViewStyle } from 'react-native';

import { MessageItem } from '@/components/Chat/types';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

const ForwardedText = ({
  style,
  message,
  position,
}: {
  message: MessageItem;
  style?: ViewStyle;
  position?: 'left' | 'right';
}) => {
  const { computedThemeColor } = useConfigProvider();
  const intl = useIntl();
  if (isEmpty(message.forwardInfo)) {
    return null; // If no forward info, return null to avoid rendering
  }
  return (
    <View style={[{ marginBottom: pxToDp(24) }, style]}>
      <Text style={{ color: computedThemeColor.text_secondary, fontSize: pxToDp(24) }}>
        {intl.formatMessage({ id: 'chats.forwardedFrom' })}
      </Text>
      <Text
        style={{
          color: position === 'left' ? computedThemeColor.text_pink : computedThemeColor.text,
          fontSize: pxToDp(24),
        }}>
        {JSON.parse(message.forwardInfo || '{}')?.nickname}
      </Text>
    </View>
  );
};
export default ForwardedText;

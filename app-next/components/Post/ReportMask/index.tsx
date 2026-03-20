import React from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import Button from '@/components/Button';
import { CheckboxTwoTone, CloseSquareOutline } from '@/components/Icon';
import styles from '@/components/Post/styles';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

const ReportMask = ({
  onRemove,
  onShowPost,
  style,
}: {
  onRemove?: () => void;
  onShowPost?: () => void;
  style?: StyleProp<ViewStyle> | undefined;
}) => {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  return (
    <View style={[styles.reportMask, style]}>
      <TouchableOpacity style={styles.reportMaskClose} onPress={onRemove}>
        <CloseSquareOutline color={computedThemeColor.text_secondary} width={pxToDp(48)} height={pxToDp(48)} />
      </TouchableOpacity>
      <View style={styles.reportMaskContent}>
        <CheckboxTwoTone
          width={pxToDp(64)}
          height={pxToDp(64)}
          color={computedThemeColor.text_pink}
          twoToneColor={computedThemeColor.text}
        />
        <Text style={[styles.reportMaskContentTitle, { color: computedThemeColor.text }]}>
          {intl.formatMessage({ id: 'agora.post.reportMask.title' })}
        </Text>
        <Text style={[styles.reportMaskContentDescription, { color: computedThemeColor.text_secondary }]}>
          {intl.formatMessage({ id: 'agora.post.reportMask.description' })}
        </Text>
      </View>
      <Button type="primary" onPress={onShowPost}>
        {intl.formatMessage({ id: 'agora.post.reportMask.btn' })}
      </Button>
    </View>
  );
};

export default React.memo(ReportMask);

import { IntlShape } from 'react-intl/src/types';
import { Text, View, StyleSheet, Linking } from 'react-native';
import pxToDp from '@/utils/pxToDp';
import { Colors } from '@/constants/Colors';

export const POLICY_AND_TERMS = ({
  color,
  type,
  intl,
}: {
  color: (typeof Colors)['light'];
  type: 'policy' | 'terms' | 'deactivate';
  intl: IntlShape;
}) => {
  const styles = StyleSheet.create({
    contentTextRow: {},
    contentTextTitle: {
      marginBottom: pxToDp(10),
      fontSize: pxToDp(28),
      color: color.text,
    },
    contentTextP: {
      marginBottom: pxToDp(40),
      fontSize: pxToDp(28),
      color: color.text,
    },
    contentTextLink: {
      color: color.primary,
    },
  });
  const terms = [
    <Text key={`terms-1`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.1' })}
    </Text>,
    <Text key={`terms-2`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.2' })}
    </Text>,
    <Text key={`terms-3`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.2.1' })}
    </Text>,
    <Text key={`terms-4`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.2.2' })}
    </Text>,
    <Text key={`terms-5`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.3' })}
    </Text>,
    <Text key={`terms-6`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.3' })}
    </Text>,
    <Text key={`terms-7`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.4' })}
    </Text>,
    <Text key={`terms-8`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.4.1' })}
    </Text>,
    <Text key={`terms-9`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.4.2' })}
    </Text>,
    <Text key={`terms-10`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.5' })}
    </Text>,
    <Text key={`terms-11`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.5.1' })}
    </Text>,
    <Text key={`terms-12`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.5.2' })}
    </Text>,
    <Text key={`terms-13`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.5.3' })}
    </Text>,
    <Text key={`terms-14`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.5.4' })}
    </Text>,
    <Text key={`terms-15`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.5.5' })}
    </Text>,
    <Text key={`terms-16`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.5.6' })}
    </Text>,
    <Text key={`terms-17`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.6' })}
    </Text>,
    <Text key={`terms-18`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.6.1' })}
    </Text>,
    <Text key={`terms-19`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.6.2' })}
    </Text>,
    <Text key={`terms-20`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.6.3' })}
    </Text>,
    <Text key={`terms-21`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.6.4' })}
    </Text>,
    <Text key={`terms-22`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.6.5' })}
    </Text>,
    <Text key={`terms-23`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.7' })}
    </Text>,
    <Text key={`terms-24`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.7.1' })}
    </Text>,
    <Text key={`terms-25`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.7.2' })}
    </Text>,
    <Text key={`terms-26`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.7.3' })}
    </Text>,
    <Text key={`terms-27`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.8' })}
    </Text>,
    <Text key={`terms-28`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.8.1' })}
    </Text>,
    <Text key={`terms-29`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.8.2' })}
    </Text>,
    <Text key={`terms-30`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.9' })}
    </Text>,
    <Text key={`terms-31`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.9.1' })}
    </Text>,
    <Text key={`terms-32`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.9.2' })}
    </Text>,
    <Text key={`terms-33`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.9.3' })} [
      <Text
        style={styles.contentTextLink}
        onPress={() => {
          Linking.openURL(
            `https://support.apple.com/en-kz/118223#:~:text=Tap%20or%20click%20%22I'd,can%20also%20cancel%20the%20subscription.`,
          );
        }}>
        https://support.apple.com/en-kz/118223#:~:text=Tap%20or%20click%20%22I&#39;d,can%20also%20cancel%20the%20subscription.
      </Text>
      ]
    </Text>,
    <Text key={`terms-34`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.9.4' })} [
      <Text
        style={styles.contentTextLink}
        onPress={() => {
          Linking.openURL(`https://support.google.com/googleplay/answer/2479637?sjid=9857920523491701249-EU#policy`);
        }}>
        https://support.google.com/googleplay/answer/2479637?sjid=9857920523491701249-EU#policy
      </Text>
      ]
    </Text>,
    <Text key={`terms-35`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.9.5' })}
    </Text>,
    <Text key={`terms-36`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.9.6' })}
    </Text>,
    <Text key={`terms-37`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.10' })}
    </Text>,
    <Text key={`terms-38`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.10.1' })}
    </Text>,
    <Text key={`terms-39`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.10.2' })}
    </Text>,
    <Text key={`terms-40`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.10.3' })}
    </Text>,
    <Text key={`terms-41`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.10.4' })}
    </Text>,
    <Text key={`terms-42`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.10.5' })}
    </Text>,
    <Text key={`terms-43`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.10.6' })}
    </Text>,
    <Text key={`terms-44`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.11' })}
    </Text>,
    <Text key={`terms-45`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.11' })}
    </Text>,
    <Text key={`terms-46`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.12' })}
    </Text>,
    <Text key={`terms-47`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.12' })}
    </Text>,
    <Text key={`terms-48`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.13' })}
    </Text>,
    <Text key={`terms-49`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.13' })}
    </Text>,
    <Text key={`terms-50`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.14' })}
    </Text>,
    <Text key={`terms-51`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.14' })}
    </Text>,
    <Text key={`terms-52`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.15' })}
    </Text>,
    <Text key={`terms-53`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.15' })}
    </Text>,
    <Text key={`terms-54`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.16' })}
    </Text>,
    <Text key={`terms-55`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.16' })}
    </Text>,
    <Text key={`terms-56`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.17' })}
    </Text>,
    <Text key={`terms-57`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.17' })}
    </Text>,
    <Text key={`terms-58`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.18' })}
    </Text>,
    <Text key={`terms-59`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.18.1' })}
    </Text>,
    <Text key={`terms-60`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.18.2' })}
    </Text>,
    <Text key={`terms-61`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.18.3' })}
    </Text>,
    <Text key={`terms-62`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.18.4' })}
    </Text>,
    <Text key={`terms-63`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.18.5' })}
      <Text
        style={styles.contentTextLink}
        onPress={() => {
          Linking.openURL('https://arbitrage.kz/custom/wysiwyg/image/file/20210506/20210506152921_60773.pdf');
        }}>
        https://arbitrage.kz/custom/wysiwyg/image/file/20210506/20210506152921_60773.pdf
      </Text>
      {intl.formatMessage({ id: 'terms.paragraph.text.18.6' })}
    </Text>,
    <Text key={`terms-64`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.18.7' })}
    </Text>,
    <Text key={`terms-65`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.18.8' })}
    </Text>,
    <Text key={`terms-66`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'terms.paragraph.title.19' })}
    </Text>,
    <Text key={`terms-67`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.19.1' })}
    </Text>,
    <Text key={`terms-68`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'terms.paragraph.text.19.2' })}
    </Text>,
  ].map((item, index) => {
    return (
      <View key={index} style={styles.contentTextRow}>
        {item}
      </View>
    );
  });

  const policy = [
    <Text key={`policy-1`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'policy.paragraph.title.1' })}
    </Text>,
    <Text key={`policy-2`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'policy.paragraph.text.1' })}
    </Text>,
    <Text key={`policy-3`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'policy.paragraph.title.2' })}
    </Text>,
    <Text key={`policy-4`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'policy.paragraph.text.2' })}
    </Text>,
    <Text key={`policy-5`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'policy.paragraph.title.3' })}
    </Text>,
    <Text key={`policy-6`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'policy.paragraph.text.3' })}
    </Text>,
    <Text key={`policy-7`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'policy.paragraph.title.4' })}
    </Text>,
    <Text key={`policy-8`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'policy.paragraph.text.4' })}
    </Text>,
    <Text key={`policy-9`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'policy.paragraph.title.5' })}
    </Text>,
    <Text key={`policy-10`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'policy.paragraph.text.5' })}
    </Text>,
    <Text key={`policy-11`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'policy.paragraph.title.6' })}
    </Text>,
    <Text key={`policy-12`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'policy.paragraph.text.6' })}
    </Text>,
    <Text key={`policy-13`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'policy.paragraph.title.7' })}
    </Text>,
    <Text key={`policy-14`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'policy.paragraph.text.7.1' })}
    </Text>,
    <Text key={`policy-15`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'policy.paragraph.text.7.2' })}
    </Text>,
  ].map((item, index) => {
    return (
      <View key={index} style={styles.contentTextRow}>
        {item}
      </View>
    );
  });
  const deactivate = [
    <Text key={`deactivate-1`} style={styles.contentTextTitle}>
      {intl.formatMessage({ id: 'deactivate.paragraph.title' })}
    </Text>,
    <Text key={`deactivate-2`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'deactivate.paragraph.text.1' })}
    </Text>,
    <Text key={`deactivate-3`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'deactivate.paragraph.text.2' })}
    </Text>,
    <Text key={`deactivate-4`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'deactivate.paragraph.text.3' })}
    </Text>,
    <Text key={`deactivate-5`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'deactivate.paragraph.text.4' })}
    </Text>,
    <Text key={`deactivate-6`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'deactivate.paragraph.text.5' })}
    </Text>,
    <Text key={`deactivate-7`} style={styles.contentTextP}>
      {intl.formatMessage({ id: 'deactivate.paragraph.text.6' })}
    </Text>,
  ].map((item, index) => {
    return (
      <View key={index} style={styles.contentTextRow}>
        {item}
      </View>
    );
  });
  return {
    policy,
    terms,
    deactivate,
  }[type || 'policy'];
};

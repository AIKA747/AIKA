import { router } from 'expo-router';
import { useIntl } from 'react-intl';
import { View, Text } from 'react-native';

import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';

import styles from './styles';

export default function Account() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  const { userInfo } = useAuth();
  return (
    <View style={[styles.container]}>
      <View style={[styles.title]}>
        <Text
          style={[
            styles.titleText,
            {
              color: computedThemeColor.text,
            },
          ]}>
          Email
        </Text>
        <View
          style={[
            styles.itemGap,
            {
              backgroundColor: computedThemeColor.bg_secondary,
            },
          ]}
        />
        <Text
          style={[
            styles.itemValue,
            {
              color: computedThemeColor.text,
            },
          ]}>
          {userInfo?.email || '-'}
        </Text>
        {userInfo?.loginType && !['apple', 'facebook'].includes(userInfo?.loginType) ? (
          <Button
            style={[styles.titleButton]}
            size="small"
            type="ghost"
            onPress={() => {
              router.push({
                pathname: '/main/updateEmail',
              });
            }}>
            {intl.formatMessage({ id: 'Edit' })}
          </Button>
        ) : null}
      </View>
    </View>
  );
}

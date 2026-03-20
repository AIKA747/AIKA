import { useCountDown } from 'ahooks';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView } from 'react-native';

import Button from '@/components/Button';
import NavBar from '@/components/NavBar';
import { useConfigProvider } from '@/hooks/useConfig';
import { postUserPublicUserResetPwdEmail } from '@/services/zhongzhimima';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function VerifyEmailToRestPwd() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  const { email } = useLocalSearchParams<{
    clientCode: string;
    email: string;
  }>();

  const [targetDate] = useState<number>(Date.now() + 60 * 1000);
  const [countdown] = useCountDown({ targetDate });

  return (
    <View style={[styles.page, { backgroundColor: computedThemeColor.bg_primary }]}>
      <NavBar title={intl.formatMessage({ id: 'Back' })} />
      <ScrollView>
        <View style={[styles.container]}>
          <Text style={[styles.title, { color: computedThemeColor.text }]}>
            {intl.formatMessage({ id: 'VerifyEmailToRestPwd.title2' })}
          </Text>
          <Text style={[styles.tips, { color: computedThemeColor.text }]}>
            {intl.formatMessage({ id: 'VerifyEmailToRestPwd.tips' })}
          </Text>
          <View style={[styles.buttons]}>
            <Button
              type="primary"
              borderType="square"
              textStyle={{ lineHeight: pxToDp(34) }}
              onPress={async () => {
                router.dismissAll();
                router.push('/login');
              }}>
              {intl.formatMessage({ id: 'Continue' })}
            </Button>
            <Button
              style={{ marginTop: pxToDp(20) }}
              type="default"
              borderType="square"
              textStyle={{ lineHeight: pxToDp(34) }}
              onPress={async () => {
                const resp = await postUserPublicUserResetPwdEmail({ email });

                router.replace({
                  pathname: '/verifyEmailToRestPwd',
                  params: { clientCode: resp.data.data, email },
                });
              }}>
              {`${intl.formatMessage({ id: 'VerifyEmailToRestPwd.resend' })}${countdown ? ` (${Math.ceil(countdown / 1000)}s)` : ''}`}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

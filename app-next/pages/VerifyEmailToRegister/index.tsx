import { useCountDown } from 'ahooks';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import NavBar from '@/components/NavBar';
import TextGradient from '@/components/TextGradient';
import { useAuth } from '@/hooks/useAuth';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getUserPublicRefreshToken, postUserPublicVerifyEmail } from '@/services/dengluzhuce';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function VerifyEmailToRegister() {
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const { clientCode, email, password, country } = useLocalSearchParams<{
    clientCode: string;
    email: string;
    password: string;
    country: string;
  }>();

  const [targetDate] = useState<number>(Date.now() + 60 * 1000);
  const [countdown] = useCountDown({ targetDate });

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <NavBar title={intl.formatMessage({ id: 'Back' })} />
      <View style={[styles.container]}>
        <View style={[styles.content]}>
          <Image
            style={styles.img}
            source={
              computedTheme === Theme.LIGHT
                ? require('@/assets/images/verify.email.dark.png')
                : require('@/assets/images/verify.email.light.png')
            }
            contentFit="cover"
          />
          <TextGradient
            style={[styles.title]}
            content={intl.formatMessage({ id: 'VerifyEmailToRegister.title2' })}
            fontSize={pxToDp(64)}
          />
          <Text
            style={[
              styles.tips,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {intl.formatMessage({ id: 'VerifyEmailToRegister.tips' })} {email}
          </Text>
        </View>
        <View style={[styles.buttons]}>
          <Button
            wrapperStyle={{
              marginTop: pxToDp(20),
              marginBottom: pxToDp(60),
            }}
            type="text"
            size="small"
            onPress={async () => {
              const resp = await postUserPublicVerifyEmail({
                email,
                password,
                country,
              });

              if (resp.data.code === 0 && resp.data.data) {
                router.replace({
                  pathname: '/verifyEmailToRegister',
                  params: {
                    clientCode: resp.data.data,
                    email,
                    password,
                    country,
                  },
                });
              }
            }}>
            {`${intl.formatMessage({ id: 'VerifyEmailToRegister.resend' })}${countdown ? ` (${Math.ceil(countdown / 1000)}s)` : ''}`}
          </Button>
          <Button
            type="primary"
            wrapperStyle={{
              marginBottom: insets.bottom,
            }}
            onPress={async () => {
              // 网页调用 /register-email-verify
              const resp = await getUserPublicRefreshToken({
                clientCode,
              });
              const token = resp.data?.data?.token;

              if (token && resp.data.code === 0) {
                await signIn(token);
                if (resp.data.data.firstLogin) {
                  router.replace('/verifyEmailToRegisterSuccess');
                } else {
                  router.replace('/');
                  if (resp.data.data.status === 'uncompleted') {
                    router.push({ pathname: '/main/profileFill' });
                  }
                }
              }
            }}>
            {intl.formatMessage({ id: 'VerifyEmailToRegister.Confirm' })}
          </Button>
        </View>
      </View>
    </View>
  );
}

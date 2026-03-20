import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useIntl } from 'react-intl';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import NavBar from '@/components/NavBar';
import TextGradient from '@/components/TextGradient';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function VerifyEmailToRegisterSuccess() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  const insets = useSafeAreaInsets();

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
          <Image style={styles.img} source={require('@/assets/images/verify.success.png')} contentFit="cover" />
          <TextGradient style={[styles.title]} content="Account created" fontSize={pxToDp(64)} />
          <TextGradient style={[styles.title]} content="successfully!" fontSize={pxToDp(64)} />
          <Text
            style={[
              styles.tips,
              {
                color: computedThemeColor.text,
              },
            ]}>
            {intl.formatMessage({ id: 'VerifyEmailToRegisterSuccess.Done' })}
          </Text>
        </View>
        <View style={[styles.buttons]}>
          <Button
            type="primary"
            wrapperStyle={{
              marginBottom: insets.bottom,
            }}
            onPress={async () => {
              router.replace('/');
              router.push({ pathname: '/main/profileFill' });
            }}>
            {intl.formatMessage({ id: 'Continue' })}
          </Button>
        </View>
      </View>
    </View>
  );
}

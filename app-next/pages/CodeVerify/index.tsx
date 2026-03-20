import { useCountDown, useRequest } from 'ahooks';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import CodeInput from '@/components/CodeInput';
import { LoadingOutline } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import Toast from '@/components/Toast';
import keyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { postUserAppUserEmailVerify } from '@/services/biangengyouxiang';
import { postUserPublicV2VerifyEmail, putUserPublicRegisterEmailVerify } from '@/services/dengluzhuce';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

const intervalMilliseconds = 60 * 1000;

export default function CodeVerify() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  // 根据 successRedirect 判断来自哪种验证，页面样式有所区别，以及接口调用有所区别
  // successRedirect 为 '/personalInfoFillNew' 时，为注册时邮箱验证
  // successRedirect 为 '/updateEmailSucceed' 时，为更改时邮箱验证
  const {
    clientCode,
    codeLength = 6,
    email,
    password,
    successRedirect,
  } = useLocalSearchParams<{
    clientCode: string;
    codeLength?: string;
    email: string;
    password: string;
    successRedirect: '/personalInfoFillNew' | '/updateEmailSucceed';
  }>();

  const isFromRegister = successRedirect === '/personalInfoFillNew';
  const isFromUpdate = successRedirect === '/updateEmailSucceed';

  const [verifyCode, setVerifyCode] = useState<string>('');

  const [targetDate, setTargetDate] = useState<number>(Date.now() + intervalMilliseconds);
  const [countdown] = useCountDown({ targetDate });

  // 验证
  const { runAsync: fetchVerify, loading } = useRequest(
    async () => {
      const data = { clientCode, verifyCode };
      const res = await putUserPublicRegisterEmailVerify(data);
      if (res.data.code !== 0) {
        res.data?.msg &&
          Toast.error(
            res.data.msg === 'The verification code is incorrect'
              ? intl.formatMessage({ id: 'register.verify.code.error' })
              : res.data.msg,
          );
        return;
      }
      if (res.data?.data) await signIn(res.data.data);
      await new Promise((resolve) => setTimeout(resolve, 200));
      router.replace(successRedirect);
    },
    { manual: true },
  );

  const [sending, setSending] = useState<boolean>(false);
  const handleResend = async () => {
    setSending(true);
    try {
      if (isFromRegister) {
        const res = await postUserPublicV2VerifyEmail({ email, password });
        if (res.data?.code !== 0) return;
        router.setParams({ clientCode: res.data.data.clientCode });
        setTargetDate(Date.now() + intervalMilliseconds);
      } else if (isFromUpdate) {
        const res = await postUserAppUserEmailVerify({ email });
        if (res.data?.code !== 0) return;
        router.setParams({ clientCode: res.data.data });
        setTargetDate(Date.now() + intervalMilliseconds);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={keyboardAvoidingViewBehavior}
      style={{ flex: 1, backgroundColor: computedThemeColor.bg_primary }}>
      <NavBar />
      <View
        style={[
          styles.page,
          {
            // paddingTop: isFromRegister ? insets.top : 0,
            paddingBottom: insets.bottom,
            paddingHorizontal: pxToDp(16 * 2),
          },
        ]}>
        <View style={{ marginTop: isFromRegister ? pxToDp(36) : pxToDp(20) }}>
          {isFromRegister && (
            <>
              <Text style={{ fontSize: pxToDp(64), lineHeight: pxToDp(80), color: '#A07BED' }}>
                {intl.formatMessage({ id: 'register.verify.title' })}
              </Text>
              <Text style={[styles.caption, { color: computedThemeColor.text }]}>
                {intl.formatMessage({ id: 'register.verify.caption' })}
              </Text>
            </>
          )}
          {isFromUpdate && (
            <Text style={[styles.updateCaption, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'register.verify.emailCaption' })}
            </Text>
          )}

          <CodeInput value={verifyCode} onChange={setVerifyCode} length={+codeLength} />
          <View style={{ flexDirection: 'row', marginTop: pxToDp(20 * 2) }}>
            <Text style={{ fontSize: pxToDp(12 * 2), color: computedThemeColor.text_secondary }}>
              {intl.formatMessage({ id: 'register.verify.receive' })}{' '}
            </Text>
            {sending ? (
              <LoadingOutline width={pxToDp(32)} height={pxToDp(32)} color={computedThemeColor.primary} />
            ) : (
              <TouchableOpacity disabled={countdown > 0} onPress={handleResend}>
                <Text
                  style={{
                    fontSize: pxToDp(12 * 2),
                    color: countdown > 0 ? computedThemeColor.text_secondary : computedThemeColor.primary,
                    textDecorationLine: 'underline',
                  }}>
                  {intl.formatMessage(
                    { id: countdown > 0 ? 'register.verify.resend' : 'register.verify.done' },
                    { s: countdown > 0 ? Math.round(countdown / 1000) : '' },
                  )}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Button type="primary" borderType="square" loading={loading} onPress={fetchVerify}>
          {intl.formatMessage({ id: 'register.verify.btn' })}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

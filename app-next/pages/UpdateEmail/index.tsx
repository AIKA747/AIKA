import { useRequest } from 'ahooks';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import NavBar from '@/components/NavBar';
import Toast from '@/components/Toast';
import keyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useConfigProvider } from '@/hooks/useConfig';
import { postUserAppUserEmailVerify } from '@/services/biangengyouxiang';
import pxToDp from '@/utils/pxToDp';
import { validateEmail } from '@/utils/validate';

import styles from './styles';

export default function UpdateEmail() {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor } = useConfigProvider();
  const { email: currentEmail } = useLocalSearchParams<{ email: string }>();
  const [email, setEmail] = useState('');

  const { run: handleSubmit, loading } = useRequest(
    async () => {
      if (!validateEmail(email)) {
        Toast.error(intl.formatMessage({ id: 'login.form.email.validate' }));
        return;
      }

      const res = await postUserAppUserEmailVerify({ email });
      if (res.data?.code === 0) {
        const clientCode = res.data.data;
        router.push({
          pathname: '/codeVerify',
          params: {
            clientCode,
            codeLength: 6,
            email,
            successRedirect: '/updateEmailSucceed',
          },
        });
      } else {
        res.data?.msg && Toast.error(res.data.msg);
      }
    },
    { manual: true },
  );

  return (
    <KeyboardAvoidingView
      behavior={keyboardAvoidingViewBehavior}
      style={[{ flex: 1 }, { backgroundColor: computedThemeColor.bg_primary }]}>
      <NavBar />
      <View
        style={[
          styles.page,
          {
            paddingBottom: insets.bottom,
            paddingHorizontal: pxToDp(16 * 2),
          },
        ]}>
        <View>
          <View style={styles.formItem}>
            <Text style={[styles.formLabel, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'ProfileEdit.currentEmail' })}
            </Text>
            <TextInput
              editable={false}
              keyboardType="email-address"
              placeholder="example@mail.com"
              placeholderTextColor="#80878E"
              style={[
                styles.formContent,
                { backgroundColor: computedThemeColor.bg_secondary, color: computedThemeColor.text },
              ]}
              value={currentEmail}
            />
          </View>

          <View style={styles.formItem}>
            <Text style={[styles.formLabel, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'ProfileEdit.newEmail' })}
            </Text>
            <TextInput
              keyboardType="email-address"
              placeholder="example@mail.com"
              placeholderTextColor="#80878E"
              style={[
                styles.formContent,
                { backgroundColor: computedThemeColor.bg_secondary, color: computedThemeColor.text },
              ]}
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
            />
          </View>
        </View>

        {email && email !== currentEmail && (
          <Button type="primary" borderType="square" loading={loading} onPress={handleSubmit}>
            {intl.formatMessage({ id: 'register.verify.btn' })}
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

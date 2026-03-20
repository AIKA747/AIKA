import { router } from 'expo-router';
import React from 'react';
import { useIntl } from 'react-intl';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import { CheckboxTwoTone } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';

import styles from './styles';

export default function UpdateEmailSucceed() {
  const intl = useIntl();
  const { userInfo } = useAuth();
  const insets = useSafeAreaInsets();
  const { computedThemeColor } = useConfigProvider();

  return (
    <PageView style={[styles.page, { paddingBottom: insets.bottom, backgroundColor: computedThemeColor.bg_primary }]}>
      <NavBar onBack={() => router.dismiss(3)} />
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.row}>
            <Text style={[styles.verifiedText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'ProfileEdit.newEmail.verified' })}
            </Text>
            <CheckboxTwoTone
              style={styles.passedIcon}
              color={computedThemeColor.text_green}
              twoToneColor="#fff"
              checked
            />
          </View>
          <Text style={[styles.verifiedText, { color: '#80878E' }]}>{userInfo?.email}</Text>
        </View>

        <Button type="primary" borderType="square" onPress={() => router.dismiss(3)}>
          {intl.formatMessage({ id: 'ProfileEdit.newEmail.verified.back' })}
        </Button>
      </View>
    </PageView>
  );
}

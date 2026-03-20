import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';

import { RadioCheckTwoTone } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

const genderOpts = ['MALE', 'FEMALE', 'NON_BINARY', 'HIDE'] as const;

export function UpdateGender() {
  const intl = useIntl();
  const { computedThemeColor, setPageShareData } = useConfigProvider();
  const router = useRouter();
  const { gender } = useLocalSearchParams<{ gender: string }>();
  const [selectedGender, setSelectedGender] = useState<string>(gender || 'HIDE');
  const handleSubmit = useCallback(() => {
    setPageShareData({ gender: selectedGender });
    router.back();
  }, [router, selectedGender, setPageShareData]);

  return (
    <PageView style={[styles.page, { backgroundColor: computedThemeColor.bg_primary }]}>
      <NavBar
        more={
          <TouchableOpacity onPress={handleSubmit} style={{ marginRight: pxToDp(16 * 2) }}>
            <Text style={{ fontSize: pxToDp(32), lineHeight: pxToDp(48), color: '#A07BED' }}>
              {intl.formatMessage({ id: 'updateEmail.done' })}
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.container}>
        <Text style={[styles.formLabel, { color: computedThemeColor.text }]}>
          {intl.formatMessage({ id: 'personalInfo.gender' })}
        </Text>
        <View
          style={[
            styles.formContent,
            {
              paddingVertical: pxToDp(16 * 2),
              backgroundColor: computedThemeColor.bg_secondary,
            },
          ]}>
          {genderOpts.map((opt, index) => (
            <TouchableOpacity
              key={opt}
              style={[styles.genderItem, { marginTop: index ? pxToDp(16 * 2) : 0 }]}
              onPress={() => setSelectedGender(opt)}>
              <Text
                style={{
                  fontSize: pxToDp(16 * 2),
                  color: selectedGender === opt ? computedThemeColor.text : computedThemeColor.text_secondary,
                }}>
                {intl.formatMessage({ id: `personalInfo.gender.${opt}` })}
              </Text>
              <RadioCheckTwoTone
                color={selectedGender === opt ? computedThemeColor.text_pink : computedThemeColor.text_secondary}
                twoToneColor="#fff"
                width={pxToDp(24 * 2)}
                height={pxToDp(24 * 2)}
                checked={selectedGender === opt}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </PageView>
  );
}

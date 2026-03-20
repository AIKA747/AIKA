import { useRequest } from 'ahooks';
import { router } from 'expo-router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import Toast from '@/components/Toast';
import keyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { getUserAppInterestItems, patchUserAppInfo } from '@/services/userService';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

type InterestItem = Awaited<ReturnType<typeof getUserAppInterestItems>>['data']['data'][number];

export default function InterestFill() {
  const intl = useIntl();
  const { signIn } = useAuth();
  const { computedThemeColor } = useConfigProvider();
  const insets = useSafeAreaInsets();

  const [state, setState] = useState<Record<string, Record<string, 0 | 1>>>({});

  const { data = {} } = useRequest(async () => {
    const res = await getUserAppInterestItems({ itemType: 'OTHER' });
    const list = res.data?.data || [];
    const interestMap: Record<string, InterestItem[]> = {};
    const state: Record<string, Record<string, 0 | 1>> = {};
    for (const item of list) {
      if (!item.itemType) continue;
      const key = item.itemType.toLowerCase();
      if (!interestMap[key]) interestMap[key] = [];
      interestMap[key].push(item);
      if (!state[key]) state[key] = {};
      state[key][item.id!] = 0;
    }
    setState(state);
    Object.keys(interestMap).forEach((key) => {
      interestMap[key] = interestMap[key].sort((a, b) => a.orderNum! - b.orderNum!);
    });
    return interestMap;
  });

  const { runAsync, loading } = useRequest(
    async () => {
      const res = await patchUserAppInfo(state);
      if (res.data?.code !== 0) return res.data?.msg && Toast.error(res.data.msg);
      if (res.data?.data?.token) await signIn(res.data.data.token);
      router.push('/main/recommendedFollow');
    },
    { manual: true },
  );

  return (
    <KeyboardAvoidingView behavior={keyboardAvoidingViewBehavior} style={{ flex: 1 }}>
      <View
        style={[
          styles.page,
          { backgroundColor: computedThemeColor.bg_primary },
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + (Platform.OS === 'android' ? pxToDp(24) : 0),
          },
        ]}>
        <View style={{ marginTop: pxToDp(14 * 2), paddingHorizontal: pxToDp(16 * 2) }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: pxToDp(64), lineHeight: pxToDp(80), color: '#A07BED' }}>
                {intl.formatMessage({ id: 'interestFill.title.1' })}
              </Text>
              <Text style={{ fontSize: pxToDp(64), lineHeight: pxToDp(80), color: '#A07BED' }}>
                {intl.formatMessage({ id: 'interestFill.title.2' })}
              </Text>

              <Text style={[styles.caption, { color: computedThemeColor.text_secondary }]}>
                {intl.formatMessage({ id: 'interestFill.caption.1' })}
                {'\n'}
                {intl.formatMessage({ id: 'interestFill.caption.2' })}
              </Text>
            </View>
            <TouchableOpacity style={styles.skip} onPress={() => router.push('/main/recommendedFollow')}>
              <Text style={{ fontSize: pxToDp(16 * 2), color: computedThemeColor.text_secondary }}>
                {intl.formatMessage({ id: 'interestFill.skip' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {Object.keys(data).map((key, index, arr) => (
            <View
              key={key}
              style={{
                marginBottom: pxToDp(20 * 2),
                borderBottomColor: 'rgba(255,255,255,0.1)',
                borderBottomWidth: index === arr.length - 1 ? 0 : pxToDp(2),
              }}>
              <Text style={[styles.label, { color: computedThemeColor.text }]}>
                {data[key][0]?.itemTypeLab
                  ? `${data[key][0].itemTypeLab[0].toUpperCase()}${data[key][0].itemTypeLab.slice(1).toLowerCase()}`
                  : `${key[0].toUpperCase()}${key.slice(1)}`}
              </Text>
              <ScrollView horizontal style={styles.itemsScrollBox} contentContainerStyle={styles.itemContainerBox}>
                {data[key].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.item,
                      state[item.itemType!.toLowerCase()][item.id!] ? styles.itemSelected : undefined,
                    ]}
                    onPress={() =>
                      setState((state) => {
                        const newState = { ...state };
                        newState[item.itemType!.toLowerCase()] = {
                          ...newState[item.itemType!.toLowerCase()],
                          [item.id!]: 1 - newState[item.itemType!.toLowerCase()][item.id!],
                        };
                        return newState;
                      })
                    }>
                    <Text
                      style={[
                        styles.itemText,
                        { color: computedThemeColor.text },
                        state[item.itemType!.toLowerCase()][item.id!] ? styles.itemTextSelected : undefined,
                      ]}>
                      {item.itemNameLab || item.itemName}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/*<TouchableOpacity style={[styles.item, styles.itemSelected]}>*/}
                {/*  <Text style={[styles.itemText, styles.itemTextSelected]}>Basketball</Text>*/}
                {/*</TouchableOpacity>*/}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
        <Button
          type="primary"
          style={{ marginHorizontal: pxToDp(16 * 2) }}
          // @ts-ignore
          onPress={runAsync}
          loading={loading}
          borderType="square">
          {intl.formatMessage({ id: 'Continue' })}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

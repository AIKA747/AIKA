import { useGlobalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { ListBillOutline, NotesFilled } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import FairyTales from './FairyTales';
import Progress from './Progress';
import styles from './styles';

export default function Notifications() {
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const intl = useIntl();

  const TABS = [
    {
      title: intl.formatMessage({ id: 'FairyTales.tab.1' }),
      iconName: 'fairyTale',
    },
    {
      title: intl.formatMessage({ id: 'FairyTales.tab.2' }),
      iconName: 'fairyTale_progress',
    },
  ];

  const [activeTab, setActiveTab] = useState<number>(0);

  const { from } = useGlobalSearchParams<{
    from: 'sphere';
  }>();

  const Icon = ({
    name,
    size,
    ...rest
  }: {
    name: string;
    size: number;
    style: StyleProp<ViewStyle>;
    color: string;
  }) => {
    switch (name) {
      case 'fairyTale':
        return <NotesFilled width={size} height={size} {...rest} />;
      case 'fairyTale_progress':
        return <ListBillOutline width={size} height={size} {...rest} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={KeyboardAvoidingViewBehavior}
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <NavBar
        title={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                color: computedThemeColor.text,
                fontFamily: 'ProductSansBold',
                fontSize: pxToDp(32),
              }}>
              {intl.formatMessage({ id: 'FairyTales.title' })}
            </Text>
          </View>
        }
      />
      <View style={[styles.container]}>
        {from !== 'sphere' ? (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: computedThemeColor.bg_secondary,
              marginBottom: pxToDp(32),
            }}>
            {TABS.map((tab, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveTab(index)}
                style={[
                  styles.tabBtn,
                  activeTab === index
                    ? {
                        borderBottomWidth: pxToDp(2),
                        borderBottomColor: '#A07BED',
                        backgroundColor: 'rgba(160, 123, 237, .2)',
                      }
                    : undefined,
                ]}>
                <Icon
                  name={tab.iconName as any}
                  size={pxToDp(40)}
                  style={{ marginRight: pxToDp(10) }}
                  color={activeTab === index ? '#A07BED' : computedTheme === Theme.LIGHT ? '#80878E' : '#A07BED73'}
                />

                <Text
                  style={{
                    fontSize: pxToDp(32),
                    color: activeTab === index ? '#A07BED' : computedTheme === Theme.LIGHT ? '#80878E' : '#A07BED73',
                  }}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : undefined}
        <View style={[styles.container]}>
          {activeTab === 0 ? <FairyTales /> : undefined}
          {activeTab === 1 ? <Progress /> : undefined}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

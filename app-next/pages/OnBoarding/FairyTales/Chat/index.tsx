import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StarsMinimalisticOutline } from '@/components/Icon';
import Modal from '@/components/Modal';
import PageView from '@/components/PageView';
import { IsHideCopilot } from '@/constants/StorageKey';
import { useConfigProvider } from '@/hooks/useConfig';
import { useStorageState } from '@/hooks/useStorageState';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

const WalkthroughableView = walkthroughable(View);
export default function FairyTaleSummary() {
  const intl = useIntl();
  const { start, goToNth, isLastStep, copilotEvents } = useCopilot();
  const { computedThemeColor } = useConfigProvider();
  const insets = useSafeAreaInsets();
  const [isHideCopilot, setIsHideCopilot, isLoadedCopilot] = useStorageState<boolean>(IsHideCopilot, false);

  const [showCopilotModal, setShowCopilotModal] = useState<boolean>(false);

  useEffect(() => {
    if (!isLastStep) return;
    const listener = () => {
      console.log('CopilotEvents Stop');
      setShowCopilotModal(true);
    };
    copilotEvents.on('stop', listener);

    return () => {
      copilotEvents.off('stop', listener);
    };
  }, [copilotEvents, isLastStep]);

  return (
    <PageView
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}
      source={require('@/assets/images/onboarding/chat.png')}>
      <View
        onLayout={() => {
          requestAnimationFrame(() => {
            start();
            goToNth(9);
          });
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <CopilotStep name={'Input'} order={9} text={intl.formatMessage({ id: 'copilot.fairy-tales-item-input' })}>
          <WalkthroughableView style={{ gap: pxToDp(4) }}>
            <View
              style={{
                backgroundColor: '#0B0C0A',
                paddingBottom: insets.bottom,
              }}>
              <Image
                style={{
                  width: '100%',
                  height: pxToDp(104),
                }}
                source={require('@/assets/images/onboarding/input.png')}
              />
            </View>
          </WalkthroughableView>
        </CopilotStep>
      </View>
      <Modal maskBlur visible={showCopilotModal} containerStyle={{ backgroundColor: 'transparent' }}>
        <View style={{ gap: pxToDp(24) }}>
          <View style={{ padding: pxToDp(32), backgroundColor: computedThemeColor.primary, borderRadius: pxToDp(40) }}>
            <Text style={{ color: computedThemeColor.text, fontSize: pxToDp(36) }}>
              {intl.formatMessage({ id: 'copilot.fairy-tales-item-model-title' })}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: pxToDp(24) }}>
            <View style={{ flex: 1, height: pxToDp(315), borderRadius: pxToDp(40), overflow: 'hidden' }}>
              <Image
                source={require('@/assets/images/copilot/story-01.png')}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <View style={{ flex: 1, height: pxToDp(315), borderRadius: pxToDp(40), overflow: 'hidden' }}>
              <Image
                source={require('@/assets/images/copilot/story-02.png')}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: pxToDp(24) }}>
            <View
              style={{
                backgroundColor: computedThemeColor.primary,
                flex: 1,
                height: pxToDp(100),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: pxToDp(24),
              }}>
              <Text style={{ fontSize: pxToDp(60) }}>☹️</Text>
            </View>
            <View
              style={{
                backgroundColor: computedThemeColor.primary,
                flex: 1,
                height: pxToDp(100),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: pxToDp(24),
              }}>
              <Text style={{ fontSize: pxToDp(60) }}>🙂</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: pxToDp(42) }}>
            <TouchableOpacity
              activeOpacity={0.65}
              style={{
                flexDirection: 'row',
                gap: pxToDp(14),
                backgroundColor: '#fff',
                borderRadius: pxToDp(12),
                paddingVertical: pxToDp(20),
                paddingHorizontal: pxToDp(28),
                boxShadow: '0px 0px 31.3px 0px rgba(198, 12, 147, 0.8)',
                shadowColor: 'rgba(198, 12, 147, 0.8)',
                shadowOffset: { width: pxToDp(0), height: pxToDp(10) },
                shadowOpacity: 0.8,
                shadowRadius: pxToDp(26),
              }}
              onPress={() => {
                setShowCopilotModal(false);
                setIsHideCopilot(true);
                //结束引导，回到首页
                router.replace('/main/fairyTales');
              }}>
              <Text style={{ fontSize: pxToDp(32), color: computedThemeColor.primary }}>
                {intl.formatMessage({ id: 'copilot.fairy-tales-item-model-btn' })}
              </Text>
              <StarsMinimalisticOutline width={pxToDp(44)} height={pxToDp(44)} color={computedThemeColor.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </PageView>
  );
}

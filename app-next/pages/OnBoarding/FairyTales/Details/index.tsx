import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlayOutline } from '@/components/Icon';
import PageView from '@/components/PageView';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

const WalkthroughableView = walkthroughable(View);
export default function FairyTaleSummary() {
  const intl = useIntl();
  const { start, goToNth } = useCopilot();
  const { computedThemeColor } = useConfigProvider();

  const insets = useSafeAreaInsets();

  return (
    <PageView
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}
      source={require('@/assets/images/onboarding/details.png')}>
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom + pxToDp(30),
          left: pxToDp(24),
          right: pxToDp(24),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onLayout={() => {
          requestAnimationFrame(() => {
            start();
            goToNth(8);
          });
        }}>
        <CopilotStep
          text={intl.formatMessage({ id: 'copilot.fairy-tales-item-start' })}
          order={8}
          name={intl.formatMessage({ id: 'Start' })}>
          <WalkthroughableView
            style={{
              width: '100%',
            }}>
            <View
              style={[
                styles.infoButton,
                {
                  borderColor: '#A07BED',
                },
              ]}>
              <PlayOutline
                width={pxToDp(32)}
                height={pxToDp(32)}
                color={computedThemeColor.primary}
                style={[styles.infoButtonIcon]}
              />
              <Text
                style={[
                  styles.infoButtonText,
                  {
                    color: computedThemeColor.primary,
                  },
                ]}>
                {intl.formatMessage({ id: 'Start' })}
              </Text>
            </View>
          </WalkthroughableView>
        </CopilotStep>
      </View>
    </PageView>
  );
}

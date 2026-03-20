import { useIntl } from 'react-intl';
import { View, ScrollView } from 'react-native';

import Modal from '@/components/Modal';
import { POLICY_AND_TERMS } from '@/constants/datas';
import { useConfigProvider } from '@/hooks/useConfig';

import styles from './styles';
import { PolicyAndTermsModalProps } from './types';

const PolicyAndTermsModal = (props: PolicyAndTermsModalProps) => {
  const { type, onClose, onOk } = props;
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  return (
    <Modal
      position="CENTER"
      maskBlur={false}
      visible={!!type}
      title={
        {
          policy: intl.formatMessage({ id: 'Setting.policy' }),
          terms: intl.formatMessage({ id: 'Setting.terms' }),
          deactivate: intl.formatMessage({ id: 'Setting.deleteAccount' }),
        }[type || 'policy']
      }
      onClose={() => {
        onClose?.();
      }}
      okButtonProps={{
        children: intl.formatMessage({ id: 'Confirm' }),
      }}
      onOk={onOk}>
      <View style={[styles.content]}>
        <ScrollView style={[styles.ScrollView]}>
          <View style={[styles.content]}>
            {
              POLICY_AND_TERMS({
                color: computedThemeColor,
                type: type || 'policy',
                intl,
              }) as any
            }
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PolicyAndTermsModal;

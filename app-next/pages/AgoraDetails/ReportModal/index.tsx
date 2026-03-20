import { useIntl } from 'react-intl';
import { View, Text } from 'react-native';

import CheckboxGroup from '@/components/CheckboxGroup';
import useForm from '@/components/Form/useForm';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { postBotAppChatMessageFeedback } from '@/services/neirongjubaojiekou';
import pxToDp from '@/utils/pxToDp';

import { getOptions } from './constants';
import styles from './styles';
import { ReportModalProps } from './types';

function ReportModal({ visible, item, onClose }: ReportModalProps) {
  const intl = useIntl();

  const form = useForm<{
    value: string[];
  }>();
  const { getFieldsValue, setFieldsValue } = form;
  const formValues = getFieldsValue();
  return (
    <Modal
      position="BOTTOM"
      visible={visible}
      onClose={() => {
        onClose(false);
        setFieldsValue({
          value: [],
        });
      }}
      title={intl.formatMessage({ id: 'bot.chat.report.feedback' })}
      onOk={async () => {
        if (!formValues.value || formValues.value.length === 0) {
          Toast.info(intl.formatMessage({ id: 'bot.chat.report.pick' }));
          return;
        }
        const resp = await postBotAppChatMessageFeedback({
          msgContent: item?.content!,
          chatModule: 'post',
          msgId: item?.id + '',
          feedback: formValues.value[0],
        });
        if (resp.data.code !== 0) {
          Toast.error(resp.data.msg);
        } else {
          onClose(true);
        }
      }}
      okButtonProps={{
        size: 'middle',
        children: intl.formatMessage({ id: 'Submit' }),
      }}>
      <View style={styles.container}>
        <Text style={[styles.tips]}>{intl.formatMessage({ id: 'bot.chat.report.tips' })}:</Text>
        <View style={{ marginBottom: pxToDp(32) }}>
          <CheckboxGroup
            style={[styles.CheckboxGroup]}
            itemStyle={[styles.CheckboxGroupItem]}
            mode="block"
            value={formValues.value ? formValues.value : []}
            onChange={(v) => {
              setFieldsValue({ value: v });
            }}
            options={getOptions()}
          />
        </View>
      </View>
    </Modal>
  );
}

export default ReportModal;

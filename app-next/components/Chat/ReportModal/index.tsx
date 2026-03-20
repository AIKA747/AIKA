import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';

import CheckboxGroup from '@/components/CheckboxGroup';
import useForm from '@/components/Form/useForm';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { postBotAppChatMessageFeedback } from '@/services/neirongjubaojiekou';
import pxToDp from '@/utils/pxToDp';

import { getOptions } from './constants';
import styles from './styles';
import { PayModalProps as ReportModalProps } from './types';

/**
 * Post 举报弹窗
 * @param visible
 * @param listItem
 * @param chatModule
 * @param onClose
 * @constructor
 *
 * @Deprecated: 此功能已经单独抽离到 AgoraDetails 中， 后续将移除该组件
 */
export default function ReportModal({ visible, listItem, chatModule, onClose }: ReportModalProps) {
  const intl = useIntl();

  const form = useForm<{
    value: string[];
  }>();
  const { getFieldsValue, setFieldsValue } = form;
  const formValues = getFieldsValue();
  useEffect(() => {
    console.warn(`Deprecated: 此功能已经单独抽离到 AgoraDetails 中， 后续将移除该组件`);
  }, []);
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
          msgContent: listItem?.textContent!,
          chatModule,
          msgId: listItem?.msgId!,
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
              // onChange?.(v);
              setFieldsValue({ value: v });
            }}
            options={getOptions()}
          />
        </View>
      </View>
    </Modal>
  );
}

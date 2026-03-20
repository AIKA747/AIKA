import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';

import useForm from '@/components/Form/useForm';
import Modal from '@/components/Modal';
import Rate from '@/components/Rate';
import Toast from '@/components/Toast';
import { postBotAppRate } from '@/services/pinglunjiqiren';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { FormValues, CommentModalProps } from './types';

export default function CommentModal({ bot, visible, onClose }: CommentModalProps) {
  const intl = useIntl();

  const form = useForm<FormValues>();
  const formValues = form.getFieldsValue();

  useEffect(() => {
    form.setFieldsValue({ rating: 5, content: '' });
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title={intl.formatMessage({ id: 'Comment' })}
      onCancel={() => {
        onClose(false);
      }}
      okButtonProps={{
        children: intl.formatMessage({ id: 'Confirm' }),
      }}
      cancelButtonProps={{
        children: intl.formatMessage({ id: 'Cancel' }),
      }}
      onOk={async () => {
        if (!formValues.content) {
          Toast.info(intl.formatMessage({ id: 'bot.detail.comment.form.validate.content' }));
          return;
        }

        const resp = await postBotAppRate({
          botId: bot.id!,
          rating: formValues.rating || 5,
          content: formValues.content,
        });

        if (resp.data.code === 0) {
          Toast.success('Success');
          onClose(true);
        }
      }}
      onClose={() => {
        onClose(false);
      }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <Text style={[styles.contentText]}>
            {intl.formatMessage({ id: 'bot.detail.comment.form.placeholder.rating' })}
          </Text>
          <Rate
            style={[styles.ratingSelect]}
            value={formValues.rating || 5}
            color="#A07BED"
            size={pxToDp(44)}
            onChange={(rating) => {
              form.setFieldsValue({
                rating,
              });
            }}
          />
          <Text style={[styles.contentText]}>
            {intl.formatMessage({ id: 'bot.detail.comment.form.validate.content' })}
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            maxLength={300}
            style={[styles.contentInput]}
            value={formValues.content}
            placeholder={intl.formatMessage({ id: 'bot.detail.comment.form.validate.content' })}
            onChange={(e) => {
              form.setFieldsValue({
                content: e.nativeEvent.text,
              });
            }}
            placeholderTextColor="#80878E"
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

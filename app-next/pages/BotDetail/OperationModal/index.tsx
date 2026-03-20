import { router } from 'expo-router';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity } from 'react-native';

import { DeleteOutline, EditOutline, InfoCircleOutline } from '@/components/Icon';
import Modal, { useConfirmModal } from '@/components/Modal';
import { useAuth } from '@/hooks/useAuth';
import { deleteBotAppBotId } from '@/services/jiqirencaozuo';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { OperationModalProps } from './types';

export default function OperationModal({ bot, visible, onClose }: OperationModalProps) {
  const intl = useIntl();
  const { userInfo } = useAuth();
  const { el, show } = useConfirmModal({});

  const selfCreation = bot?.creator + '' === userInfo?.userId;

  return (
    <Modal
      visible={visible}
      position="BOTTOM"
      onClose={() => {
        onClose(false);
      }}>
      <View style={styles.content}>
        <View style={styles.main}>
          {selfCreation && (
            <TouchableOpacity
              style={styles.info}
              onPress={() => {
                onClose(false);

                router.push({
                  pathname: '/main/botCreate',
                  params: { botId: bot.id! },
                });
              }}>
              <EditOutline style={styles.infoIcon} width={pxToDp(44)} height={pxToDp(44)} color="#fff" />
              <Text style={styles.infoText}>{intl.formatMessage({ id: 'Edit' })}</Text>
            </TouchableOpacity>
          )}
          {!selfCreation && (
            <TouchableOpacity
              style={styles.info}
              onPress={() => {
                onClose(false);
                router.push({
                  pathname: '/main/botReport',
                  params: { botId: bot.id! },
                });
              }}>
              <InfoCircleOutline style={styles.infoIcon} width={pxToDp(44)} height={pxToDp(44)} color="#fff" />
              <Text style={styles.infoText}>{intl.formatMessage({ id: 'Report' })}</Text>
            </TouchableOpacity>
          )}

          {selfCreation && (
            <TouchableOpacity
              style={styles.info}
              onPress={() => {
                show({
                  text: intl.formatMessage({ id: 'AreYouSure' }),
                  onOk: async () => {
                    const resp = await deleteBotAppBotId({
                      id: bot.id!,
                    });
                    if (resp.data.code === 0) {
                      onClose(false);

                      // onClose(true);
                      router.back();
                    }
                  },
                });
              }}>
              <DeleteOutline width={pxToDp(44)} height={pxToDp(44)} color="#fff" />
              <Text style={styles.infoText}>{intl.formatMessage({ id: 'bot.detail.operation.DeleteBot' })}</Text>
            </TouchableOpacity>
          )}
        </View>
        {el}
      </View>
    </Modal>
  );
}

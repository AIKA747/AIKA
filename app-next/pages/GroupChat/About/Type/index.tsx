import { useRequest } from 'ahooks';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity } from 'react-native';

import { RadioCheckTwoTone } from '@/components/Icon';
import Modal from '@/components/Modal';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { putBotAppChatroomGroupType } from '@/services/guanliyuanqunliaoshezhijiekou';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export default function AboutGroupChatType() {
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const intl = useIntl();
  const { roomId, groupType } = useLocalSearchParams<{ roomId: string; groupType: string }>();
  const { refreshChatRoomDetail } = useGroupChatProvider();
  const [typeModalVisible, setTypeModalVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<{ label: string; value: string; checked: boolean }[]>([
    {
      label: intl.formatMessage({ id: 'AboutChat.TypeOptions.Public' }),
      value: 'PUBLIC',
      checked: groupType === 'PUBLIC',
    },
    {
      label: intl.formatMessage({ id: 'AboutChat.TypeOptions.Private' }),
      value: 'PRIVATE',
      checked: groupType === 'PRIVATE',
    },
  ]);
  const { loading, runAsync } = useRequest(putBotAppChatroomGroupType, { manual: true });

  const handleModifyGroupType = useCallback(
    (type: string) => {
      runAsync({ groupType: type, id: Number(roomId) }).then((res) => {
        if (res?.data?.code === 0) {
          refreshChatRoomDetail();
          setOptions((v) => {
            return v.map((opt) => {
              opt.checked = opt.value === type;
              return opt;
            });
          });
          setTypeModalVisible(false);
        } else {
          Toast.error(res.data.msg || intl.formatMessage({ id: 'failed' }));
        }
      });
    },
    [runAsync, roomId, refreshChatRoomDetail, intl],
  );

  const handleChange = useCallback(
    (value: string) => {
      if (value === 'PRIVATE') {
        setTypeModalVisible(true);
        return;
      }
      handleModifyGroupType(value);
    },
    [handleModifyGroupType],
  );

  return (
    <PageView style={styles.page}>
      <NavBar
        theme={computedTheme}
        title={intl.formatMessage({ id: 'AboutChat.Type' })}
        style={[{ backgroundColor: '#ffffff00' }]}
      />
      <View style={[styles.card]}>
        {options.map((opt, index) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.optionItem, { borderColor: index >= 1 ? 'transparent' : '#25212E' }]}
            onPress={() => {
              if (!opt.checked) {
                handleChange(opt.value);
              }
            }}>
            <Text
              style={{
                fontSize: pxToDp(16 * 2),
                color: opt.checked ? computedThemeColor.text : computedThemeColor.text_secondary,
              }}>
              {opt.label}
            </Text>
            <RadioCheckTwoTone
              color={opt.checked ? computedThemeColor.text_pink : computedThemeColor.text_secondary}
              twoToneColor="#fff"
              width={pxToDp(24 * 2)}
              height={pxToDp(24 * 2)}
              checked={opt.checked}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        position="CENTER"
        maskBlur={false}
        visible={typeModalVisible}
        closable={false}
        maskClosable={false}
        onClose={() => {
          setTypeModalVisible(false);
        }}
        onOk={() => {
          handleModifyGroupType('PRIVATE');
        }}
        okButtonProps={{
          loading,
          type: 'default',
          style: { backgroundColor: 'rgba(198, 12, 147, 1)', borderColor: 'rgba(198, 12, 147, 1)' },
          children: intl.formatMessage({ id: 'Okay' }),
        }}>
        <View style={{ paddingHorizontal: pxToDp(32), paddingVertical: pxToDp(52) }}>
          <Text
            style={{
              fontSize: pxToDp(48),
              color: computedThemeColor.text,
            }}>
            {intl.formatMessage({ id: 'AboutChat.TypeModalTips' })}
          </Text>
        </View>
      </Modal>
    </PageView>
  );
}

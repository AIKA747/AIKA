import { isEmpty } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import Avatar from '@/components/Avatar';
import { RadioCheckTwoTone } from '@/components/Icon';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { defaultCover } from '@/constants';
import { useConfigProvider } from '@/hooks/useConfig';
import { getBotAppChatroomMembers } from '@/services/pinyin2';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

export type RobotItem = Awaited<ReturnType<typeof getBotAppChatroomMembers>>['data']['data']['list'][number];
export default function RobotSelectModal({
  visible,
  robots = [],
  onClose,
  onRemindSend,
}: {
  onClose?: (v: boolean) => void;
  visible: boolean;
  robots?: RobotItem[];
  onRemindSend?: (v?: RobotItem) => void;
}) {
  const { computedThemeColor } = useConfigProvider();
  const intl = useIntl();
  const [selectedValue, setSelectedValue] = useState<RobotItem>();

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: Awaited<ReturnType<typeof getBotAppChatroomMembers>>['data']['data']['list'][number];
      index: number;
    }) => {
      return (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.8}
          style={[styles.optionItem, { borderColor: index === robots?.length - 1 ? 'transparent' : '#25212E' }]}
          onPress={() => {
            setSelectedValue(item);
          }}>
          <View style={styles.itemLeftContent}>
            <Avatar placeholder={defaultCover} style={styles.avatar} img={item.avatar} size={pxToDp(88)} />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: pxToDp(12),
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginBottom: pxToDp(12),
                }}>
                {item.memberType === 'BOT' && (
                  <View
                    style={{
                      paddingVertical: pxToDp(8),
                      paddingHorizontal: pxToDp(12),
                      backgroundColor: computedThemeColor.primary,
                      borderRadius: pxToDp(8),
                    }}>
                    <Text
                      style={{
                        color: computedThemeColor.text,
                        fontFamily: 'ProductSansBold',
                        fontWeight: 'bold',
                        fontSize: pxToDp(16),
                      }}>
                      {intl.formatMessage({ id: 'AboutChat.Members.Tags.Bot' })}
                    </Text>
                  </View>
                )}
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: pxToDp(16 * 2),
                    color: computedThemeColor.text,
                  }}>
                  {item.username}
                </Text>
              </View>
              <Text
                style={[
                  styles.status,
                  {
                    color: item?.onlineStatus ? computedThemeColor.primary : computedThemeColor.text_secondary,
                  },
                ]}>
                {intl.formatMessage({
                  id: item.onlineStatus ? 'AboutChat.Members.Status.Online' : 'AboutChat.Members.Status.NotActive',
                })}
              </Text>
            </View>
          </View>
          <View>
            <RadioCheckTwoTone
              color={
                item.memberId === selectedValue?.memberId
                  ? computedThemeColor.text_pink
                  : computedThemeColor.text_secondary
              }
              twoToneColor="#fff"
              width={pxToDp(24 * 2)}
              height={pxToDp(24 * 2)}
              checked={item.memberId === selectedValue?.memberId}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [
      robots?.length,
      computedThemeColor.primary,
      computedThemeColor.text,
      computedThemeColor.text_secondary,
      computedThemeColor.text_pink,
      intl,
      selectedValue?.memberId,
    ],
  );
  return (
    <Modal
      position="BOTTOM"
      visible={visible}
      fullWidth
      onClose={() => {
        onClose?.(false);
        setSelectedValue(undefined);
      }}
      title={
        <Text
          style={[
            {
              top: pxToDp(12),
              fontSize: pxToDp(32),
              lineHeight: pxToDp(38),
              textAlign: 'left',
              overflow: 'hidden',
              marginBottom: pxToDp(20),
              color: computedThemeColor.text_white,
            },
          ]}>
          {intl.formatMessage({ id: 'bot.chat.selectModal.title' })}
        </Text>
      }
      onOk={async () => {
        if (!selectedValue) {
          Toast.info(intl.formatMessage({ id: 'bot.chat.report.pick' }));
        }
        onRemindSend?.(selectedValue);
        setSelectedValue(undefined);
        onClose?.(false);
      }}
      okButtonProps={{
        size: 'middle',
        disabled: isEmpty(selectedValue),
        children: intl.formatMessage({ id: 'Confirm' }),
      }}>
      <ScrollView style={{ marginBottom: pxToDp(32), minHeight: pxToDp(320), paddingHorizontal: pxToDp(32) }}>
        {(robots || []).map((robot, index) => renderItem({ item: robot, index }))}
      </ScrollView>
    </Modal>
  );
}

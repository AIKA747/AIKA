import { useRequest } from 'ahooks';
import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { MessageItem } from '@/components/Chat/types';
import { BellOutline, CheckCircleOutline, CloseCircleOutline, MinusCircleOutline } from '@/components/Icon';
import Toast from '@/components/Toast';
import { useConfigProvider } from '@/hooks/useConfig';
import { putBotAppUserTaskId } from '@/services/jiqirenrenwuguanli';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
type TaskDataType = {
  id: string;
  type: 'REMINDER' | 'WEBSEARCH';
  name: string;
  message: string;
  introduction: string;
  cron: string;
  executeLimit: number;
  lastExcetedAt: string;
  creater: string;
  botId: string;
  status: 'PENDING' | 'ENABLED' | 'DISABLED';
  createdAt: string;
  updatedAt: string;
  prompt: string;
  json: string;
  deleted: 0 | 1;
};

const MessageContentTask = ({
  messageItem,
  onUpdateCacheData,
}: {
  messageItem: MessageItem;
  onUpdateCacheData?: React.Dispatch<React.SetStateAction<MessageItem[]>>;
}) => {
  const { computedThemeColor } = useConfigProvider();
  const intl = useIntl();
  const [loadingType, setLoadingType] = useState<'ENABLED' | 'DISABLED' | null>(null);
  const [taskData, setTaskData] = useState<TaskDataType>(JSON.parse(messageItem.json || '{}') as TaskDataType);

  const { runAsync } = useRequest(putBotAppUserTaskId, {
    manual: true,
    debounceWait: 300,
  });

  const handleClickTask = useCallback(
    (type: 'ENABLED' | 'DISABLED') => {
      setLoadingType(type);
      runAsync({ id: taskData.id }, { status: type })
        .then((res: any) => {
          console.log('res: ', res.data);
          if (res.data.code === 0) {
            setTaskData(res.data.data as any);
            onUpdateCacheData?.((v) => {
              v = v.map((item) => {
                if (item.msgId === messageItem.msgId) {
                  item.json = JSON.stringify(res.data.data);
                }
                return item;
              });
              return v;
            });
          } else {
            Toast.error(res.data.msg || intl.formatMessage({ id: 'failed' }));
          }
        })
        .finally(() => {
          setLoadingType(null);
        });
    },
    [intl, messageItem.msgId, onUpdateCacheData, runAsync, taskData.id],
  );
  const color = useMemo(() => {
    if (taskData?.deleted) {
      return computedThemeColor.text_error;
    }
    switch (taskData.status) {
      case 'ENABLED':
        return computedThemeColor.text_success;
      case 'DISABLED':
        return computedThemeColor.text_secondary;
      case 'PENDING':
        return computedThemeColor.primary;
      default:
        return computedThemeColor.text_error;
    }
  }, [computedThemeColor, taskData]);

  const icon = useMemo(() => {
    if (taskData?.deleted) {
      return <CloseCircleOutline color={color} width={pxToDp(80)} height={pxToDp(80)} />;
    }
    switch (taskData.status) {
      case 'ENABLED':
        return <CheckCircleOutline color={color} width={pxToDp(80)} height={pxToDp(80)} />;
      case 'DISABLED':
        return <MinusCircleOutline color={color} width={pxToDp(80)} height={pxToDp(80)} />;
      case 'PENDING':
        return <BellOutline width={pxToDp(80)} height={pxToDp(80)} color={color} />;
      default:
        return <CloseCircleOutline color={color} width={pxToDp(80)} height={pxToDp(80)} />;
    }
  }, [color, taskData]);

  return (
    <View style={styles.container}>
      <View style={styles.bellBtnIcon}>{icon}</View>
      <View style={styles.content}>
        <Text style={[styles.title, { color }]}>{taskData.name}</Text>
        <Text style={[styles.description, { color }]}>{taskData.introduction}</Text>
      </View>
      {taskData.status === 'PENDING' && (
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.btn]} onPress={() => handleClickTask('DISABLED')}>
            {loadingType === 'DISABLED' && <ActivityIndicator size={pxToDp(24)} color={computedThemeColor.text} />}
            <Text style={[styles.btnText]}>{intl.formatMessage({ id: 'Cancel' })}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              {
                borderColor: computedThemeColor.primary,
                backgroundColor: computedThemeColor.primary,
              },
            ]}
            onPress={() => handleClickTask('ENABLED')}>
            {loadingType === 'ENABLED' && <ActivityIndicator size="small" color={computedThemeColor.text_black} />}
            <Text style={[styles.btnText, { color: computedThemeColor.text_black }]}>
              {intl.formatMessage({ id: 'Start' })}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default React.memo(MessageContentTask);

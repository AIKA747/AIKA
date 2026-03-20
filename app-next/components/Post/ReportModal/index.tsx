import { useRequest } from 'ahooks';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import { ArrowRightOutline, SquareArrowLeftOutline } from '@/components/Icon';
import Modal from '@/components/Modal';
import { ConfigContentProps, useConfigProvider } from '@/hooks/useConfig';
import { postContentAppPostReport } from '@/services/tiezijubao';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

const ReportModal = ({
  postId,
  visible,
  onClose,
}: {
  postId: number;
  visible: boolean;
  onClose: (value?: number) => void;
}) => {
  const insert = useSafeAreaInsets();
  const intl = useIntl();
  const { computedThemeColor, postReportList = [] } = useConfigProvider();
  const [step, setStep] = useState<number>(0);
  const [selected, setSelected] = useState<ConfigContentProps['postReportList'][0]>();
  const { runAsync, loading } = useRequest(postContentAppPostReport, {
    debounceWait: 300,
    manual: true,
  });
  const getModalTitle = useCallback(() => {
    if (step === 0)
      return (
        <Text style={[styles.title, { color: computedThemeColor.text_white }]}>
          {intl.formatMessage({ id: 'agora.post.reportModal.title' })}
        </Text>
      );
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setStep(0);
          }}>
          <SquareArrowLeftOutline color={computedThemeColor.text_secondary} width={pxToDp(48)} height={pxToDp(48)} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: computedThemeColor.text_white, textAlign: 'center', flex: 1 }]}>
          {intl.formatMessage({ id: 'agora.more.modal.report' })}
        </Text>
      </View>
    );
  }, [step, computedThemeColor.text_white, computedThemeColor.text_secondary, intl]);

  const getModalContent = useCallback(() => {
    if (step === 0) {
      return (
        <Animated.View entering={FadeIn} exiting={FadeOutRight}>
          {postReportList.map((item, index) => (
            <TouchableOpacity
              style={[styles.item]}
              key={item.title}
              onPress={() => {
                setStep(1);
                setSelected(item);
              }}>
              <Text style={[styles.itemText, { color: computedThemeColor.text }]}>{item.title}</Text>
              <ArrowRightOutline color={computedThemeColor.text} width={pxToDp(42)} height={pxToDp(42)} />
            </TouchableOpacity>
          ))}
        </Animated.View>
      );
    } else {
      return (
        <Animated.View style={styles.step} entering={FadeInRight} exiting={FadeOutRight}>
          <Text style={[styles.stepTitle, { color: computedThemeColor.text }]}>{selected?.title}</Text>
          <Text style={[styles.stepContent, { color: computedThemeColor.text_secondary }]}>
            {selected?.description}
          </Text>
          <Button
            type="primary"
            loading={loading}
            onPress={() => {
              runAsync({ postId, reportId: selected?.id! }).then(() => {
                onClose?.(selected?.id);
                setSelected(undefined);
                setStep(0);
              });
            }}>
            {intl.formatMessage({ id: 'Send' })}
          </Button>
        </Animated.View>
      );
    }
  }, [
    step,
    postReportList,
    computedThemeColor.text,
    computedThemeColor.text_secondary,
    selected?.title,
    selected?.description,
    selected?.id,
    loading,
    intl,
    runAsync,
    postId,
    onClose,
  ]);
  return (
    <Modal
      visible={visible}
      position="BOTTOM"
      onClose={() => {
        onClose?.();
        setStep(0);
      }}
      maskBlur={false}
      maskClosable
      fullWidth
      title={getModalTitle()}>
      <View style={[styles.container, { marginBottom: insert.bottom }]}>{getModalContent()}</View>
    </Modal>
  );
};
export default ReportModal;

import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { CheckboxTwoTone } from '@/components/Icon';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { placeholderImg } from '@/constants';
import { useConfigProvider } from '@/hooks/useConfig';
import { getContentAppGift } from '@/services/contentService';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';
import { GiftModalProps } from './types';

export default function GiftModal({ story, visible, onClose }: GiftModalProps) {
  const intl = useIntl();

  const { computedThemeColor } = useConfigProvider();
  const [activeId, setActiveId] = useState<string>('');

  const { data: giftList = [] } = useRequest(
    async () => {
      if (!visible) return [];
      const resp = await getContentAppGift({
        storyId: story.id,
        chapterId: story.chapterId,
      });
      return resp.data.data.list;
    },
    { refreshDeps: [visible], debounceWait: 300 },
  );
  const onOk = useCallback(() => {
    const gift = giftList.find((x) => x.id === activeId);
    if (!gift) {
      Toast.info(intl.formatMessage({ id: 'StoryChat.gift.select' }));
      return;
    }
    onClose?.(gift);
    setActiveId('');
  }, [giftList, onClose, activeId, intl]);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      position="BOTTOM"
      title={intl.formatMessage({ id: 'Gifts' })}
      onOk={onOk}
      okButtonProps={{
        children: intl.formatMessage({ id: 'Give' }),
      }}>
      <View style={[styles.container]}>
        <ScrollView style={[styles.items]} showsHorizontalScrollIndicator={false} horizontal>
          {giftList.map((gift) => {
            const active = activeId === gift.id;
            return (
              <TouchableOpacity
                key={gift.id}
                style={[styles.item]}
                onPress={() => {
                  if (activeId === gift.id) {
                    setActiveId('');
                  } else {
                    setActiveId(gift.id!);
                  }
                }}>
                <Image
                  style={[styles.itemImage]}
                  source={s3ImageTransform(gift.image || '', 'small')}
                  placeholder={placeholderImg}
                  placeholderContentFit="cover"
                  contentFit="cover"
                  transition={null}
                />
                <View style={[styles.check]}>
                  <CheckboxTwoTone
                    width={pxToDp(44)}
                    height={pxToDp(44)}
                    color={computedThemeColor.primary}
                    twoToneColor="#000"
                    checked={active}
                  />
                </View>
                <View style={[styles.free, { borderColor: computedThemeColor.primary }]}>
                  <Text style={[styles.freeText]}>{intl.formatMessage({ id: 'Free' })}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

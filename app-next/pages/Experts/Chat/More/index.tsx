import { Image } from 'expo-image';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Collapse from '@/components/Collapse';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { useStorageState } from '@/hooks/useStorageState';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';
import { MoreProps } from './types';

export default function ChatMore({ onClose, expert, onChangeImg, defaultActiveKey = 0 }: MoreProps) {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor, computedTheme } = useConfigProvider();

  const [tags] = useState([
    {
      key: 'Neutral',
      title: intl.formatMessage({ id: 'ExpertChat.more.CommunicationStyle.Neutral' }),
    },
    {
      key: 'Supportive',
      title: intl.formatMessage({ id: 'ExpertChat.more.CommunicationStyle.Supportive' }),
    },
    {
      key: 'Light',
      title: intl.formatMessage({ id: 'ExpertChat.more.CommunicationStyle.Light' }),
    },
  ]);

  // TODO 聊天message带上这个
  const [activeTagIndex, setActiveTagIndex] = useStorageState(`expert-chat-${expert.id}.CommunicationStyle`, 0);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(defaultActiveKey);

  const [isOpenKey = 'CommunicationStyle', setIsOpenKey] = useStorageState<'CommunicationStyle' | 'Image' | null>(
    `expert-chat-${expert.id}.isOpenKey`,
    'CommunicationStyle',
  );

  return (
    <View
      style={[styles.containerWrapper]}
      onTouchEnd={() => {
        onClose?.();
      }}>
      <View
        style={[
          styles.container,
          {
            marginTop:
              insets.top +
              pxToDp(80) + // navbar 高度
              pxToDp(32),
            marginRight: pxToDp(32),
            backgroundColor: computedThemeColor.text,
          },
        ]}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        <Collapse
          title={intl.formatMessage({
            id: 'ExpertChat.more.CommunicationStyle.Title',
          })}
          isOpen={isOpenKey === 'CommunicationStyle'}
          onChangeOpen={(isOpen) => {
            setIsOpenKey(isOpen ? 'CommunicationStyle' : null);
          }}>
          <View style={[styles.tags]}>
            {tags.map((tag, index) => {
              const isActive = (activeTagIndex === null && index === 0) || activeTagIndex === index;
              return (
                <TouchableOpacity
                  key={tag.key}
                  style={[
                    styles.tagsItem,
                    {
                      backgroundColor: isActive ? computedThemeColor.primary : computedThemeColor.primary + '30',
                      marginRight: index === tags.length - 1 ? pxToDp(0) : pxToDp(10),
                    },
                  ]}
                  onPress={() => {
                    setActiveTagIndex(index);
                    onClose();
                  }}>
                  <View
                    style={[
                      styles.tagsItemCircle,
                      {
                        backgroundColor: isActive ? '#301190' : '#9281C6',
                        borderColor: isActive ? '#745BBA' : '#BCB1DD',
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.tagsItemText,
                      {
                        color: isActive
                          ? computedThemeColor.bg_primary
                          : computedTheme === Theme.LIGHT
                            ? computedThemeColor.text
                            : '#00000080',
                      },
                    ]}
                    numberOfLines={1}>
                    {tag.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Collapse>
        <View style={{ borderBottomWidth: pxToDp(2), borderColor: '#EBEBEB' }} />

        <Collapse
          title={intl.formatMessage({ id: 'ExpertChat.more.ChangeImage.Title' })}
          isOpen={isOpenKey === 'Image'}
          onChangeOpen={(isOpen) => {
            setIsOpenKey(isOpen ? 'Image' : null);
          }}>
          <ScrollView style={[styles.images]} horizontal>
            {expert.album.map((image, index) => {
              const isActive = activeImageIndex === index;
              return (
                <TouchableOpacity
                  key={image}
                  style={[
                    styles.imagesItem,
                    {
                      marginRight: index === expert.album.length - 1 ? 0 : pxToDp(14),
                      borderColor: isActive ? computedThemeColor.primary : 'transparent',
                      borderWidth: pxToDp(2),
                    },
                  ]}
                  onPress={() => {
                    setActiveImageIndex(index);
                    onChangeImg?.(image, image, index);
                    onClose();
                  }}>
                  <Image
                    source={{ uri: s3ImageTransform(image, [180, 376]) }}
                    style={[styles.imagesItemImage]}
                    contentFit="cover"
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Collapse>
      </View>
    </View>
  );
}

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';

import Button from '@/components/Button';
import { placeholderImg } from '@/constants';
import { StoryDetail } from '@/pages/StoryChat/types';

import { cardStyles, messagesStylesLeft, messagesStylesRight, styleStyles } from './styles';
import { MessageContextStoryProps } from './types';

export default function MessageContextStory(props: MessageContextStoryProps) {
  const { messageItem, messagePosition = 'left' } = props;
  const intl = useIntl();

  const stylesPosition = {
    left: messagesStylesLeft,
    right: messagesStylesRight,
  }[messagePosition];

  const storyDetail = useMemo(() => {
    try {
      return JSON.parse(messageItem?.json || '') as StoryDetail;
    } catch {
      return undefined;
    }
  }, [messageItem?.json]);

  return (
    <View style={[styleStyles.container, stylesPosition.container]}>
      {storyDetail && (
        <View style={[cardStyles.container]}>
          <Image
            style={[cardStyles.bg]}
            source={storyDetail.cover || ''}
            contentFit="cover"
            placeholder={placeholderImg}
            placeholderContentFit="cover"
          />
          <View style={[cardStyles.info]}>
            <Text style={[cardStyles.name]} numberOfLines={1} ellipsizeMode="tail">
              {storyDetail.storyName}
            </Text>
            <Button
              wrapperStyle={[cardStyles.button]}
              type="link"
              size="small"
              borderType="square"
              onPress={() => {
                // 助手和故事能一起聊天吗? 先把助手退出吧
                router.back();

                router.push({
                  pathname: '/main/story/details/[storyId]',
                  params: { storyId: storyDetail.id! },
                });
              }}>
              {intl.formatMessage({ id: 'StartStory' })}
            </Button>
          </View>
        </View>
      )}
      <Text style={[styleStyles.text]}>{messageItem.textContent}</Text>
    </View>
  );
}

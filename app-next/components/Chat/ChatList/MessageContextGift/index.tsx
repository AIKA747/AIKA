import { Image } from 'expo-image';
import { View } from 'react-native';

import { placeholderImg } from '@/constants';
import { Gift } from '@/pages/StoryChat/GiftModal/types';

import styles, { messagesStylesLeft, messagesStylesRight } from './styles';
import { MessageContextGiftProps } from './types';

export default function MessageContextGift(props: MessageContextGiftProps) {
  const { messageItem, messagePosition = 'right' } = props;

  const stylesPosition = {
    left: messagesStylesLeft,
    right: messagesStylesRight,
  }[messagePosition];

  // const intl = useIntl();
  const gift = JSON.parse(messageItem.json || '{}') as Gift;

  return (
    <View style={[styles.container]}>
      <Image
        style={[styles.image, stylesPosition.image]}
        source={gift.image || ''}
        placeholder={placeholderImg}
        placeholderContentFit="cover"
        contentFit="cover"
        transition={100}
      />
      {/* <Text style={[styles.text]}>
        {intl.formatMessage({ id: 'bot.chat.context.gif.tips' })} {gift.giftName}
      </Text> */}
    </View>
  );
}

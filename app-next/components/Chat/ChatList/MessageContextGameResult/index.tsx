import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { AFEventKey } from '@/constants/AFEventKey';
import { GameResult } from '@/pages/Games/Result/types';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';

import styles, { messagesStylesLeft, messagesStylesRight } from './styles';
import { MessageContextTextProps } from './types';

export default function MessageContextGameResult(props: MessageContextTextProps) {
  const { messageItem, messagePosition, onGameStatus } = props;

  const intl = useIntl();

  const stylesPosition = {
    left: messagesStylesLeft,
    right: messagesStylesRight,
  }[messagePosition];

  const textColor = messagePosition === 'left' ? '#000000' : '#ffffff';

  const gameResult = JSON.parse(messageItem.json || 'null') as GameResult;

  return (
    <View style={[styles.container, stylesPosition.container]}>
      {/* FIXME 右侧视角时，路过文本内容过多，会出现右侧边距 */}
      <Markdown
        style={{
          body: {
            ...styles.text,
            ...stylesPosition.text,
            color: textColor,
            margin: 0,
            padding: 0,
          },
        }}>
        {gameResult.description}
      </Markdown>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: '#000',
          },
        ]}
        onPress={(e) => {
          e.preventDefault();
          e.stopPropagation();
          sendAppsFlyerEvent(AFEventKey.AFGameTestCompleted);
          onGameStatus?.(JSON.parse(messageItem.json || 'null') as GameResult);
        }}>
        <Text
          style={[
            styles.buttonText,
            {
              color: '#fff',
            },
          ]}>
          {intl.formatMessage({ id: 'SeeResult' })}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

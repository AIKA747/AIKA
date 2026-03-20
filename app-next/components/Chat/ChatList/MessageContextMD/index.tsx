import { useMemo } from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import pxToDp from '@/utils/pxToDp';

import styles, { messagesStylesLeft, messagesStylesRight } from './styles';
import { MessageContextTextProps } from './types';

export default function MessageContextMD(props: MessageContextTextProps) {
  const { messageItem, messagePosition } = props;

  const stylesPosition = useMemo(
    () =>
      ({
        left: messagesStylesLeft,
        right: messagesStylesRight,
      })[messagePosition],
    [messagePosition],
  );

  const textColor = messagePosition === 'left' ? '#000000' : '#ffffff';

  const content = useMemo(() => {
    try {
      const json = JSON.parse(messageItem.textContent || 'null');
      return `${json.questions} \n\n ${json.options}`;
    } catch (e) {
      return messageItem.textContent;
    }
  }, [messageItem]);

  return (
    <View
      style={[
        styles.container,
        stylesPosition.container,
        {
          // backgroundColor: 'red',
        },
      ]}>
      {/* FIXME 右侧视角时，路过文本内容过多，会出现右侧边距 */}
      {/* <Text>{json.options}</Text> */}
      <Markdown
        style={{
          body: {
            ...styles.text,
            ...stylesPosition.text,
            color: textColor,
            margin: 0,
            padding: 0,
            // backgroundColor: 'blue',
          },
          bullet_list: {
            // backgroundColor: 'red',
          },
          bullet_list_content: {
            marginBottom: pxToDp(10),
          },
          bullet_list_icon: {
            backgroundColor: messagePosition === 'left' ? '#000' : '#fff',
            height: pxToDp(10),
            width: pxToDp(10),
            borderRadius: pxToDp(10),
            position: 'relative',
            top: pxToDp(10),
          },
        }}>
        {content}
      </Markdown>
    </View>
  );
}

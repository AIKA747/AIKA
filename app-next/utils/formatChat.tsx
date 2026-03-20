import { router } from 'expo-router';
import React from 'react';
import { Linking, Text, TextStyle } from 'react-native';

import { SHARE_EXTERNAL_LINK_HOST } from '@/constants';

export const processTextPart = (part: string, style?: TextStyle): React.JSX.Element | string => {
  const regex = /\b(?:https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)\b/g;
  if (regex.test(part)) {
    return (
      <Text key={part} style={[style, { color: style?.color ?? '#A07BED' }]} onPress={() => handleLinkPress(part)}>
        {' ' + part + ' '}
      </Text>
    );
  }
  return part;
};
export const processTextPartFn = (part: string) => {
  const regex = /\b(?:https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)\b/g;
  if (regex.test(part)) {
    handleLinkPress(part);
  }
};

const handleLinkPress = (link: string) => {
  if (link.startsWith(SHARE_EXTERNAL_LINK_HOST) && !link.includes('/agora/')) {
    const query = link.match(/\/([^/]+)$/);
    const code = query ? query[1] : null;
    router.push({
      pathname: '/main/group-chat/join',
      params: { code: code?.replace(/#/g, '').trim() },
    });
  } else {
    if (link.includes('/agora/')) {
      const query = link.match(/\/([^/]+)$/);
      const code = query ? query[1] : '';
      router.push({ pathname: '/main/agora-details/[postId]', params: { postId: code } });
      return;
    }
    Linking.openURL(`https://${link}`).catch((err) => console.error('无法打开链接', err));
  }
};

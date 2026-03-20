import { router } from 'expo-router';
import React from 'react';
import { Text, TextStyle } from 'react-native';

import extractTags from '@/utils/extractTags';
import { processTextPart } from '@/utils/formatChat';

type HighlightedTagsProps = {
  text: string;
  style?: TextStyle;
};

export default function HighlightedTags(props: HighlightedTagsProps) {
  const { text, style } = props;

  const tags = extractTags(text);

  const result: (React.JSX.Element | string)[] = [];
  let lastIndex = 0;

  tags.forEach((tag) => {
    const tagIndex = text.indexOf(tag, lastIndex);
    if (tagIndex > lastIndex) {
      text
        .slice(lastIndex, tagIndex)
        .split(/(\s+)/)
        .forEach((part) => {
          result.push(processTextPart(part, style));
        });
    }

    result.push(
      <Text
        key={tag}
        style={[style, { color: style?.color ?? '#1D8EF6' }]}
        onPress={() => router.push({ pathname: '/main/agoraSearch', params: { query: tag } })}>
        {`  ${tag}`}
      </Text>,
    );

    lastIndex = tagIndex + tag.length;
  });

  if (lastIndex < text.length) {
    text
      .slice(lastIndex)
      .split(/(\s+)/)
      .forEach((part: string) => {
        result.push(processTextPart(part, style));
      });
  }

  return <>{result}</>;
}

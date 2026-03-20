import { View, Text } from 'react-native';

import Avatar from '@/components/Avatar';
import { placeholderImg, placeholderUser } from '@/constants';
import { Theme, useConfigProvider } from '@/hooks/useConfig';

import styles from './styles';
import { TitleProps } from './types';

export default function StoryChatTitle({ story }: TitleProps) {
  const { computedThemeColor, computedTheme } = useConfigProvider();
  return (
    <View style={[styles.container]}>
      <View style={[styles.left]}>
        <Avatar
          style={styles.avatar}
          size={120}
          img={
            {
              [Theme.LIGHT]: story?.cover,
              [Theme.DARK]: story?.coverDark,
            }[computedTheme] || placeholderImg
          }
          placeholder={placeholderUser}
        />
        <Text
          style={[
            styles.name,
            {
              color: computedThemeColor.text,
            },
          ]}>
          {story?.storyName || ''}
        </Text>
      </View>
    </View>
  );
}

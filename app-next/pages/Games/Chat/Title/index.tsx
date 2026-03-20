import { View, Text } from 'react-native';

import Avatar from '@/components/Avatar';
import { placeholderUser } from '@/constants';
import { useConfigProvider } from '@/hooks/useConfig';

import styles from './styles';
import { TitleProps } from './types';

export default function ChatTitle({ bot }: TitleProps) {
  const { computedThemeColor } = useConfigProvider();
  return (
    <View style={[styles.container]}>
      <View style={[styles.left]}>
        <Avatar style={styles.avatar} size={120} img={bot?.avatar || ''} placeholder={placeholderUser} />
        <Text
          style={[
            styles.name,
            {
              color: computedThemeColor.text,
            },
          ]}>
          {bot?.gameName || ''}
        </Text>
      </View>
    </View>
  );
}

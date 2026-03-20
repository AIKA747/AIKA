import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useIntl } from 'react-intl';
import { View, Text } from 'react-native';

import Button from '@/components/Button';
import NavBar from '@/components/NavBar';

import styles from './styles';

export default function BotCreateSuccess() {
  const intl = useIntl();
  const { botId } = useLocalSearchParams<{ botId: string }>();
  return (
    <View style={[styles.page]}>
      <NavBar title="Create AI" />
      <View style={[styles.container]}>
        <Image style={styles.botImage} source={require('@/assets/images/bot.png')} contentFit="cover" />
        <Text style={styles.text1}>{intl.formatMessage({ id: 'succeed' })}</Text>
        <Text style={styles.text2}>{intl.formatMessage({ id: 'bot.create.success.tips' })}!</Text>
        <View style={[styles.buttons]}>
          <Button
            type="primary"
            onPress={() => {
              // TODO: 重构待实现
              // router.replace({
              //   pathname: '/main/botChat',
              //   params: { botId },
              // });
            }}>
            {intl.formatMessage({ id: 'StartChat' })}
          </Button>
        </View>
      </View>
    </View>
  );
}

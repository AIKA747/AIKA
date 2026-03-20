import { useRequest } from 'ahooks';
import { router, useLocalSearchParams } from 'expo-router';
import { useIntl } from 'react-intl';
import { View, Text } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import Button from '@/components/Button';
import NavBar from '@/components/NavBar';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { putBotAppBotIdRelease } from '@/services/jiqirencaozuo';
import { getBotAppBotId } from '@/services/jiqirenchaxun';

import styles from './styles';

export default function BotCreatePreview() {
  const intl = useIntl();
  const { botId } = useLocalSearchParams<{ botId: string }>();

  const { data: bot } = useRequest(async () => {
    const resp = await getBotAppBotId({
      id: botId,
      botStatus: 'unrelease',
    });
    return resp.data.data;
  });

  return (
    <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior} style={[styles.page]}>
      <NavBar title="Preview" />
      <View style={[styles.container]}>
        <View style={[styles.info]}>
          <Text style={[styles.infoText1]}>{intl.formatMessage({ id: 'Attention' })}:</Text>
          <Text style={[styles.infoText2]}>{intl.formatMessage({ id: 'bot.create.preview.tips' })}!</Text>
        </View>
        <View style={[styles.chat]}>
          {/*<Chat chatModule={ChatModule.bot} id={botId} test botAvatar={bot?.avatar} />*/}
        </View>
        <View style={[styles.buttons]}>
          <Button
            type="primary"
            onPress={async () => {
              const resp = await putBotAppBotIdRelease({ id: botId });
              if (resp.data.code === 0) {
                router.replace({
                  pathname: '/main/botCreateSuccess',
                  params: { botId },
                });
              }
            }}>
            {intl.formatMessage({ id: 'Release' })}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

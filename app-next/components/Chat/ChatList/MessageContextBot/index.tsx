import { router } from 'expo-router';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import { StarOutline, UserHeartOutline } from '@/components/Icon';
import { placeholderUser } from '@/constants';
import { BotDetail } from '@/pages/BotDetail/types';
import pxToDp from '@/utils/pxToDp';

import { cardStyles, messagesStylesLeft, messagesStylesRight, styleStyles } from './styles';
import { MessageContextBotProps } from './types';

export default function MessageContextBot(props: MessageContextBotProps) {
  const { messageItem, messagePosition = 'left' } = props;

  const stylesPosition = {
    left: messagesStylesLeft,
    right: messagesStylesRight,
  }[messagePosition];

  const intl = useIntl();
  const botDetail = useMemo(() => {
    try {
      return JSON.parse(messageItem?.json || '') as BotDetail;
    } catch {
      return undefined;
    }
  }, [messageItem?.json]);
  return (
    <View style={[styleStyles.container, stylesPosition.container]}>
      {botDetail && (
        <View style={[cardStyles.container]}>
          <View style={[cardStyles.row]}>
            <Avatar style={cardStyles.avatar} size={100} img={botDetail.avatar || ''} placeholder={placeholderUser} />
            <View style={[cardStyles.info]}>
              <Text style={cardStyles.infoName} numberOfLines={1}>
                {botDetail.botName}
              </Text>
              <View style={cardStyles.infoStatistic}>
                <StarOutline
                  style={[cardStyles.infoStatisticIcon]}
                  width={pxToDp(30)}
                  height={pxToDp(30)}
                  color="#fff"
                />
                <Text style={[cardStyles.infoStatisticText]}>
                  {botDetail.rating ? botDetail.rating.toFixed(1) : '-'}
                </Text>
                <UserHeartOutline
                  style={[cardStyles.infoStatisticIcon]}
                  width={pxToDp(30)}
                  height={pxToDp(30)}
                  color="#fff"
                />
                <Text style={[cardStyles.infoStatisticText]}>{botDetail.subscriberTotal}</Text>
              </View>
            </View>
          </View>
          <View style={[cardStyles.row]}>
            <View style={[cardStyles.buttons]}>
              <Button
                wrapperStyle={[cardStyles.buttonsItem]}
                type="default"
                size="small"
                onPress={() => {
                  router.push({
                    pathname: '/main/botDetail',
                    params: { botId: botDetail.id! },
                  });
                }}>
                {intl.formatMessage({ id: 'Profile' })}
              </Button>
              <Button
                wrapperStyle={[cardStyles.buttonsItem]}
                type="link"
                size="small"
                onPress={() => {
                  // 助手和机器人能一起聊天吗? 先把助手退出吧
                  router.back();
                  // TODO: 重构待实现
                  // router.push({
                  //   pathname: '/main/botChat',
                  //   params: { botId: botDetail.id! },
                  // });
                }}>
                {intl.formatMessage({ id: 'StartChat' })}
              </Button>
            </View>
          </View>
        </View>
      )}

      <Text style={[styleStyles.text]}>{messageItem.textContent}</Text>
    </View>
  );
}

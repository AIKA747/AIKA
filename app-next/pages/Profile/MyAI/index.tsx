import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity } from 'react-native';

import Button from '@/components/Button';
import { MenuDotsFilled, PlushOutline } from '@/components/Icon';
import { useConfirmModal } from '@/components/Modal';
import { placeholderImg } from '@/constants';
import { IsAgreeCreateAgreement } from '@/constants/StorageKey';
import { getItem } from '@/hooks/useStorageState/utils';
import { getBotAppMyBots } from '@/services/jiqirenchaxun';
import { getOrderAppSubscriptionExpiredTime } from '@/services/orderService';
import pxToDp from '@/utils/pxToDp';

import PayModal from '../../Payments/PayModal';

import { MyAiImageLength, MyAiImageOffset, MyAiImageSize } from './constants';
import styles from './styles';

export default function MyAI() {
  const intl = useIntl();

  const { data: myBots = [], runAsync: runMyBots } = useRequest(
    async () => {
      const resp = await getBotAppMyBots({ pageNo: 1, pageSize: MyAiImageLength });
      return resp.data.data.list || [];
    },
    {
      manual: true,
    },
  );

  useFocusEffect(
    useCallback(() => {
      runMyBots();
    }, [runMyBots]),
  );

  const { el, show } = useConfirmModal({});
  const [payModalVisible, setPayModalVisible] = useState(false);

  const handleCreateBot = useCallback(async () => {
    // 第一次
    if (!(await getItem(IsAgreeCreateAgreement))) {
      // TODO: 重构待实现
      // router.push('/main/botCreateTerms');
      return;
    }
    const expiredTimeResp = await getOrderAppSubscriptionExpiredTime({});
    const expiredTime = expiredTimeResp.data.data;
    const isSubscription = expiredTime && dayjs(expiredTime).diff() > 0;

    if (!isSubscription) {
      show({
        text: intl.formatMessage({ id: 'Profile.MyAi.subscript.text' }),
        onOk: () => {
          setPayModalVisible(true);
        },
        onCancel: () => {},
      });
      return;
    }

    router.push('/main/botCreate');
  }, [intl, show]);

  const width = MyAiImageSize * myBots.length;
  const offsetWidth = (myBots.length - 1) * MyAiImageOffset;

  return (
    <View style={[styles.container]}>
      <View style={[styles.title]}>
        <Text style={[styles.titleText]}>
          {intl.formatMessage({ id: 'MyAI' })}
          {'  '}
          {myBots.length ? <Text style={[styles.titleTextNum]}> ({myBots.length})</Text> : undefined}
        </Text>
      </View>

      <View style={[styles.block]}>
        {myBots.length !== 0 && (
          <View style={[styles.top]}>
            <View
              style={[
                styles.items,
                {
                  width: width - offsetWidth,
                },
              ]}>
              {myBots.map((bot, index) => {
                return (
                  <TouchableOpacity
                    key={bot.id}
                    style={[styles.item]}
                    onPress={() => {
                      router.push({
                        pathname: '/main/botDetail',
                        params: {
                          botId: bot.id!,
                        },
                      });
                    }}>
                    <Image
                      style={[
                        styles.itemImage,
                        {
                          zIndex: myBots.length - index,
                          transform: [{ translateX: -MyAiImageOffset * index }],
                        },
                      ]}
                      source={bot.botAvatar || ''}
                      placeholder={placeholderImg}
                      placeholderContentFit="cover"
                      contentFit="cover"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={[styles.itemAll]}
              onPress={() => {
                // TODO: 重构待实现
                // router.push({
                //   pathname: '/main/myAi',
                // });
              }}>
              <MenuDotsFilled width={pxToDp(40)} height={pxToDp(40)} color="#FFF" style={[styles.itemAllIcon]} />
            </TouchableOpacity>
          </View>
        )}
        <Button
          style={[styles.create, myBots.length === 0 ? { marginTop: 0 } : undefined]}
          type="default"
          icon={<PlushOutline width={pxToDp(40)} height={pxToDp(40)} color="#fff" />}
          onPress={handleCreateBot}>
          {intl.formatMessage({ id: 'CreateNew' })}
        </Button>
      </View>

      {el}
      <PayModal
        from="unsubscribe"
        visible={payModalVisible}
        onClose={async (refresh) => {
          if (refresh) {
            await handleCreateBot();
          }
          setPayModalVisible(false);
        }}
      />
    </View>
  );
}

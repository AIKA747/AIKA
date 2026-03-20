import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';

import Toast from '@/components/Toast';
import { defaultCover } from '@/constants';
import { createConversation, fetchConversationById } from '@/database/services';
import { useConfigProvider } from '@/hooks/useConfig';
import { getBotAppGroupChatroomList, postBotAppChatroomMember } from '@/services/pinyin2';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

const ChatItem = (props: {
  item: Awaited<ReturnType<typeof getBotAppGroupChatroomList>>['data']['data']['list'][number];
  handleUpdate: (id: number, followed: boolean) => void;
}) => {
  const { item } = props;
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const [cacheItem, setCacheItem] = useState(item);

  useEffect(() => {
    setCacheItem(item);
  }, [item]);

  const { loading: joining, runAsync: joinChatRoom } = useRequest(postBotAppChatroomMember, {
    manual: true,
    debounceWait: 300,
  });

  const handleJoinGroupChat = useCallback(async () => {
    const conversation = await fetchConversationById(`${cacheItem?.id}`);
    if (cacheItem.joined && conversation) {
      router.push({ pathname: '/main/group-chat/chat/[roomId]', params: { roomId: cacheItem?.id } });
    } else {
      joinChatRoom({ roomId: cacheItem?.id }).then(async (res) => {
        if (res?.data?.code === 0) {
          await createConversation({
            conversationId: `${cacheItem?.id}`,
            roomName: cacheItem?.roomName,
            roomAvatar: cacheItem?.roomAvatar,
            description: cacheItem?.description,
            roomCode: cacheItem?.roomCode,
            roomType: cacheItem?.roomType || 'GROUP_CHAT',
            groupType: cacheItem?.groupType,
            memberLimit: cacheItem?.memberLimit,
            updatedAt: dayjs(cacheItem?.updatedAt).toDate(),
            createdAt: dayjs(cacheItem?.createdAt).toDate(),
            creator: cacheItem?.creator + '',
            updater: cacheItem?.updater + '',
            unreadNum: 0,
          });
          setCacheItem({ ...cacheItem, joined: true });
          router.push({ pathname: '/main/group-chat/chat/[roomId]', params: { roomId: cacheItem?.id } });
        } else {
          Toast.error(res?.data?.msg || intl.formatMessage({ id: 'failed' }));
        }
      });
    }
  }, [cacheItem, intl, joinChatRoom]);

  return (
    <View key={item.id} style={styles.item}>
      <View key={item.id} style={[styles.item]}>
        <View
          style={[
            styles.itemAvatar,
            {
              borderColor: computedThemeColor.bg_primary,
            },
          ]}>
          <Image
            style={[
              styles.itemAvatarImage,
              {
                backgroundColor: '#ccc',
              },
            ]}
            source={s3ImageTransform(cacheItem.roomAvatar, 'small')}
            contentFit="cover"
            placeholder={defaultCover}
            placeholderContentFit="cover"
          />
        </View>
        <View style={[styles.itemInfo]}>
          <Text
            style={[
              styles.itemInfoName,
              {
                color: computedThemeColor.text,
              },
            ]}
            numberOfLines={1}>
            {cacheItem.roomName}
          </Text>
          <Text
            style={[
              styles.itemInfoId,
              {
                color: '#80878E',
              },
            ]}
            numberOfLines={2}>
            {cacheItem.description}
          </Text>
        </View>
        <View style={[styles.itemButtons]}>
          <TouchableOpacity disabled={joining} onPress={() => handleJoinGroupChat()} style={[styles.itemButtonsButton]}>
            <Text
              style={[
                styles.itemButtonsButtonText,
                {
                  color: cacheItem.joined ? '#fff' : computedThemeColor.primary,
                },
              ]}>
              {intl.formatMessage({
                id: cacheItem.joined ? 'StartChat' : 'agora.search.Result.Chats.Join',
              })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(ChatItem);

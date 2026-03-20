import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { createConversation, fetchConversationById } from '@/database/services';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { postBotAppChatroomMember } from '@/services/pinyin2';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';

function JoinGroupChat() {
  const { computedTheme } = useConfigProvider();
  const intl = useIntl();
  const { code, roomId } = useLocalSearchParams<{ code: string; roomId: string; from: string }>();
  const insets = useSafeAreaInsets();
  const { fetchChatRoomDetail, chatRoomDetailLoading, chatRoomDetail } = useGroupChatProvider();

  const { loading: joining, runAsync: joinChatRoom } = useRequest(postBotAppChatroomMember, {
    manual: true,
    debounceWait: 300,
  });

  useFocusEffect(
    useCallback(() => {
      if (code) {
        fetchChatRoomDetail({ type: 'code', val: code });
      } else if (roomId) {
        fetchChatRoomDetail({ type: 'id', val: roomId });
      }
    }, [code, fetchChatRoomDetail, roomId]),
  );

  const handleJoinGroupChat = useCallback(async () => {
    if (chatRoomDetail?.status === 'APPROVE') {
      router.push({ pathname: '/main/group-chat/chat/[roomId]', params: { roomId: chatRoomDetail?.id } });
    } else {
      try {
        const conversation = await fetchConversationById(`${chatRoomDetail?.id}`);
        if (!conversation) {
          await createConversation({
            conversationId: `${chatRoomDetail?.id}`,
            roomName: chatRoomDetail?.roomName,
            roomAvatar: chatRoomDetail?.roomAvatar,
            description: chatRoomDetail?.description,
            roomCode: chatRoomDetail?.roomCode,
            roomType: chatRoomDetail?.roomType || 'GROUP_CHAT',
            groupType: chatRoomDetail?.groupType,
            memberLimit: chatRoomDetail?.memberLimit,
            updatedAt: dayjs(chatRoomDetail?.updatedAt).toDate(),
            createdAt: dayjs(chatRoomDetail?.createdAt).toDate(),
            creator: chatRoomDetail?.creator + '',
            updater: chatRoomDetail?.updater + '',
            unreadNum: 0,
          });
        }
        joinChatRoom({ roomId: `${chatRoomDetail?.id}` })
          .then((res) => {
            if (res?.data?.code === 0) {
              router.push({ pathname: '/main/group-chat/chat/[roomId]', params: { roomId: chatRoomDetail?.id || 0 } });
            } else {
              Toast.error(res?.data?.msg || intl.formatMessage({ id: 'failed' }));
            }
          })
          .catch((err) => {
            console.log('joinChatRoom error', err);
          });
      } catch (e) {
        console.log('join chat error', e);
      }
    }
  }, [chatRoomDetail, intl, joinChatRoom]);

  if (isEmpty(chatRoomDetail) && !chatRoomDetailLoading) {
    return (
      <PageView style={[styles.page]}>
        <View style={[styles.emptyContainer]}>
          <Text style={[styles.text]}>{intl.formatMessage({ id: 'agora.detail.NotExists' })}</Text>
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => {
              router.back();
            }}>
            <Text style={[styles.btnText]}>{intl.formatMessage({ id: 'GoBack' })}</Text>
          </TouchableOpacity>
        </View>
      </PageView>
    );
  }

  return (
    <PageView style={[styles.page]} loading={chatRoomDetailLoading}>
      <View style={[styles.hero]}>
        <ImageBackground
          resizeMode="cover"
          style={[styles.heroBg, { paddingTop: pxToDp(48) + insets.top, paddingBottom: pxToDp(48) }]}
          source={{ uri: s3ImageTransform(chatRoomDetail?.roomAvatar || '', [750, 540]) }}
          blurRadius={20}>
          <Image
            resizeMode="cover"
            source={{ uri: s3ImageTransform(chatRoomDetail?.roomAvatar || '', 'large') }}
            style={[styles.avatar]}
          />
        </ImageBackground>
      </View>
      <NavBar theme={computedTheme} position="Sticky" style={[{ backgroundColor: '#ffffff00' }]} />
      <ScrollView style={[styles.container]}>
        <View style={[styles.card]}>
          <View style={[styles.item]}>
            <View style={[styles.itemLabel]}>
              <Text style={[styles.itemLabelText]}>{intl.formatMessage({ id: 'AboutChat.name' })}</Text>
            </View>
            <View style={[styles.itemValue]}>
              <Text style={[styles.itemValueText, { fontSize: pxToDp(48) }]}>{chatRoomDetail?.roomName || '--'}</Text>
            </View>
          </View>
          <View style={[styles.item]}>
            <View style={[styles.itemLabel]}>
              <Text style={[styles.itemLabelText]}>{intl.formatMessage({ id: 'AboutChat.description' })}</Text>
            </View>
            <View style={[styles.itemValue]}>
              <Text style={[styles.itemValueText]}>{chatRoomDetail?.description || '--'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Button
        type="primary"
        borderType="square"
        loading={joining}
        onPress={handleJoinGroupChat}
        style={{ marginBottom: insets.bottom + pxToDp(32), marginHorizontal: pxToDp(32) }}>
        {intl.formatMessage({
          id: chatRoomDetail?.status === 'APPROVE' ? 'AboutChat.StartChat' : 'AboutChat.Join',
        })}
      </Button>
    </PageView>
  );
}

export default JoinGroupChat;

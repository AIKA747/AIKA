import { withObservables } from '@nozbe/watermelondb/react';
import { map } from '@nozbe/watermelondb/utils/rx';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';

import Avatar from '@/components/Avatar';
import { CheckOutlined, GalleryOutline, MicroOutline, RadioCheckTwoTone, VideoOutline } from '@/components/Icon';
import { defaultCover } from '@/constants';
import { GroupConversation, GroupMsg } from '@/database/models';
import { useAuth } from '@/hooks/useAuth';
import { ChatMsgStatus, ContentType, FileProperty } from '@/hooks/useChatClient';
import { useConfigProvider } from '@/hooks/useConfig';
import { formatDateTime } from '@/utils/formatDateTime';
import pxToDp from '@/utils/pxToDp';

import styles from '../../styles';

type ChatCardProps = {
  data: GroupConversation;
  lastMessage?: GroupMsg;
  onPress: () => void;
  selectable?: boolean;
  selected?: boolean;
  showMessage?: boolean;
};
function ChatCardWrapper(props: ChatCardProps) {
  const { computedThemeColor: theme } = useConfigProvider();
  const intl = useIntl();
  const { userInfo } = useAuth();
  const { data, selectable, selected, showMessage = true, lastMessage } = props;
  const getLastMessageContent = useCallback(() => {
    if (!lastMessage) {
      return null;
    }
    const messageItem = lastMessage as unknown as GroupMsg;
    if (messageItem.msgStatus === ChatMsgStatus.RECANLLED) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{ color: theme.text_secondary }}>
            {intl.formatMessage(
              { id: 'AboutChat.Undo.msg' },
              {
                name:
                  messageItem.userId === userInfo?.userId ? intl.formatMessage({ id: 'You' }) : messageItem.nickname,
              },
            )}
          </Text>
        </View>
      );
    }
    switch (messageItem.contentType) {
      case ContentType.memberChange: {
        const json = JSON.parse(messageItem.json || '{}');
        return (
          <Text numberOfLines={1} style={[styles.chatMsg, { color: theme.text_secondary }]}>
            {intl.formatMessage(
              {
                id: json.type === 'leave' ? 'AboutChat.LeaveGroup.msg' : 'AboutChat.JoinGroup.msg',
              },
              { name: json.nickname || json.username || '' },
            )}
          </Text>
        );
      }
      case ContentType.TEXT:
        // 如果是 @ 我的消息，标记 isMentionMe
        if (messageItem?.memberIds) {
          return (
            <View style={{ flexDirection: 'row', gap: pxToDp(6), alignItems: 'center' }}>
              {messageItem.memberIds.split(',').includes(userInfo?.userId || '') && (
                <Text
                  style={[
                    {
                      fontFamily: 'ProductSansRegular',
                      fontWeight: 400,
                      fontSize: pxToDp(28),
                      lineHeight: pxToDp(20 * 2),
                      color: (data?.unreadNum || 0) > 0 ? theme.text_error : theme.text_secondary,
                      marginRight: pxToDp(8),
                    },
                  ]}>
                  {intl.formatMessage({ id: 'mentionMe' })}
                </Text>
              )}
              <Text style={[styles.chatMsgNickname, { color: theme.text_secondary }]}>{messageItem?.nickname}:</Text>
              <Text numberOfLines={1} style={[styles.chatMsg, { color: theme.text_secondary }]}>
                {messageItem.textContent?.replace(/\n/g, ' ')}
              </Text>
            </View>
          );
        }
        return (
          <Text numberOfLines={1} style={[styles.chatMsg, { color: theme.text_secondary }]}>
            {messageItem.textContent?.replace(/\n/g, ' ')}
          </Text>
        );
      case ContentType.IMAGE:
        return (
          <View style={{ flexDirection: 'row', gap: pxToDp(6), alignItems: 'center' }}>
            <GalleryOutline color={theme.text_secondary} width={pxToDp(28)} height={pxToDp(28)} />
            <Text style={{ fontSize: pxToDp(26), color: theme.text_secondary }}>
              {intl.formatMessage({ id: 'Photos' }).replace('s', '')}
            </Text>
          </View>
        );
      case ContentType.VIDEO:
        return (
          <View style={{ flexDirection: 'row', gap: pxToDp(6), alignItems: 'center' }}>
            <VideoOutline color={theme.text_secondary} width={pxToDp(28)} height={pxToDp(28)} />
            <Text style={{ fontSize: pxToDp(26), color: theme.text_secondary }}>
              {intl.formatMessage({ id: 'Videos' }).replace('s', '')}
            </Text>
          </View>
        );
      case ContentType.VOICE: {
        let seconds = 0;
        const filePropertyRaw = messageItem.fileProperty || '{}';
        try {
          let fileProperty: FileProperty = JSON.parse(filePropertyRaw);
          // 当在当前聊天室接收消息时，直接使用的是 websocket 返回的消息， 经过二次序列化，这里判断是否已反序列化为 object
          if (typeof fileProperty === 'string') fileProperty = JSON.parse(fileProperty);
          seconds = Math.round(Number(fileProperty.length) || 0);
        } catch {
          console.warn('Chat card Voice - Invalid fileProperty:', filePropertyRaw, '\nmsgId:', messageItem.msgId);
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return (
          <View style={{ flexDirection: 'row', gap: pxToDp(6), alignItems: 'center' }}>
            <Text style={{ fontSize: pxToDp(26), color: theme.text_secondary }}>
              {messageItem.userId === userInfo?.userId ? 'Me' : messageItem?.nickname}:
            </Text>
            {data?.unreadNum && data?.unreadNum > 0 ? (
              <CheckOutlined color={theme.text_secondary} width={pxToDp(28)} height={pxToDp(28)} />
            ) : null}
            <MicroOutline
              color={data?.unreadNum && data.unreadNum > 0 ? theme.text_pink : theme.text_secondary}
              width={pxToDp(28)}
              height={pxToDp(28)}
            />
            <Text style={{ fontSize: pxToDp(26), color: theme.text_secondary }}>
              {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
            </Text>
          </View>
        );
      }
      default:
        return null;
    }
  }, [data.unreadNum, intl, lastMessage, theme.text_error, theme.text_pink, theme.text_secondary, userInfo?.userId]);

  return (
    <View style={{ paddingHorizontal: pxToDp(32) }}>
      <TouchableOpacity activeOpacity={0.8} style={[styles.chat]} onPress={props.onPress}>
        {selectable ? (
          <RadioCheckTwoTone
            style={{ marginRight: pxToDp(20) }}
            width={pxToDp(24 * 2)}
            height={pxToDp(24 * 2)}
            color={selected ? theme.text_pink : theme.text_secondary}
            twoToneColor={theme.text}
            checked={selected}
          />
        ) : null}
        <Avatar placeholder={defaultCover} img={data.roomAvatar} size={88} style={{ borderRadius: pxToDp(16) }} />
        <View style={styles.chatCardInfo}>
          <View style={styles.rowBetween}>
            <Text numberOfLines={1} style={[styles.chatName, { color: theme.text }]}>
              {data.roomName}
            </Text>
            {showMessage && data.lastMessage && (
              <Text
                style={[
                  styles.chatCardTime,
                  { color: data?.unreadNum && data.unreadNum > 0 ? theme.text_pink : theme.text_secondary },
                ]}>
                {formatDateTime((data.lastMessage as unknown as GroupMsg)?.createdAt?.toString())}
              </Text>
            )}
          </View>

          {showMessage && (
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', flex: 1, gap: pxToDp(10), alignItems: 'center' }}>
                {getLastMessageContent()}
              </View>
              {data?.unreadNum && data.unreadNum > 0 ? (
                <View style={[styles.chatMsgCountBox, { backgroundColor: theme.text_pink }]}>
                  <Text style={styles.chatMsgCount}>{data.unreadNum >= 100 ? '99+' : data.unreadNum}</Text>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
export default React.memo(
  withObservables(['data'], ({ data }) => ({
    data,
    lastMessage: data.messages.observeWithColumns(['created_at']).pipe(
      map((messages: GroupMsg[]) => {
        if (messages.length === 0) return null;
        // 找到 created_at 最大的消息
        return messages.reduce((latest, msg) =>
          msg.createdAt && latest.createdAt && msg.createdAt > latest.createdAt ? msg : latest,
        );
      }),
    ),
  }))(ChatCardWrapper),
);

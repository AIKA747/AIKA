import { Q } from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { FlexAlignType, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { MessageItem } from '@/components/Chat/types';
import Toast from '@/components/Toast';
import { placeholderImg } from '@/constants';
import { database } from '@/database';
import GroupMsg from '@/database/models/group-msg';
import { TableName } from '@/database/schema';
import { ChatModule, ContentType } from '@/hooks/useChatClient';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import ForwardedText from '../ForwardedText';

import styles, { messagesStylesLeft, messagesStylesRight } from './styles';
import { MessageContextTextProps } from './types';

const MessageContextText = (props: MessageContextTextProps) => {
  const { messageItem, messagePosition, chooseTextItemId, chatModule, onReplyMsgPress, disabled } = props;

  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const chooseTextRef = useRef<TextInput>(null);

  const stylesPosition = {
    left: messagesStylesLeft,
    right: messagesStylesRight,
  }[messagePosition || 'left'];

  const prevChooseTextItemId = useRef<string>(undefined);
  useEffect(() => {
    prevChooseTextItemId.current = chooseTextItemId;
  }, [chooseTextItemId]);

  useEffect(() => {
    if (chooseTextItemId !== undefined && messageItem.msgId !== undefined && chooseTextItemId === messageItem.msgId) {
      chooseTextRef.current?.focus();
    }
  }, [chooseTextItemId, messageItem]);

  const messageJSON = useMemo(() => {
    try {
      return JSON.parse(messageItem.json ?? '{}');
    } catch {
      return {};
    }
  }, [messageItem]);

  const handleReplyMsgPress = useCallback(async () => {
    // 重复查询一次本地是否还有这条回复消息（用户可能就在此次交互中本地删除了该条消息）
    // prettier-ignore
    const res = await database.get<GroupMsg>(TableName.GROUP_MSGS).query(Q.where('msg_id', messageItem.replyMessageId!)).fetch();
    if (!res.length) Toast.info(intl.formatMessage({ id: 'chats.msg.not.exist' }));
    else onReplyMsgPress?.(res[0].toJSON() as MessageItem);
  }, [intl, messageItem.replyMessageId, onReplyMsgPress]);

  const isGroupMsg = chatModule === ChatModule.group;

  const textStyle = [
    styles.text,
    { color: computedThemeColor.text },
    { alignSelf: 'flex-start' as FlexAlignType },
    isGroupMsg
      ? { color: messagePosition === 'left' ? computedThemeColor.bg_primary : computedThemeColor.text_white }
      : undefined,
  ];

  const getReplyMessageContent = useCallback(() => {
    if (messageJSON?.contentType === ContentType.IMAGE) {
      return (
        <View style={{ width: pxToDp(100), height: pxToDp(100), backgroundColor: '#333', borderRadius: pxToDp(8) }}>
          <Image
            style={{ flex: 1 }}
            source={{ uri: s3ImageTransform(messageJSON.media, 100) }}
            placeholder={placeholderImg}
            contentFit="cover"
            placeholderContentFit="cover"
          />
        </View>
      );
    }
    return (
      <Text style={{ color: computedThemeColor.text, fontSize: pxToDp(24) }}>
        {messageJSON.textContent || messageJSON.txt}
      </Text>
    );
  }, [computedThemeColor.text, messageJSON]);

  return (
    <View style={{ width: '100%' }}>
      {/*// TODO: 点击时如果是内容是链接需要 使用 processTextPart 进行内容处理*/}
      <View
        style={[
          styles.container,
          stylesPosition.container,
          {
            minHeight: pxToDp(80),
            maxWidth: isGroupMsg && messagePosition === 'left' ? '92%' : '85%',
            backgroundColor:
              messagePosition === 'left'
                ? computedThemeColor.chat_left_bubble_bg
                : computedThemeColor.chat_right_bubble_bg,
            alignSelf: messagePosition === 'left' ? 'flex-start' : 'flex-end',
          },
          isGroupMsg ? stylesPosition.groupMsgBgColor : undefined,
        ]}>
        <ForwardedText message={messageItem} position={messagePosition} />
        {/* 渲染被引用回复的消息 */}
        {isGroupMsg && !!messageItem.replyMessageId && (
          <TouchableOpacity
            disabled={disabled}
            activeOpacity={0.8}
            delayLongPress={600}
            onPress={handleReplyMsgPress}
            onLongPress={props.onLongPress}
            style={[styles.replyMessage, { backgroundColor: '#220C67' }]}>
            <View style={[styles.line, { backgroundColor: messagePosition === 'left' ? '#301190' : '#F6F6F6' }]} />
            <View style={styles.replyContent}>
              <Text numberOfLines={1} style={{ fontSize: pxToDp(24), marginBottom: pxToDp(16), color: '#C60C93' }}>
                {messageJSON.nickname || messageJSON.username}
              </Text>
              {getReplyMessageContent()}
            </View>
          </TouchableOpacity>
        )}

        <View>
          {/* FIXME 右侧视角时，路过文本内容过多，会出现右侧边距 */}
          {(messageItem.nickname || messageItem.username) &&
            messagePosition === 'left' &&
            isEmpty(messageItem.forwardInfo) && (
              <View style={{ marginBottom: pxToDp(12) }}>
                <Text
                  style={[
                    styles.username,
                    stylesPosition.username,
                    { color: computedThemeColor.text_secondary },
                    isGroupMsg ? { color: computedThemeColor.toast_info_bg } : undefined,
                  ]}>
                  {messageItem.nickname || messageItem.username}
                </Text>
              </View>
            )}

          {Platform.OS === 'ios' && (
            <TextInput
              key={prevChooseTextItemId.current && !chooseTextItemId ? 1 : 2}
              ref={chooseTextRef}
              multiline
              cursorColor="transparent"
              editable={false}
              scrollEnabled={false}
              selectTextOnFocus
              selectionColor={computedThemeColor.primary}
              showSoftInputOnFocus={false}
              value={messageItem.textContent}
              style={textStyle}
            />
          )}
          {Platform.OS === 'android' && (
            <Text
              style={textStyle}
              selectable={messageItem.msgId === chooseTextItemId}
              selectionColor={computedThemeColor.primary}>
              {messageItem.textContent}
            </Text>
          )}

          {isGroupMsg && (
            <Text style={[styles.time, { color: computedThemeColor.text_secondary }]}>
              {dayjs(messageItem.createdAt).format('HH:mm')}
            </Text>
          )}
          {(chooseTextItemId === undefined || chooseTextItemId !== messageItem.msgId) && (
            <View
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 10,
                  // backgroundColor: 'rgba(0, 0, 0, 0.3)',
                },
              ]}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(MessageContextText);

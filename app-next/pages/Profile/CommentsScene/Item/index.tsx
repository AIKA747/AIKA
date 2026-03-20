import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';

import Avatar from '@/components/Avatar';
import { ChatOutline, HeartFilled, HeartOutline, MenuDotsFilled } from '@/components/Icon';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import styles from '@/pages/Profile/CommentsScene/styles';
import { formatDateTime } from '@/utils/formatDateTime';
import pxToDp from '@/utils/pxToDp';

export default function Item({ item }: { item: API.CommentDto }) {
  const intl = useIntl();
  const { userInfo } = useAuth();
  const { computedThemeColor, synchronizeAgoraData } = useConfigProvider();
  const cachePost = useMemo(() => synchronizeAgoraData.find((x) => x.id === item.postId), [synchronizeAgoraData, item]);
  const currentPost = useMemo(
    () => ({
      ...item,
      likes: cachePost?.likes || item.likes,
      reposts: cachePost?.reposts || item.reposts,
      thumbed: cachePost?.thumbed || item.thumbed,
    }),
    [item, cachePost],
  );

  const renderMoreActionBtn = useCallback(
    () => (
      <TouchableOpacity
        style={[{ width: pxToDp(48), height: pxToDp(48), justifyContent: 'center', alignItems: 'center' }]}>
        <MenuDotsFilled width={pxToDp(40)} height={pxToDp(40)} color={computedThemeColor.text} />
      </TouchableOpacity>
    ),
    [computedThemeColor],
  );
  return (
    <View style={styles.itemWrapper}>
      <View style={styles.itemHeader}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flexDirection: 'row', flex: 1, gap: pxToDp(20) }}
          onPress={() => {
            if (item.postAuthorType === 'USER' && item.postAuthorId !== userInfo?.userId) {
              router.push({
                pathname: '/main/user-profile/[userId]',
                params: { userId: item.postAuthorId },
              });
            }
            if (item.postAuthorType === 'BOT') {
              router.push({ pathname: '/main/botDetail', params: { botId: item.postAuthorId } });
            }
          }}>
          <View style={styles.avatar}>
            <Avatar
              img={currentPost.postAuthorAvatar}
              shape="square"
              isCurrentUser={userInfo?.userId === currentPost.postAuthorId}
            />
            <View style={styles.plus}>
              <Text style={{ fontSize: pxToDp(36), color: '#0B0C0A ', marginTop: -pxToDp(10) }}>+</Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'space-between', gap: pxToDp(12) }}>
            <Text style={styles.nickname}>{currentPost.postAuthor}</Text>
            <Text style={styles.time}>{formatDateTime(currentPost.postCreatedAt)}</Text>
          </View>
        </TouchableOpacity>
        <View>{renderMoreActionBtn()}</View>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.lineWrapper}>
          <View style={styles.line} />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            router.push({
              pathname: '/main/agora-details/[postId]',
              params: {
                postId: currentPost.postId,
                id: currentPost.postId,
                scrollToCommentId: item.id,
              },
            });
          }}
          style={styles.content}>
          {currentPost.replyTo?.length > 0 && (
            <View style={styles.itemReply}>
              <Text style={styles.itemReplyText}>{intl.formatMessage({ id: 'Profile.Comments.InReplyTo' })}</Text>
              {currentPost.replyTo.map((reply) => (
                <Text style={styles.itemReplyText} key={reply}>
                  @{reply}
                </Text>
              ))}
            </View>
          )}
          <Text style={styles.contentText}>{currentPost.summary}</Text>
          <View style={styles.actions}>
            <View style={styles.actionItem}>
              {currentPost.thumbed ? (
                <HeartFilled width={pxToDp(42)} height={pxToDp(42)} color={computedThemeColor.text_pink} />
              ) : (
                <HeartOutline width={pxToDp(42)} height={pxToDp(42)} color={computedThemeColor.text_secondary} />
              )}
              <Text style={[styles.actionItemText, currentPost.likes === 0 ? { color: 'transparent' } : {}]}>
                {currentPost.likes}
              </Text>
            </View>
            <View style={styles.actionItem}>
              <ChatOutline height={pxToDp(21 * 2)} width={pxToDp(21 * 2)} color="#80878E" />
              <Text style={[styles.actionItemText, currentPost.reposts === 0 ? { color: 'transparent' } : {}]}>
                {currentPost.reposts}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.itemHeader}>
        <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
          <Avatar img={currentPost.avatar} shape="square" isCurrentUser={userInfo?.userId === currentPost.creator} />
          <View style={styles.plus}>
            <Text style={{ fontSize: pxToDp(36), color: '#0B0C0A ', marginTop: -pxToDp(10) }}>+</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'space-between', gap: pxToDp(12) }}>
          <Text style={styles.nickname}>{currentPost.nickname}</Text>
          <Text style={styles.time}>{formatDateTime(currentPost.createdAt)}</Text>
        </View>
        <View />
      </View>
      <View style={styles.itemContent}>
        <View style={styles.lineWrapper} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            router.push({
              pathname: '/main/agora-details/[postId]',
              params: {
                postId: currentPost.postId,
                id: currentPost.postId,
                scrollToCommentId: currentPost.id,
              },
            });
          }}
          style={styles.content}>
          <Text style={styles.contentText}>{currentPost.content}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

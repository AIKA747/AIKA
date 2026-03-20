import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity } from 'react-native';

import Avatar from '@/components/Avatar';
import { LoadingOutline } from '@/components/Icon';
import Toast from '@/components/Toast';
import { createConversation } from '@/database/services';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { UserListType } from '@/pages/Profile/Friend/UserList';
import { postContentAppFollowRelation } from '@/services/agoraxin';
import { getBotAppChatroomId } from '@/services/pinyin2';
import { getBotAppChatroomUserChat } from '@/services/yonghuyiduiyiliaotian';
import pxToDp from '@/utils/pxToDp';

const UserItem = ({
  type,
  item,
  showAction = true,
  onRemove,
  onRefreshStatistics,
}: {
  item: any;
  type: UserListType;
  showAction?: boolean;
  onRemove?: (id: string) => void;
  onRefreshStatistics?: () => void;
}) => {
  const { computedThemeColor } = useConfigProvider();
  const { fetchChatRoomDetail, conversations } = useGroupChatProvider();
  const intl = useIntl();
  const [cacheItem, setCacheItem] = useState(item);

  // 关注 / 取消关注
  const { run: fetchFollowOrUnfollow, loading } = useRequest(
    async () => {
      try {
        const res = await postContentAppFollowRelation({
          followingId: cacheItem?.id || cacheItem?.userId,
          type: 'USER',
          actionType: cacheItem.followed ? 'DELETE' : 'ADD',
        });
        if (res.data?.code !== 0) {
          Toast.error(res.data?.msg || intl.formatMessage({ id: 'failed' }));
          return;
        }
        setCacheItem((v: any) => ({
          ...v,
          followed: !v.followed,
        }));
        onRefreshStatistics?.();
        // 如果取消关注时，需要刷新数据，请将注释代码放开即可
        // if (cacheItem.followStatus === 'FOLLOWING') {
        //   onRemove?.(cacheItem.id);
        // }
      } catch {
        Toast.error(intl.formatMessage({ id: 'failed' }));
      }
    },
    { manual: true, debounceWait: 300, refreshDeps: [cacheItem, intl, onRemove, onRefreshStatistics] },
  );
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        router.push({ pathname: '/main/user-profile/[userId]', params: { userId: cacheItem.userId || cacheItem.id } });
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: pxToDp(32),
        paddingVertical: pxToDp(24),
        gap: pxToDp(24),
      }}>
      <View style={{ flexDirection: 'row', flex: 1, gap: pxToDp(24) }}>
        <Avatar img={cacheItem.avatar} size={88} shape="square" />
        <View style={{ gap: pxToDp(10), flex: 1 }}>
          <Text style={{ fontSize: pxToDp(32), color: computedThemeColor.text }} numberOfLines={1}>
            {cacheItem.nickname}
          </Text>
          <Text style={{ fontSize: pxToDp(24), color: computedThemeColor.text_secondary }} numberOfLines={2}>
            @{cacheItem.username}
          </Text>
          {type === 'recommendations' && (
            <Text style={{ color: computedThemeColor.text }} numberOfLines={2}>
              {cacheItem.bio}
            </Text>
          )}
        </View>
      </View>
      {showAction && (
        <View style={{ minWidth: pxToDp(160) }}>
          {['follower', 'following', 'recommendations'].includes(type) && !cacheItem.friend && (
            <TouchableOpacity
              disabled={loading}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: computedThemeColor.primary,
                borderWidth: pxToDp(2),
                borderRadius: pxToDp(10),
                padding: pxToDp(10),
                paddingHorizontal: pxToDp(24),
                gap: pxToDp(8),
              }}
              onPress={fetchFollowOrUnfollow}>
              {loading ? (
                <LoadingOutline width={pxToDp(32)} height={pxToDp(32)} color={computedThemeColor.primary} />
              ) : undefined}
              <Text
                style={{
                  color: computedThemeColor.primary,
                  fontSize: pxToDp(28),
                  lineHeight: pxToDp(32),
                  textAlign: 'center',
                }}>
                {intl.formatMessage({
                  id: cacheItem.followed ? 'unfollow' : 'follow',
                })}
              </Text>
            </TouchableOpacity>
          )}
          {type === 'friend' && (
            <TouchableOpacity
              style={{
                borderColor: computedThemeColor.text_secondary,
                borderWidth: pxToDp(2),
                borderRadius: pxToDp(10),
                padding: pxToDp(10),
                paddingHorizontal: pxToDp(24),
              }}
              onPress={async () => {
                try {
                  const res = await getBotAppChatroomUserChat({ friendId: cacheItem.userId });
                  if (res.data.code !== 0) throw res;
                  const conversation = conversations?.find((x) => x.conversationId === `${res.data.data}`);
                  if (!conversation) {
                    const roomRes = await getBotAppChatroomId({ id: res.data.data as unknown as string });
                    const {
                      id,
                      createdAt,
                      creator,
                      roomCode,
                      roomAvatar,
                      roomName,
                      description,
                      groupType,
                      roomType,
                      updater,
                      updatedAt,
                    } = roomRes?.data?.data;
                    await createConversation({
                      conversationId: String(id),
                      roomName: roomName || '',
                      roomAvatar: roomAvatar || '',
                      roomCode: roomCode || '',
                      roomType: roomType || 'CHAT',
                      description: description || '',
                      groupType: groupType,
                      updater: String(updater),
                      creator: String(creator),
                      updatedAt: dayjs(updatedAt).toDate(),
                      createdAt: dayjs(createdAt).toDate(),
                      unreadNum: 0,
                    });
                  }
                  await fetchChatRoomDetail({ val: String(res.data.data), type: 'id' });
                  router.push({
                    pathname: '/main/group-chat/chat/[roomId]',
                    params: { roomId: String(res.data.data), isPersonal: 'true' },
                  });
                } catch (e) {
                  console.error(e);
                  Toast.error(intl.formatMessage({ id: 'failed' }));
                }
              }}>
              <Text
                style={{
                  color: computedThemeColor.text_secondary,
                  fontSize: pxToDp(28),
                  lineHeight: pxToDp(32),
                  textAlign: 'center',
                }}>
                {intl.formatMessage({ id: 'Message' })}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
export default React.memo(UserItem);

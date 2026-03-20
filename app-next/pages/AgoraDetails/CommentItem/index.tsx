import dayjs from 'dayjs';
import { router } from 'expo-router';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import Avatar from '@/components/Avatar';
import { InfoCircleOutline, LoadingOutline } from '@/components/Icon';
import { ListRef } from '@/components/List/types';
import { defaultCover } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import ContextVoice from '@/pages/AgoraDetails/CommentItem/ContextVoice';
import { CommentData } from '@/pages/AgoraDetails/types';
import { processTextPartFn } from '@/utils/formatChat';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

const CommentItem = ({
  item,
  listRef,
  position,
  highlightedId,
  onLongPress,
}: {
  item: CommentData;
  listRef?: React.RefObject<ListRef<CommentData> | null>;
  highlightedId?: string;
  position?: 'left' | 'right';
  onLongPress?: ((event: GestureResponderEvent) => void) | undefined;
}) => {
  const { computedThemeColor } = useConfigProvider();
  const { userInfo } = useAuth();
  const highlightAnim = useSharedValue(0);
  const replyObj = useMemo(() => {
    try {
      return JSON.parse(item.replyCommontInfo ?? '{}');
    } catch {
      return {};
    }
  }, [item]);

  const isHighlighted = useMemo(() => highlightedId && `${item.id}` === highlightedId, [highlightedId, item.id]);

  useEffect(() => {
    if (!isHighlighted) {
      highlightAnim.value = withTiming(0, { duration: 150 });
      return;
    }

    // 🔥 确保 scrollToItem 在 JS thread 执行
    scheduleOnRN(() => {
      listRef?.current?.scrollToItem({
        item,
        animated: true,
        viewPosition: 0.5,
      });
    });

    const clearHighlight = () => {
      router.setParams({ scrollToCommentId: undefined });
    };

    highlightAnim.value = withSequence(
      withTiming(1, { duration: 500 }),
      withTiming(0, { duration: 500 }),
      withTiming(1, { duration: 500 }),
      withTiming(0, { duration: 500 }),
      withTiming(1, { duration: 500 }),
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          scheduleOnRN(clearHighlight);
        }
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightAnim, isHighlighted, listRef]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(highlightAnim.value, [0, 1], ['transparent', computedThemeColor.primary + 60]),
    };
  });

  const getReplyNode = useCallback(() => {
    if (isEmpty(replyObj)) {
      return null;
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        delayLongPress={600}
        // onPress={handleReplyMsgPress}
        // onLongPress={props.onLongPress}
        style={[styles.replyContainer, { backgroundColor: '#220C67' }]}>
        <View style={[styles.replyContentLine, { backgroundColor: position === 'left' ? '#301190' : '#F6F6F6' }]} />
        <View style={styles.replyContent}>
          <Text numberOfLines={1} style={{ fontSize: pxToDp(24), marginBottom: pxToDp(16), color: '#C60C93' }}>
            {replyObj.nickname}
          </Text>
          <Text style={{ color: computedThemeColor.text, fontSize: pxToDp(24) }}>{replyObj.content}</Text>
        </View>
      </TouchableOpacity>
    );
  }, [computedThemeColor.text, position, replyObj]);

  const renderStatus = useCallback(() => {
    switch (item.status) {
      case 'sending':
        return <LoadingOutline width={pxToDp(30)} height={pxToDp(30)} color="#fff" />;
      case 'failed':
        return <InfoCircleOutline color="#C92E2E" width={pxToDp(30)} height={pxToDp(30)} />;
      default:
        return null;
    }
  }, [item.status]);

  const getCommentInnerContent = useCallback(
    () => (
      <View style={{ flexDirection: 'row', gap: pxToDp(8) }}>
        <View>{renderStatus()}</View>
        {item.voiceUrl ? (
          <ContextVoice onLongPress={onLongPress} item={item} position={position} />
        ) : (
          <View style={[styles.container, position === 'left' ? styles.leftContainer : styles.rightContainer]}>
            {getReplyNode()}
            {position === 'left' && (
              <Text style={[styles.nickname, { color: computedThemeColor.text }]}>{item.nickname}</Text>
            )}
            <Text style={[styles.containerText, { color: computedThemeColor.text }]}>{item.content}</Text>
            <Text style={[styles.time, { color: position === 'left' ? computedThemeColor.text_secondary : '#80878E' }]}>
              {dayjs(item.createdAt).format('HH:mm')}
            </Text>
          </View>
        )}
      </View>
    ),
    [getReplyNode, computedThemeColor, item, onLongPress, position, renderStatus],
  );

  return (
    <Reanimated.View
      style={[
        styles.commentItem,
        position === 'right' ? { justifyContent: 'flex-end', alignItems: 'flex-start' } : {},
        animatedStyle,
      ]}>
      {item.creator !== userInfo?.userId && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            router.push({
              pathname: '/main/user-profile/[userId]',
              params: { userId: item.creator },
            });
          }}>
          <Avatar shape="square" placeholder={defaultCover} img={item.avatar} style={styles.commentItemAvatar} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          styles.commentItemContent,
          {
            alignItems: position === 'left' ? 'flex-start' : 'flex-end',
          },
        ]}
        activeOpacity={1}
        delayLongPress={600} // 设置长按时长
        onPress={() => {
          processTextPartFn(item.content || '');
        }}
        onLongPress={onLongPress}>
        {getCommentInnerContent()}
      </TouchableOpacity>

      {/**item.creator === userInfo?.userId && (
       <TouchableOpacity
       activeOpacity={1}
       style={[
       styles.commentItemAvatar,
       {
       marginRight: pxToDp(0),
       marginLeft: pxToDp(24),
       },
       ]}
       onPress={() => {
       router.push('/profile');
       }}
       >
       <Avatar shape="square" img={item?.avatar} placeholder={defaultCover} />
       </TouchableOpacity>
       ) */}
    </Reanimated.View>
  );
};

export default CommentItem;

import dayjs from 'dayjs';
import * as Clipboard from 'expo-clipboard';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { MenuDotsFilled } from '@/components/Icon';
import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import Post, { More as PostMore, PostData, ReportModal as PostReportModal } from '@/components/Post';
import { PostMoreAction } from '@/components/Post/More/types';
import { AFEventKey } from '@/constants/AFEventKey';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import CommentItem from '@/pages/AgoraDetails/CommentItem';
import styles from '@/pages/AgoraDetails/styles';
import Title from '@/pages/AgoraDetails/Title';
import { CommentData } from '@/pages/AgoraDetails/types';
import { putContentAppPostVisit } from '@/services/agoraxin';
import {
  deleteContentAppCommentId,
  getContentAppComment,
  postContentAppComment,
  putContentAppComment,
} from '@/services/pinglun';
import { getContentAppPostId } from '@/services/tiezi';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import { formatDateTime } from '@/utils/formatDateTime';
import pxToDp from '@/utils/pxToDp';
import uploadAsync from '@/utils/uploadAsync';

import InputArea from './InputArea';
import { InputAreaRef } from './InputArea/types';
import MenuModal from './MenuModal';
import { ActionEvent } from './MenuModal/types';
import ReportModal from './ReportModal';

const AgoraDetails = () => {
  const { computedThemeColor, onSynchronizeAgoraData, setRefreshConfig, eventEmitter } = useConfigProvider();
  const { userInfo } = useAuth();
  const [reposts, setReposts] = useState<number>(0);
  const listRef = useRef<ListRef<CommentData>>(null);
  const inputAreaRef = useRef<InputAreaRef>(null);
  const [data, setData] = useState<PostData>();
  const [menuModalVisible, setMenuModalVisible] = useState<CommentData>();
  const [menuModalPosition, setMenuModalPosition] = useState<Partial<{ x: number; y: number }>>();
  const [longPressMessagePosition, setLongPressMessagePosition] = useState<'left' | 'right'>();
  const [replyMsg, setReplyMsg] = useState<CommentData>();
  const [editComment, setEditComment] = useState<CommentData>();
  const [reportModalVisible, setReportModalVisible] = useState<CommentData>();
  const [openReportModal, setOpenReportModal] = useState<boolean>(false);
  const [openMoreModal, setOpenMoreModal] = useState<{ open: boolean; nativeEvent?: object }>({
    open: false,
  });
  const { postId, showMoreItems, from, scrollToCommentId } = useLocalSearchParams<{
    postId: string;
    showMoreItems: string;
    from: 'profile' | 'postDetail';
    scrollToCommentId?: string; // 需要滚动到具体评论的ID
  }>();

  useFocusEffect(
    useCallback(() => {
      getContentAppPostId({ id: postId }).then((res) => {
        if (res?.data?.code === 0) {
          setReposts(res.data.data.reposts);
          setData((res.data.data || {}) as any);
          putContentAppPostVisit({ id: res.data.data?.id }).then((result) => {
            console.log('帖子访问数 +1 :', result.data);
          });
        }
      });
    }, [postId]),
  );

  const handleAction = useCallback(async (e: ActionEvent) => {
    const item = e?.item;
    if (!item) return;

    // 菜单弹窗
    if (e.type === 'menu') {
      const { pageX, pageY } = e?.nativeEvent as any;
      setMenuModalVisible({ ...item });
      setMenuModalPosition({ x: pageX, y: pageY });
      return;
    }

    // 举报弹窗
    if (e.type === 'report') {
      setReportModalVisible(item);
      return;
    }
    if (e.type === 'delete') {
      listRef.current?.handleDelete('id', e.id);
      setReposts((v) => --v);
      await deleteContentAppCommentId({ id: +e.id });
      return;
    }

    if (e.type === 'edit' && !item.voiceUrl) {
      inputAreaRef.current?.setContentText(item.content || '');
      setEditComment(item);
      return;
    }
    if (e.type === 'reply') {
      setReplyMsg(item);
    }

    if (e.type === 'copy' && item.content) {
      await Clipboard.setStringAsync(item.content || '');
    }
  }, []);

  const postMoreItems = useMemo(() => {
    const menu = [PostMoreAction.Share];
    if (data?.author === userInfo?.userId) {
      menu.push(PostMoreAction.Delete);
    } else {
      menu.unshift(PostMoreAction.Report);
      menu.push(PostMoreAction.Hide);
    }
    return menu;
  }, [data, userInfo]);

  return (
    <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior} style={[styles.container]}>
      <View style={styles.container}>
        <NavBar
          title={<Title post={data as any} />}
          style={[{ backgroundColor: computedThemeColor.bg_primary }]}
          more={
            <View style={[styles.NavBarMore]}>
              <TouchableOpacity
                style={[styles.NavBarMoreIcon]}
                onPress={(event) => {
                  setOpenMoreModal({
                    open: postMoreItems?.length > 0,
                    nativeEvent: event?.nativeEvent,
                  });
                }}>
                <MenuDotsFilled width={pxToDp(40)} height={pxToDp(40)} color={computedThemeColor.text} />
              </TouchableOpacity>
            </View>
          }
        />
        <View
          style={[
            styles.chatContainer,
            {
              backgroundColor: computedThemeColor.bg_primary,
            },
          ]}>
          <List
            ref={listRef}
            footerProps={{
              moreText: '',
              noMoreText: '',
            }}
            ListHeaderComponent={
              data ? (
                <View
                  style={{
                    marginHorizontal: pxToDp(24),
                    marginBottom: pxToDp(32),
                    paddingBottom: pxToDp(32),
                  }}>
                  <Post
                    showBack={false}
                    showMoreBtn={false}
                    showHeader={false}
                    navBarMoreItems={JSON.parse(showMoreItems ?? '[]')}
                    data={{ ...data, reposts } as any}
                    contentElliptical={(data?.thread || []).length === 0}
                    handleUpdate={(updated) => {
                      onSynchronizeAgoraData({
                        id: data.id,
                        likes: updated.likes,
                        thumbed: updated.thumbed,
                      });
                      setData({ ...data, ...updated });
                    }}
                    isImageAspectRatioPreserved
                    callback={(type) => {
                      if (type === PostMoreAction.Delete && from === 'profile') {
                        router.back();
                      }
                    }}
                    onPlayerReady={(id, player) => {
                      console.log('id:', id);
                    }}
                    onPressPlay={(id: number) => {
                      console.log('Function not implemented.' + id);
                    }}
                  />
                </View>
              ) : undefined
            }
            maxItemsInRecyclePool={0}
            maintainVisibleContentPosition={{
              animateAutoScrollToBottom: false,
              startRenderingFromBottom: false,
            }}
            renderItem={({ item, index, extraData }) => {
              const list = extraData.allList || [];
              const prReplyTime = list[index - 1]?.createdAt;
              // 每天间隔显示一次日期
              const showTime = !prReplyTime || !dayjs(item.createdAt).isSame(dayjs(prReplyTime), 'day');
              const itemPosition = item.creator !== userInfo?.userId ? 'left' : 'right';
              return (
                <View>
                  {showTime && (
                    <View style={styles.commentItemTime}>
                      <View style={styles.commentItemTimeBubble}>
                        <Text style={[styles.commentItemTimeBubbleText, { color: computedThemeColor.text }]}>
                          {formatDateTime(item.createdAt)}
                        </Text>
                      </View>
                    </View>
                  )}
                  <CommentItem
                    listRef={listRef}
                    position={itemPosition}
                    item={item}
                    highlightedId={scrollToCommentId}
                    onLongPress={(e) => {
                      setLongPressMessagePosition(itemPosition);
                      handleAction({ ...e, type: 'menu', id: item.id, itemPosition, item });
                    }}
                  />
                </View>
              );
            }}
            pageSize={999}
            request={async ({ pageNo, pageSize }) => {
              const resp = await getContentAppComment({
                pageNo,
                pageSize,
                postId,
              });
              setReposts(resp.data.data.total || 0);
              onSynchronizeAgoraData({
                id: Number(postId),
                reposts: resp.data.data.total || 0,
              });
              const list = resp.data.data.list || [];
              return {
                data: list,
                total: resp.data.data.total || 0,
              };
            }}
          />
        </View>
        <View style={{ paddingVertical: pxToDp(16), backgroundColor: computedThemeColor.bg_primary }}>
          <InputArea
            ref={inputAreaRef}
            replyMsg={replyMsg}
            clearReplyMsg={() => {
              setReplyMsg(undefined);
            }}
            onSend={async (data) => {
              if (editComment && data.contentType === 'TEXT') {
                listRef.current?.handleUpdate('id', editComment.id, {
                  ...editComment,
                  content: data.text,
                });
                await putContentAppComment({
                  ...editComment,
                  content: data.text,
                } as any);
              } else {
                const tempId = dayjs().valueOf();
                const tempData: any = {
                  id: tempId,
                  creator: userInfo?.userId!,
                  nickname: userInfo?.nickname!,
                  username: userInfo?.username!,
                  postId: +postId,
                  status: 'sending',
                };
                const params: {
                  /** 评论内容 */
                  content?: string;
                  /** 语音链接 */
                  voiceUrl?: string;
                  postId: string;
                  /** 文件属性，前端自行设置，后端不做参数解析，会在列表接口进行返回 */
                  fileProperty?: string;
                  /** 回复的评论信息，提交时需要转成String类型 */
                  replyCommontInfo?: string;
                } = {
                  postId,
                };
                if (replyMsg) {
                  params.replyCommontInfo = JSON.stringify(replyMsg);
                  tempData.replyCommontInfo = JSON.stringify(replyMsg);
                }
                if (data.contentType === 'TEXT') {
                  params.content = data.text;
                  tempData.content = data.text;
                  listRef.current?.handleInsert(tempData);
                }
                if (data.contentType === 'VOICE') {
                  try {
                    params.content = `[VOICE]`;
                    tempData.content = `[VOICE]`;
                    tempData.voiceUrl = data.fileUrl;
                    tempData.fileProperty = {
                      length: data.length,
                      fileName: data.fileUrl,
                    };
                    listRef.current?.handleInsert(tempData);
                    params.voiceUrl = await uploadAsync({ fileUrl: data.fileUrl });
                    params.fileProperty = JSON.stringify({
                      length: data.length,
                      fileName: data.fileUrl,
                    });
                  } catch {
                    // 转换失败或者上传是失败
                    listRef.current?.handleUpdate('id', tempId, {
                      status: 'failed',
                    });
                    return;
                  }
                }
                try {
                  const res = await postContentAppComment({
                    ...params,
                  } as any);
                  listRef.current?.handleUpdate('id', tempId, {
                    ...(res?.data?.data || {}),
                    status: 'delivered',
                  } as any);
                  listRef.current?.scrollToEnd();
                  eventEmitter?.emit({ method: 'refresh-profile-comments' });
                  sendAppsFlyerEvent(AFEventKey.AFAgoraPostCommented);
                } catch (e) {
                  console.log('postContentAppCommentError', e);
                  listRef.current?.handleUpdate('id', tempId, {
                    status: 'failed',
                  });
                }
              }
              setReplyMsg(undefined);
              setEditComment(undefined);
            }}
            isTyping={false}
          />
        </View>
      </View>
      <MenuModal
        visible={!!menuModalVisible}
        item={menuModalVisible}
        onAction={handleAction}
        position={menuModalPosition as any}
        itemPosition={longPressMessagePosition}
        onClose={() => {
          setMenuModalVisible(undefined);
        }}
      />
      <ReportModal
        visible={!!reportModalVisible}
        item={reportModalVisible}
        onClose={async () => {
          setReportModalVisible(undefined);
        }}
      />
      <PostMore
        visible={openMoreModal.open}
        navBarMoreItems={postMoreItems}
        post={{ ...data, reposts: reposts || 0 } as any}
        nativeEvent={openMoreModal?.nativeEvent}
        onClose={(type) => {
          setOpenMoreModal({ open: false });
          setOpenReportModal(type === PostMoreAction.Report);
          if (type === PostMoreAction.Delete) {
            router.back();
            setRefreshConfig((v) => {
              return {
                ...v,
                homePage: {
                  ...v?.homePage,
                  feedRefresh: true,
                  followRefresh: true,
                  privateRefresh: true,
                },
              };
            });
          }
        }}
      />
      <PostReportModal
        postId={data?.id!}
        visible={openReportModal}
        onClose={(value) => {
          setOpenReportModal(false);
          if (value) {
            onSynchronizeAgoraData({
              id: data?.id!,
              thumbed: data?.thumbed,
              likes: data?.likes,
              reposts: data?.reposts,
              reportId: value,
            });
            router.back();
          }
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default AgoraDetails;

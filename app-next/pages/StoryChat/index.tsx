import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import Chat from '@/components/Chat';
import { ChatListRef } from '@/components/Chat/ChatList/types';
import { MessageItem } from '@/components/Chat/types';
import { MenuDotsFilled, SearchOutline } from '@/components/Icon';
import Modal from '@/components/Modal';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { placeholderImg, placeholderUser } from '@/constants';
import { AFEventKey } from '@/constants/AFEventKey';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useAuth } from '@/hooks/useAuth';
import { ChapterProcess, ChapterStatus, ChatModule } from '@/hooks/useChatClient/types';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { useStoryProvider } from '@/hooks/useStory';
import { setChatSearchGlobalProps } from '@/pages/ChatSearch';
import { getContentAppStoryChatRecord, postContentAppStoryRecorder } from '@/services/contentService';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import GiftModal from './GiftModal';
import { Gift } from './GiftModal/types';
import More from './More';
import styles, { noticeModalStyles } from './styles';
import Title from './Title';

export function StoryChat() {
  const intl = useIntl();
  const router = useRouter();
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const { storyDetail, refreshStoryDetailAsync, fetchStoryDetailAsync } = useStoryProvider();
  const { userInfoRef } = useAuth();
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const listRef = useRef<MessageItem[]>([]);
  const chatListRef = useRef<ChatListRef>(null);
  const [isVisibleGiftModal, setIsVisibleGiftModal] = useState<boolean>(false);
  const [isVisibleMoreModal, setIsVisibleMoreModal] = useState<boolean>(false);
  const [callback, setCallback] = useState<(gift: Gift) => void>();
  const [noticeData, setNoticeData] = useState<
    | {
        chapterStatus: ChapterStatus;
        chapterProcess?: ChapterProcess;
      }
    | undefined
  >();

  const { loading: restarting, runAsync: fetchContentAppStoryRecorder } = useRequest(postContentAppStoryRecorder, {
    manual: true,
    debounceWait: 300,
  });

  useEffect(() => {
    if (storyId) {
      fetchStoryDetailAsync?.(storyId);
    }
  }, [fetchStoryDetailAsync, storyId]);

  useEffect(() => {
    if (storyDetail?.status === 'FAIL') {
      setNoticeData({
        chapterStatus: ChapterStatus.FAIL,
      });
    }
  }, [storyDetail]);

  const handleRestart = useCallback(async () => {
    const resp = await fetchContentAppStoryRecorder({
      storyId,
    });
    await refreshStoryDetailAsync?.(storyId);
    if (resp.data.code === 0) {
      router.back();
    }
  }, [fetchContentAppStoryRecorder, refreshStoryDetailAsync, router, storyId]);

  const handleChangeList = useCallback((v: MessageItem[]) => {
    listRef.current = v;
  }, []);

  return (
    <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior} style={[styles.container]}>
      <PageView
        source={
          storyDetail?.backgroundPicture || storyDetail?.backgroundPictureDark
            ? {
                uri: s3ImageTransform(
                  {
                    [Theme.LIGHT]: storyDetail?.backgroundPicture,
                    [Theme.DARK]: storyDetail?.backgroundPictureDark,
                  }[computedTheme] || '',
                  [750, 1344],
                ),
              }
            : placeholderImg
        }
        style={[styles.container]}>
        <NavBar
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
          title={<Title story={storyDetail} />}
          more={
            <View style={[styles.NavBarMore]}>
              <TouchableOpacity
                style={[styles.NavBarMoreIcon]}
                onPress={() => {
                  setChatSearchGlobalProps({
                    list: listRef.current,
                    botAvatar:
                      {
                        [Theme.LIGHT]: storyDetail?.cover,
                        [Theme.DARK]: storyDetail?.coverDark,
                      }[computedTheme] || placeholderUser,
                    userAvatar: userInfoRef?.current?.avatar || '',
                    onScroll: (item) => {
                      chatListRef.current?.scrollToItemAndHighlight({
                        item,
                      });
                    },
                  });

                  router.push({
                    pathname: '/main/chatSearch',
                    params: {},
                  });
                }}>
                <SearchOutline width={pxToDp(40)} height={pxToDp(40)} color={computedThemeColor.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.NavBarMoreIcon]}
                onPress={() => {
                  setIsVisibleMoreModal(true);
                }}>
                <MenuDotsFilled width={pxToDp(40)} height={pxToDp(40)} color={computedThemeColor.text} />
              </TouchableOpacity>
            </View>
          }
        />
        <View style={[styles.chatContainer]}>
          <Chat
            ref={chatListRef}
            chatId={storyId}
            request={async (params) => {
              const resp = await getContentAppStoryChatRecord({
                storyId: storyId,
                ...params,
              });
              return {
                data: (resp.data.data.list || []).reverse() as MessageItem[],
                total: resp.data.data.total || 0,
              };
            }}
            chatModule={ChatModule.story}
            onGiftSend={(callback) => {
              setCallback(() => {
                return callback;
              });
              setIsVisibleGiftModal(true);
            }}
            onChapterStatus={async (chapterStatus, chapterProcess) => {
              // 如果是进行中，进入下一章
              if (chapterStatus === ChapterStatus.PLAYING) {
                if (chapterProcess === ChapterProcess.NEXT) {
                  setNoticeData({ chapterStatus: ChapterStatus.SUCCESS, chapterProcess });
                }
              }

              // 成功直接弹窗
              if (chapterStatus === ChapterStatus.SUCCESS) {
                setNoticeData({ chapterStatus, chapterProcess });
              }

              // 失败直接弹窗
              if (chapterStatus === ChapterStatus.FAIL) {
                await refreshStoryDetailAsync?.(storyId);
                // noting   useEffect 里面已经自动弹窗了
              }
            }}
            onChangeList={handleChangeList}
            botAvatar={
              {
                [Theme.LIGHT]: storyDetail?.cover,
                [Theme.DARK]: storyDetail?.coverDark,
              }[computedTheme] || placeholderUser
            }
          />
        </View>
        {storyDetail && (
          <GiftModal
            story={storyDetail}
            visible={isVisibleGiftModal}
            onClose={(gift) => {
              setIsVisibleGiftModal(false);
              if (gift && callback) {
                callback(gift);
              }
            }}
          />
        )}
      </PageView>
      <Modal
        visible={!!noticeData}
        onOk={async () => {
          if (noticeData?.chapterStatus === ChapterStatus.SUCCESS) {
            if (noticeData?.chapterProcess === ChapterProcess.CURRENT) {
              sendAppsFlyerEvent(AFEventKey.AFFairyTaleInteractionCompleted);
            } else {
              sendAppsFlyerEvent(AFEventKey.AFFairyTaleStoryFinished);
            }
            setNoticeData(undefined);
            // 退到详情页 查看新的故事章节介绍
            router.back();
          }
          if (noticeData?.chapterStatus === ChapterStatus.FAIL) {
            const resp = await postContentAppStoryRecorder({
              storyId,
            });
            if (resp.data.code === 0) {
              setNoticeData(undefined);
            }
          }
        }}
        okButtonProps={{
          children: (() => {
            if (noticeData?.chapterStatus === ChapterStatus.FAIL) {
              return intl.formatMessage({ id: 'Restart' });
            }

            if (noticeData?.chapterStatus === ChapterStatus.SUCCESS) {
              // 章节成功，并且没有后续章节
              return noticeData?.chapterProcess === ChapterProcess.CURRENT
                ? intl.formatMessage({ id: 'StoryChat.Back' })
                : intl.formatMessage({ id: 'StoryChat.Enter' });
            }
            return '';
          })(),
        }}>
        <View style={[noticeModalStyles.container]}>
          {noticeData?.chapterStatus === ChapterStatus.SUCCESS && (
            <Image
              style={[noticeModalStyles.bg]}
              source={storyDetail?.passedPicture || ''}
              placeholder={placeholderImg}
              placeholderContentFit="cover"
              contentFit="cover"
            />
          )}
          {noticeData?.chapterStatus === ChapterStatus.FAIL && (
            <Image
              style={[noticeModalStyles.bg]}
              source={storyDetail?.failurePicture || ''}
              placeholder={placeholderImg}
              placeholderContentFit="cover"
              contentFit="cover"
            />
          )}

          <Text style={[noticeModalStyles.title]}>
            {noticeData?.chapterStatus === ChapterStatus.SUCCESS && 'CONGRATULATIONS!'}
            {noticeData?.chapterStatus === ChapterStatus.FAIL && 'Story Failed!'}
          </Text>

          <ScrollView style={[noticeModalStyles.content]}>
            {noticeData?.chapterStatus === ChapterStatus.SUCCESS && (
              <Text style={[noticeModalStyles.text]}>{storyDetail?.passedCopywriting}</Text>
            )}

            {noticeData?.chapterStatus === ChapterStatus.FAIL && (
              <Text style={[noticeModalStyles.text]}>{storyDetail?.failureCopywriting}</Text>
            )}
          </ScrollView>
        </View>
      </Modal>
      <More
        visible={isVisibleMoreModal}
        onClose={() => setIsVisibleMoreModal(false)}
        onRestart={handleRestart}
        restarting={restarting}
      />
    </KeyboardAvoidingView>
  );
}

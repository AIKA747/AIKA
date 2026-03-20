import { useRequest } from 'ahooks';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import Chat from '@/components/Chat';
import { ChatListRef } from '@/components/Chat/ChatList/types';
import { MessageItem } from '@/components/Chat/types';
import { MenuDotsFilled, SearchOutline } from '@/components/Icon';
import { ListRequestParams } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { AFEventKey } from '@/constants/AFEventKey';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useAuth } from '@/hooks/useAuth';
import { ChatModule } from '@/hooks/useChatClient';
import { useConfigProvider } from '@/hooks/useConfig';
import { setChatSearchGlobalProps } from '@/pages/ChatSearch';
import { putContentAppBotImage } from '@/services/agoraxin';
import { getBotAppChatRecords } from '@/services/huihua';
import { getBotAppBotId } from '@/services/jiqirenchaxun';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';

import More from './More';
import styles from './styles';
import Title from './Title';

export default function ExpertChat() {
  const { computedThemeColor } = useConfigProvider();
  const { userInfoRef } = useAuth();
  const intl = useIntl();

  const { expertId } = useLocalSearchParams<{ expertId: string }>();

  const [isVisibleMoreModal, setIsVisibleMoreModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | undefined>(0);

  const { data: expert, runAsync: runExpert } = useRequest(async () => {
    const resp = await getBotAppBotId({ id: expertId, botStatus: 'online' });
    return resp.data.data;
  });

  const listRef = useRef<MessageItem[]>([]);
  const chatListRef = useRef<ChatListRef>(null);
  const handleChangeList = useCallback((v: MessageItem[]) => {
    listRef.current = v;
  }, []);

  const handleChangeBotImg = async (cover?: string, avatar?: string, activeKey?: number) => {
    const res = await putContentAppBotImage({
      botId: expertId,
      botImage: {
        cover: cover || expert?.cover || '',
        avatar: expert?.avatar || '',
      },
    });

    if (res?.data.code === 0) {
      setActiveImageIndex(activeKey);
      await runExpert();
    } else {
      Toast.error(res?.data?.msg || intl.formatMessage({ id: 'failed' }));
    }
  };

  useEffect(() => {
    if (expert && expert?.album?.length > 0 && expert?.cover) {
      const index = expert.album.findIndex((x) => x === expert.cover);
      setActiveImageIndex(index);
    }
  }, [expert]);

  return (
    <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior} style={[styles.container]}>
      <PageView style={[styles.container]}>
        <NavBar
          // title={intl.formatMessage({ id: 'Back' })}
          title={<Title expert={expert} />}
          onBack={() => {
            sendAppsFlyerEvent(AFEventKey.AFExpertSessionCompleted);
            router.back();
          }}
          more={
            <View style={[styles.NavBarMore]}>
              <TouchableOpacity
                style={[styles.NavBarMoreIcon]}
                onPress={() => {
                  setChatSearchGlobalProps({
                    list: listRef.current,
                    botAvatar: '',
                    userAvatar: userInfoRef?.current?.avatar || '',
                    onScroll: (item) => {
                      chatListRef.current?.scrollToItemAndHighlight({ item });
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
            chatModule={ChatModule.bot}
            chatId={expertId}
            botAvatar={expert?.avatar}
            onChangeList={handleChangeList}
            request={async function (params: ListRequestParams & Record<string, any>): Promise<{
              data: MessageItem[];
              total: number;
            }> {
              const resp = await getBotAppChatRecords({ ...params, botId: expertId });
              return {
                data: (resp.data.data.list || []).reverse() as MessageItem[],
                total: resp.data.data.total || 0,
              };
            }}
          />
        </View>
      </PageView>

      {isVisibleMoreModal && expert ? (
        <More
          visible
          expert={expert}
          onClose={() => setIsVisibleMoreModal(false)}
          onChangeImg={handleChangeBotImg}
          defaultActiveKey={activeImageIndex}
        />
      ) : undefined}
    </KeyboardAvoidingView>
  );
}

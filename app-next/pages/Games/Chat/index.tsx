import { useRequest } from 'ahooks';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import Chat from '@/components/Chat';
import { ChatListRef } from '@/components/Chat/ChatList/types';
import { MessageItem } from '@/components/Chat/types';
import { MenuDotsFilled, SearchOutline } from '@/components/Icon';
import { ListRequestParams } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { placeholderImg } from '@/constants';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useAuth } from '@/hooks/useAuth';
import { ChatModule } from '@/hooks/useChatClient';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { setItem } from '@/hooks/useStorageState/utils';
import { setChatSearchGlobalProps } from '@/pages/ChatSearch';
import { getBotAppGameChatRecords, getBotAppGameId, postBotAppGameThread } from '@/services/youxi';
import pxToDp from '@/utils/pxToDp';

import ChatMoreAction from './More';
import styles from './styles';
import Title from './Title';

export default function GameChat() {
  const { userInfoRef } = useAuth();
  const { computedTheme, computedThemeColor } = useConfigProvider();

  const { gameId, gameThreadId } = useLocalSearchParams<{ gameId: string; gameThreadId: string }>();
  const [isVisibleMoreModal, setIsVisibleMoreModal] = useState(false);

  const { data: game } = useRequest(
    async () => {
      const resp = await getBotAppGameId({ id: gameId });
      return resp.data.data;
    },
    { debounceWait: 300, refreshDeps: [gameId] },
  );

  const { refreshAsync: handleRestart, loading: restarting } = useRequest(
    async () => {
      if (!gameId) return;
      const resp = await postBotAppGameThread({ gameId, restart: true });
      if (!resp.data.data) return;
      router.back();
    },
    {
      manual: true,
      debounceWait: 300,
      refreshDeps: [gameId],
    },
  );

  const listRef = useRef<MessageItem[]>([]);
  const chatListRef = useRef<ChatListRef>(null);
  const handleChangeList = useCallback((v: MessageItem[]) => {
    listRef.current = v;
  }, []);

  return (
    <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior} style={[styles.container]}>
      <PageView
        source={
          game?.cover || game?.coverDark
            ? {
                uri:
                  {
                    [Theme.LIGHT]: game?.cover,
                    [Theme.DARK]: game?.coverDark,
                  }[computedTheme] || '',
              }
            : placeholderImg
        }
        style={[styles.container]}>
        <NavBar
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
          title={<Title bot={game} />}
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
            chatModule={ChatModule.game}
            chatId={gameThreadId}
            botAvatar={game?.avatar}
            onChangeList={handleChangeList}
            onGameResult={async (result) => {
              const resultKey = `${gameId}-${gameThreadId}-result`;
              await setItem(resultKey, result);
              router.push({
                pathname: '/main/games/result/[gameId]',
                params: {
                  gameId,
                  gameThreadId,
                  resultKey,
                },
              });
            }}
            request={async function (params: ListRequestParams & Record<string, any>): Promise<{
              data: MessageItem[];
              total: number;
            }> {
              const resp = await getBotAppGameChatRecords({ ...params, threadId: gameThreadId });
              return {
                data: (resp.data.data.list || []).reverse() as MessageItem[],
                total: resp.data.data.total || 0,
              };
            }}
          />
        </View>
        <ChatMoreAction
          visible={isVisibleMoreModal}
          onClose={() => setIsVisibleMoreModal(false)}
          onRestart={handleRestart}
          restarting={restarting}
        />
      </PageView>
    </KeyboardAvoidingView>
  );
}

import { useRequest } from 'ahooks';
import { type AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';

import { MessageItem } from '@/components/Chat/types';
import { GroupConversation, GroupMsg } from '@/database/models';
import { createConversation, saveGroupMessages } from '@/database/services';
import { syncWithServerConversations } from '@/database/services/sync';
import { useAuth } from '@/hooks/useAuth';
import { BaseMessageDTO, ChatModule, MsgType, useChatClientProvider } from '@/hooks/useChatClient';
import { useConfigProvider } from '@/hooks/useConfig';
import { GroupChatContextProps } from '@/hooks/useGroupChat/types';
import { getBotAppChatroom, getBotAppChatroomId } from '@/services/pinyin2';

const GroupChatContent = createContext<GroupChatContextProps>({
  conversations: [],
  setConversations(
    value:
      | ((prevState: GroupConversation[] | undefined) => GroupConversation[] | undefined)
      | GroupConversation[]
      | undefined,
  ): void {},
  chatRoomDetail: null,
  setChatRoomDetail: () => {},
  fetchChatRoomDetail: async () => {},
  refreshChatRoomDetail: () => {},
  refreshAsyncChatRoomDetail: async () => {},
  chatRoomDetailLoading: false,
  syncError: {},
});

const GroupChatProvider = ({ children }: PropsWithChildren) => {
  const { userInfo } = useAuth();
  const { eventEmitter } = useConfigProvider();
  const { client, clientStatus } = useChatClientProvider();

  // 当前聊天室 id，目前用于在消息推送同步聊天列表数据时，不更新 'unreadNum'
  const currentConversationIdRef = useRef<string>('-1');
  const [conversations, setConversations] = useState<GroupConversation[]>();
  const [syncError, setSyncError] = useState<Record<string, boolean>>({});
  const [chatRoomDetail, setChatRoomDetail] = useState<API.ChatGroupDetail | null>(null);

  const {
    runAsync: fetchChatRoomDetail,
    refresh: refreshChatRoomDetail,
    refreshAsync: refreshAsyncChatRoomDetail,
    loading: chatRoomDetailLoading,
  } = useRequest(
    async ({ type, val }: { type: 'id' | 'code'; val: string }) => {
      let res: AxiosResponse<{ code: number; msg: string; data: API.ChatGroupDetail }, any>;
      if (type === 'code') {
        res = await getBotAppChatroom({ code: val });
      } else {
        res = await getBotAppChatroomId({ id: val });
      }
      if (res.data?.data?.id) setChatRoomDetail(res.data.data);
    },
    { manual: true },
  );

  // 用户登录 - 同步消息
  useEffect(() => {
    if (!userInfo?.userId) return;
    syncWithServerConversations();
    return () => {
      setSyncError({});
    };
  }, [userInfo?.userId]);

  // websocket 成功连接 / 重新连接  - 同步消息（网络问题这里也能体现，所以暂不需要判断 isInternetReachable，可优化将网络断连时提示用户）
  // 上面的 effect 中尝试 api 同步消息的过程，可能与 mqtt 建立连接之间的时间中存在接收不到的消息，这里需要再同步一下
  useEffect(() => {
    if (clientStatus !== 'Connected') return;
    syncWithServerConversations()
      .then(() => eventEmitter?.emit({ method: 'mqtt-connected-and-synced' })) // 连接成功，且用户在聊天页面，聊天页面若漏了新消息，展示出新消息
      .catch(() => {});
  }, [clientStatus, eventEmitter]);

  // mqtt 聊天新消息推送同步列表数据
  useEffect(() => {
    if (!client || clientStatus !== 'Connected') return;

    const msgListener = async (data: BaseMessageDTO<MsgType>) => {
      // prettier-ignore
      if (data?.chatModule !== ChatModule.group || data.msgType !== MsgType.CHAT_MSG || !data.msgData?.msgId) return;

      const messageItem = data.msgData as MessageItem;
      const { objectId } = messageItem;

      const msg = {
        conversationId: objectId!,
        ...messageItem,
      };
      await saveGroupMessages([msg]);

      const conversation = conversations?.find((x) => x.conversationId === `${objectId}`);
      if (conversation) {
        console.log('收到群消息，更新最后一条消息', messageItem);
        console.log('currentConversationIdRef.current', currentConversationIdRef.current);
        console.log('objectId', objectId);
        // 当前聊天室，且在聊天页面，更新最后一条消息但不更新 'unreadNum'
        if (currentConversationIdRef.current === objectId)
          await conversation.updateLastMessage(msg as unknown as GroupMsg, 0);
        else await conversation.updateLastMessage(msg as unknown as GroupMsg, 1);
      } else {
        const res = await getBotAppChatroomId({ id: objectId! });
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
        } = res?.data?.data;
        await createConversation({
          conversationId: String(id),
          roomName: roomName || '',
          roomAvatar: roomAvatar || '',
          roomCode: roomCode || '',
          roomType: roomType,
          description: description || '',
          groupType: groupType,
          updater: String(updater),
          creator: String(creator),
          updatedAt: dayjs(updatedAt).toDate(),
          createdAt: dayjs(createdAt).toDate(),
          lastMessage: msg as unknown as GroupMsg,
          unreadNum: 1,
        });
      }
    };
    client.addMessageListener(msgListener);
    return () => client.removeMessageListener(msgListener);
  }, [client, clientStatus, conversations]);

  return (
    <GroupChatContent.Provider
      value={{
        currentConversationIdRef,
        conversations,
        setConversations,
        chatRoomDetail,
        setChatRoomDetail,
        fetchChatRoomDetail,
        refreshChatRoomDetail,
        refreshAsyncChatRoomDetail,
        chatRoomDetailLoading,
        syncError,
      }}>
      {children}
    </GroupChatContent.Provider>
  );
};

export * from './types';
export const useGroupChatProvider = () => useContext(GroupChatContent);
export default GroupChatProvider;

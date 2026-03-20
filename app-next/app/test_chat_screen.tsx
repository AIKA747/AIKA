import { withObservables } from '@nozbe/watermelondb/react';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Button, View, Text } from 'react-native';

import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { database } from '@/database';
import { GroupConversation, GroupMsg } from '@/database/models';
import { TableName } from '@/database/schema';
import pxToDp from '@/utils/pxToDp';

function TestChatChild({ conversation, messages }: { conversation: GroupConversation; messages: GroupMsg[] }) {
  const listRef = useRef<FlashListRef<GroupMsg>>(null);

  // const { data } = useRequest(() => conversation.messages.observe(), { debounceWait: 300 });
  console.log('messages:', messages);

  // getAllMessages().then((messages) => {
  //   console.log('getAllMessages result:', messages);
  // });
  //
  // getMessagesByConversationId(conversation.conversationId).then((messages) => {
  //   console.log('getMessagesByConversationId result:', messages);
  // });
  return (
    <PageView>
      <NavBar title={conversation.roomName} />
      <View>
        <Button
          onPress={() => {
            // listRef.current?.scrollToIndex({ index: 10, viewPosition: 0.5, animated: true });
            listRef.current?.scrollToItem({ item: messages[10], viewPosition: 0.5, animated: true });
          }}
          title={'跳转到第 10 条'}
        />
        <Button
          onPress={() => {
            // listRef.current?.scrollToIndex({ index: 50, viewPosition: 0.5, animated: true });
            listRef.current?.scrollToItem({ item: messages[50], viewPosition: 0.5, animated: true });
          }}
          title={'跳转到第 50 条'}
        />
        <Button
          onPress={() => {
            // listRef.current?.scrollToIndex({ index: 99, viewPosition: 0.5, animated: true });
            listRef.current?.scrollToItem({ item: messages[100], viewPosition: 0.5, animated: true });
          }}
          title={'跳转到第 100 条'}
        />
        <Button
          onPress={() => {
            // listRef.current?.scrollToIndex({ index: 999, viewPosition: 0.5, animated: true });
            listRef.current?.scrollToItem({ item: messages[messages.length - 1], viewPosition: 0.5, animated: true });
          }}
          title={'跳转到第 最后 1 条， 共' + messages.length + '条'}
        />
        {/*<Text style={{ color: '#fff' }}>{[...data]}</Text>*/}
      </View>
      <FlashList
        ref={listRef}
        // maxItemsInRecyclePool={0}
        data={messages.reverse()}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#fff', flex: 1 }} />}
        renderItem={({ item, index }) => {
          return (
            <View style={{ paddingVertical: pxToDp(20) }}>
              <Text style={{ color: '#fff' }}>
                flash list item {item.nickname} - {index + 1}
              </Text>
              <Text style={{ color: '#fff' }}>{item.textContent || '--'}</Text>
              <Text>44455</Text>
            </View>
          );
        }}
      />
    </PageView>
  );
}

// const enhance = withObservables<
//   { conversation: GroupConversation; roomName: string },
//   {
//     conversation: GroupConversation;
//     messages: GroupMsg[];
//     roomName: string;
//   }
// >(['conversation'], ({ conversation, roomName }) => ({
//   roomName,
//   conversation: conversation.observe(),
//   messages: [],
// }));
const enhance = withObservables(['conversation'], ({ conversation }) => {
  return {
    conversation,
    messages: conversation.messages, // 自动监听关联的 messages
  };
});
const TestChatScreenWrapper = enhance(TestChatChild);

export default function TestChatScreen() {
  const { conversationDbId } = useLocalSearchParams<{ conversationDbId: string; roomName: string }>();
  // const conversation = database.get<GroupConversation>(TableName.GROUP_CONVERSATION).findAndObserve(conversationDbId);
  const [conversation, setConversation] = useState<GroupConversation>();
  database
    .get<GroupConversation>(TableName.GROUP_CONVERSATION)
    .find(conversationDbId)
    .then((result) => {
      setConversation(result);
    });
  if (!conversation) {
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );
  }

  return <TestChatScreenWrapper conversation={conversation} />;
}

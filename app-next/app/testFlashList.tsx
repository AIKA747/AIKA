import { withObservables } from '@nozbe/watermelondb/react';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useRef } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';

import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import { database } from '@/database';
import { GroupConversation } from '@/database/models';
import { TableName } from '@/database/schema';
import pxToDp from '@/utils/pxToDp';

function TestFlashList({ conversations }: { conversations: GroupConversation[] }) {
  const listRef = useRef<FlashListRef<GroupConversation>>(null);
  return (
    <PageView>
      <NavBar />
      <View>
        <Button
          onPress={() => {
            listRef.current?.scrollToIndex({ index: 10, viewPosition: 0.5, animated: true });
            // listRef.current?.scrollToItem({ item: 10, viewPosition: 0.5, animated: true });
          }}
          title={'跳转到第 10 条'}
        />
        <Button
          onPress={() => {
            listRef.current?.scrollToIndex({ index: 50, viewPosition: 0.5, animated: true });
            // listRef.current?.scrollToItem({ item: 50, viewPosition: 0.5, animated: true });
          }}
          title={'跳转到第 50 条'}
        />
        <Button
          onPress={() => {
            // listRef.current?.scrollToIndex({ index: 99, viewPosition: 0.5, animated: true });
            // listRef.current?.scrollToItem({ item: 100, viewPosition: 0.5, animated: true });
          }}
          title={'跳转到第 100 条'}
        />
        <Button
          onPress={() => {
            listRef.current?.scrollToIndex({ index: 99, viewPosition: 0.5, animated: true });
            // listRef.current?.scrollToItem({ item: 1000, viewPosition: 0.5, animated: true });
          }}
          title={'跳转到第 1000 条'}
        />
        {/*<Text style={{ color: '#fff' }}>{[...data]}</Text>*/}
      </View>
      <FlashList
        ref={listRef}
        // maxItemsInRecyclePool={0}
        data={[...conversations]}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#fff', flex: 1 }} />}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/test_chat_screen',
                  params: {
                    conversationDbId: item.id,
                  },
                });
              }}>
              <View style={{ paddingVertical: pxToDp(20) }}>
                <Text style={{ color: '#fff' }}>
                  flash list item {item.roomName} - {index + 1}
                </Text>
                <Text style={{ color: '#fff' }}>weeqeqeqeqeqeqewqeqewqewqeqeq</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </PageView>
  );
}

const enhance = withObservables([], () => ({
  conversations: database.get<GroupConversation>(TableName.GROUP_CONVERSATION).query().observe(),
}));

const TestFlashListWithPage = enhance(TestFlashList);

export default TestFlashListWithPage;

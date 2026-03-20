import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditSquareOutline, MenuDotsFilled } from '@/components/Icon';
import SearchBar from '@/components/SearchBar';
import { database } from '@/database';
import { GroupConversation } from '@/database/models';
import { TableName } from '@/database/schema';
import { useConfigProvider } from '@/hooks/useConfig';
import ChatsTabView from '@/pages/Chats/components/chats-tab-view';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';

function Chats({ conversations }: { conversations: GroupConversation[] }) {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor: theme } = useConfigProvider();

  const [filter, setFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectable, setSelectable] = useState(false);
  const [showMoreAction, setShowMoreAction] = useState(false);

  const handleTabChange = useCallback((tab: number) => {
    setFilter('');
    setActiveTab(tab);
    setSelectable(false);
    setShowMoreAction(false);
  }, []);

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <View style={styles.topBox}>
        <View style={[styles.searchBox]}>
          <SearchBar showCancel={false} onSearch={setFilter} />
        </View>

        {activeTab === 0 && (
          <>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/main/group-chat/create' })}
              style={[styles.newBtn, { backgroundColor: theme.bg_secondary }]}>
              <EditSquareOutline color={theme.text_secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.moreBtn, { backgroundColor: theme.bg_secondary }]}
              onPress={(e) => (selectable ? setSelectable(false) : setShowMoreAction(true))}>
              {selectable ? (
                <Text style={[styles.doneText, { color: theme.text }]}>
                  {intl.formatMessage({ id: 'updateEmail.done' })}
                </Text>
              ) : (
                <MenuDotsFilled width={pxToDp(40)} height={pxToDp(40)} color={theme.text_secondary} />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      <ChatsTabView
        conversations={conversations}
        filter={filter}
        onTabChange={handleTabChange}
        selectable={selectable}
        setSelectable={setSelectable}
        showMoreAction={showMoreAction}
        setShowMoreAction={setShowMoreAction}
      />
    </View>
  );
}
const enhance = withObservables([], () => ({
  conversations: database
    .get<GroupConversation>(TableName.GROUP_CONVERSATION)
    .query(Q.sortBy('last_message_created_at', Q.desc))
    .observe(),
}));

const ChatsScreen = enhance(Chats);
export default ChatsScreen;
